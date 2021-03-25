import { Base } from "./base";

import { Model } from "./models";
import { RicObject } from "./objects";

import { Event } from "./events";

import { Geofence } from "./geofences";
import { Scene } from "./scenes";

import { Role } from "./roles";
import { Group } from "./groups";
import { User } from "./users";

export interface WellKnown {
  base: Base;

  models: Model;
  objects: RicObject;

  events: Event;

  geofences: Geofence;
  scenes: Scene;

  roles: Role;
  groups: Group;
  users: User;
}
