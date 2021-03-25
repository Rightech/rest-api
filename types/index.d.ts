import { Base } from "./base";
import { Model } from "./models";
import { RicObject } from "./objects";

import { Event } from "./events";


export interface WellKnown {
  base: Base;

  models: Model;
  objects: RicObject;

  events: Event;
}
