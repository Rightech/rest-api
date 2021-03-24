import { BaseItem } from "./base";
import { Model } from "./models";
import { RicObject } from "./objects";

import { Event } from "./events";


export interface WellKnown {
  base: BaseItem;

  models: Model;
  objects: RicObject;

  events: Event;
}
