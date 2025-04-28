import type { Position } from "geojson";
import type { Units } from "@turf/helpers";
import { distance } from "@turf/distance";
import { useCallback } from "react";

export const useDistance = () => {
  const getDistance = useCallback(
    (multiLineArray: GeoJSON.Position[][] | undefined, units: Units): number | undefined => {
      if (!multiLineArray) return undefined;

      const distancesByLineString: number[] = [];

      for (const lineArray of multiLineArray) {
        if (lineArray.length < 2) {
          distancesByLineString.push(0);
          continue;
        }

        const firstPoint: Position = lineArray[0];
        const lastPoint: Position = lineArray[lineArray.length - 1];

        const directDistance: number = distance(firstPoint, lastPoint, {
          units: units,
        });

        distancesByLineString.push(directDistance);
      }

      const totalDistance: number = distancesByLineString.reduce((sum, distance) => sum + distance, 0);
      return totalDistance;
    },
    [],
  );

  return { getDistance };
};
