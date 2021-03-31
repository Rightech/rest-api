import type { Base, ItemId } from "./base";

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
