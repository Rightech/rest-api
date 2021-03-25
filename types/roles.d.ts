import type { Base, ItemId } from "./base";

export interface Role extends Base {
  credentials: string[];
}
