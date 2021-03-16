import { BaseItem } from "./base";
import { Model } from "./models";
import { RicObject } from "./objects";

export interface TypeRegistry {
  base: BaseItem;

  models: Model;
  objects: RicObject;
}
