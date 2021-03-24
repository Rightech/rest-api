export type ObjectId = string & {
  getTimestamp(): Date;
  toHexString(): string;
  equals(other: ObjectId): boolean;
};

export type ItemIdV1 = ObjectId;
export type ItemId = ItemIdV1;

export interface BaseItem {
  _id: ItemId;

  name: string;
  description?: string;

  owner: ItemId;
  group: ItemId;
}
