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

  owner?: ItemId;
  group?: ItemId;
}

export interface Base {
  _id: ItemId;
  name: string;
  description?: string;

  owner?: ItemId;
  group?: ItemId;
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

export interface Model extends Base {
  base: string;
  data: ModelNode;
  props?: ModelProps;
}


/* ----- api/v1/objects ----- */
export type ServiceState = {
  _v: number;
  _ts: number;
  _oid: ItemId;
  _gid: ItemId;

  time: number;
  online: boolean;
};

export type GeographyState = {
  lat: number;
  lon: number;
};

export type GeometryState = {
  x: number;
  y: number;
  z?: number;
};

export type GpsState = GeographyState & {
  alt: number;
  speed: number;
  sats?: number;
};

/**  we love MQTT so much that we even defined it in base types
 *     (but we really shouldn't)  */
export type MqttState = {
  topic: string;
  payload: string;
};

export type State = ServiceState
  & GpsState
  & MqttState 
  & GeometryState 
  & {
    [argumentId: string]: number | boolean | string;
  };

export type Config = {
  [parentId: string]: {
    [argumentId: string]: number | boolean | string;
  };
};

export type Packet = Partial<State>;

export interface RicObject<TState = State, TConfig = Config> extends Base {
  id: string;
  model: ItemId;

  state?: Readonly<TState>;
  config?: TConfig;
}

/**
 * Type alias exported, but not recommended to use
 * sinse it conflicts with JavaScript `Object` built-in
 */
export type Object<TState = State, TConfig = Config> = RicObject<
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


/* ----- api/v1/geofences ----- */
export type Geography = [lat: number, lon: number];

export type GeographyType =
  | "polygon"
  | "polyline"
  | "marker"
  | "circle"
  | "rectangle"
  | "route"
  | string;

export type Geopoint = {
  type: "marker" | "circle";
  center: Geography;
};

export type Geoline = {
  type: "polygon" | "polyline" | "rectangle";
  points: Geography[];
};

export type Waypoint = {
  center: Geography;
  name: string;
  check?: boolean;
};

export type GeorouteTrip = {
  type: "direct" | "return";
  points: Geography[];
  waypoints: Waypoint[];
};

export type Georoute = {
  type: "route";
  trips: GeorouteTrip[];
};

export type Geoshape = Geopoint | Geoline | Georoute;

export interface Geofence extends Base {
  color?: string;
  shape?: Geoshape;
  floors?: Floor[];
}


/* ----- api/v1/scenes ----- */
export type Geometry = [x: number, y: number, z?: number];

export interface Room {
  id: string;
  name: string;
  points: Geometry[];
}

export interface Beacon {
  name: string;
  id?: string;
  type?: string;
  x: number;
  y: number;
  z?: number;
}

export interface Floor {
  kind: "floor" | "template";
  name?: string;

  floorId: string;
  sceneId: ItemId;

  heightFrom?: number;
  heightTo?: number;

  beacons?: Beacon[];
}

export interface Scene extends Base {
  type: "2d" | "3d";
  file: ItemId;
  props?: Record<string, string>;
}


/* ----- api/v1/roles ----- */
export interface Role extends Base {
  credentials: string[];
}


/* ----- api/v1/groups ----- */
export interface Group extends Base {
  role: ItemId;

  tagname: string;
  license?: ItemId;
}


/* ----- api/v1/users ----- */
export interface User extends Base {
  role: ItemId;

  /** 
    @validate required, unique
  */
  email: string;

  /** 
    @validate required, unique, alphanumeric, min:4, max:40
  */
  login: string;

  /* not stored in db and logs */
  password?: string;

  phone: string;
  locale: string;
  timezoneOffset: number;
}


/* ----- api/v1/index ----- */
export interface WellKnown {
  base: Base;

  models: Model;
  objects: RicObject;

  events: Event;

  geofences: Geofence;
  scenes: Scene;

  roles: Role;
  groups: Group;
  users: User;
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
