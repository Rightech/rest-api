import type { Base } from "./base";
import type { Floor } from "./scenes";

export type Geography = [lat: number, lon: number];

export type GeographyType =
  | "polygon"
  | "polyline"
  | "marker"
  | "circle"
  | "rectangle"
  | "route";

export type Geopoint = {
  type: "marker" | "circle";
  center: Geography;
};

export type Geoline = {
  type: "polygon" | "polyline" | "rectangle";
  points: Geography[];
};

export type Georoute = {
  type: "route";
  path: { name: string; geoline: string }[];
};

export type Geoshape = Geopoint | Geoline;

export interface Geofence extends Base {
  color?: string;
  shape?: Geoshape;
  floors?: Floor[];
}
