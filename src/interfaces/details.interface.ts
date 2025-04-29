import { Position } from "deck.gl";

export interface IDetails {
  color?: string;
  coordinates?: Position | Position[][];
  distance?: number;
  name?: string;
  details?: {
    district?: string;
    id?: string;
    street?: string;
    title?: string;
  };
  type?: "connection" | "marker" | "network" | "main-network" | "secondary-network";
}
