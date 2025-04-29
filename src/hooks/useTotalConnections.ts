// Packages imports
import type { Feature, FeatureCollection, Geometry, Point } from "geojson";
import { useMemo } from "react";
// App imports
import type { IGeoJsonData } from "@/interfaces/geojson-data.interface";
import { EType } from "@/enums/type.enum";

export function useTotalConnections(geoJsonData: FeatureCollection<Geometry, IGeoJsonData> | null) {
  return useMemo(() => {
    if (!geoJsonData?.features?.length) return undefined;

    const connections = geoJsonData?.features.filter(
      (f) => f.geometry.type === "Point" && f.properties.type === EType.Connection,
    ) as Feature<Point, IGeoJsonData>[];

    return connections.length;
  }, [geoJsonData]);
}
