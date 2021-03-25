export type ObjectId = string & Partial<{
  toHexString(): string;
}>;

export type ItemIdV1 = ObjectId;
export type ItemId = ItemIdV1;

export interface FreshItem {
  name: string;
  description?: string;

  owner: ItemId;
  group: ItemId;
}

export interface BaseItem extends FreshItem {
  _id: ItemId;
}
