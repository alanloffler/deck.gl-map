import type { Position } from "deck.gl";
import { EType } from "@/enums/type.enum";

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
  type?: EType;
}
