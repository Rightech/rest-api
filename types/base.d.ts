export type ObjectId = string &
  Partial<{
    toHexString(): string;
  }>;

export type ItemIdV1 = ObjectId;
export type ItemId = ItemIdV1;

export interface Base {
  _id: ItemId;
  name: string;
  time: number;
  description?: string;

  owner?: ItemId;
  group?: ItemId;

  links?: Record<string, Link[]>;
}

export interface Link {
  session: string;
  time: number;
  id: ItemId;
}

export type Fresh = Omit<Base, "_id">;
