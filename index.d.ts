/* ----- api/v1 ----- */

interface BaseItem {}

/** test comment */
export type ItemId = string;

export interface BaseItem {
  _id: ItemId;

  name: string;
  description?: string;

  owner: ItemId;
  group: ItemId;
}


export declare class ApiError extends Error {
  url: string;
  code: number;
  tags: string[];
  helper: {
    message?: string;
    links?: string[];
  };
}

export declare class NginxError extends ApiError {
  title: string;
}

export interface ApiResponse {
  success: boolean;
}

/* ----- api/v1/models ----- */

export type BaseNode = {
  type: string;
  id: string;
  name: string;
  description?: string;
  active: boolean;
  children?: ModelNode[];
};

export type SystemNode = BaseNode & {
  type: "subsystem";
};

export type EventNode = BaseNode & {
  type: "event";
};

export type ActionNode = BaseNode & {
  type: "action";
  service: string;
  command?: string;
  params?: Record<string, string>;
};

export type ArgumentNode = BaseNode & {
  type: "argument";
  dataType: ArgumentDataType;
  unit?: string;
};

export type ArgumentDataType =
  | "number"
  | "boolean"
  | "string"
  | "object"
  | string;

export type ModelNode =
  | BaseNode
  | SystemNode
  | EventNode
  | ArgumentNode
  | ActionNode;


export type ModelProps = {
  bots?: boolean;
  protocol?: string;
  idPattern?: string;
};

export interface Model extends BaseItem {
  base: string;
  data: ModelNode;
  props?: ModelProps;
}


/* ----- api/v1/objects ----- */

export type BaseState = {
  [argumentId: string]: number | boolean | string | BaseState;
};

export type BaseConfig = {
  [parentId: string]: {
    [argumentId: string]: number | boolean | string;
  };
};

export interface RicObject<TState = BaseState, TConfig = BaseConfig>
  extends BaseItem {
  id: string;
  model: ItemId;

  state?: TState;
  config?: TConfig;
}

/**
 * Type alias exported, but not recommended to use
 * sinse it conflicts with JavaScript `Object` built-in
 */
export type Object<TState = BaseState, TConfig = BaseConfig> = RicObject<
  TState,
  TConfig
>;



/* ----- api/v1/events ----- */
export interface Event<T = unknown> {
  _msgid: string;
  _oid?: ItemId;
  _gid?: ItemId;

  service?: string;
  event: string;
  time: number;
  data: T;
}


export interface ClientOpts {
  url?: string;
  token?: string;
}

type Split<S extends string, D extends string> = string extends S
  ? string[]
  : S extends ""
  ? []
  : S extends `${infer T}${D}${infer U}`
  ? [T, ...Split<U, D>]
  : [S];

type TypeRegistryGet<TProp> = TProp extends keyof TypeRegistry
  ? TypeRegistry[TProp]
  : TypeRegistry["base"];

export interface TypeRegistry {
  base: BaseItem;
}

export interface TypeRegistry {
  base: BaseItem;

  models: Model;
  objects: RicObject;

  events: Event;
}


export declare class Client {
  constructor(opts?: ClientOpts);

  get<P extends string = "base", T = TypeRegistryGet<Split<P, "/">[0]>>(
    path: P
  ): Promise<T[]>;

  post<
    P extends string = "base",
    T = TypeRegistryGet<Split<P, "/">[0]>,
    U = Partial<T>
  >(path: P, data: U): Promise<T>;

  patch<
    P extends string = "base",
    T = TypeRegistryGet<Split<P, "/">[0]>,
    U = Partial<T>
  >(path: P, data: U): Promise<T>;

  delete<P extends string = "base", T = TypeRegistryGet<Split<P, "/">[0]>>(
    path: P
  ): Promise<T>;

  get<T = unknown>(path: string): Promise<T[]>;
  post<T = unknown>(path: string, data: Partial<T>): Promise<T>;
  patch<T = unknown>(path: string, data: Partial<T>): Promise<T>;
  delete<T = unknown>(path: string): Promise<T>;

  with(opts?: ClientOpts): Client;
}

export declare function getDefaultClient(opts?: ClientOpts): Client;
declare const _default: Client;
export default _default;
