/* ----- api/v1 ----- */

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

export interface ClientOpts {
  url?: string;
  token?: string;
}

export declare class Client {
  url: string;
  token: string;
  constructor(opts: ClientOpts);
  getDefaultHeaders(): {
    [k: string]: string;
  };
  get<T = unknown>(path: string, query?: {}): Promise<T>;
  post<T = unknown>(path: string, data?: Partial<T>): Promise<T>;
  patch<T = unknown>(path: string, data?: Partial<T>): Promise<T>;
  delete<T = unknown>(path: string): Promise<T>;
  with(opts?: ClientOpts): Client;
}

/* ----- api/v1/models ----- */

export interface BaseNode {
  type: string;
  id: string;
  name: string;
  description?: string;
  active: boolean;
  children?: ModelNode[];
}

export interface SystemNode extends BaseNode {
  type: 'subsystem';
}

export interface EventNode extends BaseNode {
  type: 'event';
}

export interface ArgumentNode extends BaseNode {
  type: 'argument';
  dataType: 'number' | 'boolean' | 'string' | string;
  unit?: string;
}

export interface ActionNode extends BaseNode {
  type: 'action';
  service?: string;

  /** js-doc test 1 */
  command?: string;
  
  /** js-doc test 2 */
  params?: unknown;
}

export type ModelNode = BaseNode
  | SystemNode
  | EventNode
  | ArgumentNode
  | ActionNode;

export interface Model extends BaseItem {
  base: string;
  data: ModelNode;

  props?: {
    bots?: boolean;
    protocol?: string;
    idPattern?: string;
  };
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

