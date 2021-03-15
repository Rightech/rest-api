/** test comment */
export type ItemId = string;

export interface BaseItem {
  _id: ItemId;

  name: string;
  description?: string;

  owner: ItemId;
  group: ItemId;
}
