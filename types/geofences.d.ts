import type { Base } from "./base";
import type { Floor } from "./scenes";

export type Geography = [lat: number, lon: number];

export type GeographyType =
  | "polygon"
  | "polyline"
  | "marker"
  | "circle"
  | "rectangle"
  | "route"
  | string;

export type Geopoint = {
  type: "marker" | "circle";
  center: Geography;
};

export type Geoline = {
  type: "polygon" | "polyline" | "rectangle";
  points: Geography[];
};

export type Waypoint = {
  center: Geography;
  name: string;
  check?: boolean;
};

export type GeorouteTrip = {
  type: "direct" | "return";
  points: Geography[];
  waypoints: Waypoint[];
};

export type Georoute = {
  type: "route";
  trips: GeorouteTrip[];
};

export type Geoshape = Geopoint | Geoline | Georoute;

export interface Geofence extends Base {
  color?: string;
  shape?: Geoshape;
  floors?: Floor[];
}
