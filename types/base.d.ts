export type ItemId = string;

export interface BaseItem {
  _id?: ItemId;

  name?: string;
  description?: string;

  owner?: ItemId;
  group?: ItemId;

  access?: ItemId[];

  time?: number;
  _at?: number;
}

export interface GrpcCtx {
  groupId?: string;
  userId?: string;
  spanId?: string;
}
