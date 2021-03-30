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

// type Base = Fresh & { _id: ItemId };

export interface Base {
  _id: ItemId;
  name: string;
  description?: string;

  owner?: ItemId;
  group?: ItemId;
}