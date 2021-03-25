import type { Base, ItemId } from "./base";

export type Geometry = [x: number, y: number, z?: number];

export interface Room {
  id: string;
  name: string;
  points: Geometry[];
}

export interface Beacon {
  name: string;
  id?: string;
  type?: string;
  x: number;
  y: number;
  z?: number;
}

export interface Floor {
  kind: "floor" | "template";
  name?: string;

  floorId: string;
  sceneId: ItemId;

  heightFrom?: number;
  heightTo?: number;

  beacons?: Beacon[];
}

export interface Scene extends Base {
  type: "2d" | "3d";
  file: ItemId;
  props?: Record<string, string>;
}
