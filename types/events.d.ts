import type { ItemId } from "./base";

type ShortCtx = {
  rid?: string;
  uid?: ItemId;
  gid?: ItemId;
};

type AccessCtx = {
  group: ItemId;
  owner: ItemId;
  branch: ItemId[];
  access: ItemId[];
};

export interface Event<T = unknown> {
  _msgid: string;
  _oid?: ItemId;
  _gid?: ItemId;

  service?: string;
  event: string;
  time: number;
  data: T;
}

export type EventMessage<T> = Event<T> & {
  _v2: 1;
  _ctx?: ShortCtx;
  _acx?: AccessCtx;
};
