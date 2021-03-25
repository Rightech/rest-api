/* ----- api/v1 ----- */

export type ObjectId = string &
  Partial<{
    toHexString(): string;
  }>;

export type ItemIdV1 = ObjectId;

export type ItemId = ItemIdV1;

export interface Fresh {
  name: string;
  description?: string;

  owner: ItemId;
  group: ItemId;
}

export type Staged = Fresh & {
  _id: ItemId;
};

export type Base = Staged;


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

export interface Model extends Base {
  base: string;
  data: ModelNode;
  props?: ModelProps;
}


/* ----- api/v1/objects ----- */
export type ServiceState = {
  _ts: number;
  _oid: ItemId;
  _gid: ItemId;
  time: number;
  online: boolean;
};

export type BaseState = ServiceState & {
  [argumentId: string]: number | boolean | string | BaseState;
};

export type BaseConfig = {
  [parentId: string]: {
    [argumentId: string]: number | boolean | string;
  };
};

export interface RicObject<TState = BaseState, TConfig = BaseConfig>
  extends Base {
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


/* ----- api/v1/index ----- */
export interface WellKnown {
  base: Base;

  models: Model;
  objects: RicObject;

  events: Event;
}




/* ----- client lib ----- */

export type ApiErrorHelper = {
  message: string;
  links?: string[];
};

export interface ApiError extends Error {
  url: string;
  code: number;
  tags: string[];
  helper: ApiErrorHelper;
}

export type DeprecatedResponseV1 = {
  codes: string[];
  success: boolean;
};

export type DeprecatedResponseV2 = {};

export type DeprecatedResponse = DeprecatedResponseV1 & DeprecatedResponseV2;

export interface ClientOpts {
  url?: string;
  token?: string;
}

export interface Client {
  new (opts?: ClientOpts): Client;

  get<T = unknown>(path: string): Promise<T[]>;
  post<T = unknown>(path: string, data: Partial<T>): Promise<T>;
  patch<T = unknown>(path: string, data: Partial<T>): Promise<T>;
  delete<T = unknown>(path: string): Promise<T>;
}

type Split<S extends string, D extends string> = string extends S
  ? string[]
  : S extends ""
  ? []
  : S extends `${infer T}${D}${infer U}`
  ? [T, ...Split<U, D>]
  : [S];

type WellKnownGet<TProp> = TProp extends keyof WellKnown
  ? WellKnown[TProp]
  : WellKnown["/"];

export interface WellKnown {
  ["/"]: any;
  [""]: any;
}

export interface MoreTypedClient {
  get<P extends string = "/", T = WellKnownGet<Split<P, "/">[0]>>(
    path: P
  ): Promise<T[]>;

  post<
    P extends string = "/",
    T = WellKnownGet<Split<P, "/">[0]>,
    U = Partial<T>
  >(
    path: P,
    data: U
  ): Promise<T>;

  patch<
    P extends string = "/",
    T = WellKnownGet<Split<P, "/">[0]>,
    U = Partial<T>
  >(
    path: P,
    data: U
  ): Promise<T>;

  delete<P extends string = "/", T = WellKnownGet<Split<P, "/">[0]>>(
    path: P
  ): Promise<T>;
}


/* ----- client lib exports ----- */

export declare function getDefaultClient(opts?: ClientOpts): Client & MoreTypedClient;
declare const _default: Client & MoreTypedClient;
export default _default;
