import type { Base, ItemId } from "./base";

export interface Group extends Base {
  role: ItemId;

  tagname: string;
  license?: ItemId;
}
