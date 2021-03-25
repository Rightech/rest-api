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
