export type ObjectId = string &
  Partial<{
    toHexString(): string;
  }>;

export type ItemIdV1 = ObjectId;
export type ItemId = ItemIdV1;

export interface Base {
  _id: ItemId;
  name: string;
  description?: string;

  owner?: ItemId;
  group?: ItemId;
}

export type Fresh = Omit<Base, "_id">;
