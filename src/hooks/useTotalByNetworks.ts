// Packages imports
import type { Feature, FeatureCollection, Geometry, MultiLineString } from "geojson";
import { useMemo } from "react";
// App imports
import type { IGeoJsonData } from "@/interfaces/geojson-data.interface";
import { useDistance } from "@/hooks/useDistance";

export function useTotalByNetworks(geoJsonData: FeatureCollection<Geometry, IGeoJsonData> | null) {
  const { getDistance } = useDistance();

  return useMemo(() => {
    if (!geoJsonData?.features?.length) return undefined;

    const networks = geoJsonData?.features.filter((f) => f.geometry.type === "MultiLineString") as Feature<
      MultiLineString,
      IGeoJsonData
    >[];

    if (!networks.length) return { total: {} };

    const total = networks.reduce<Record<string, number>>((acc, network) => {
      const type = network.properties?.type;
      if (!type) return acc;

      const distance = getDistance(network.geometry.coordinates, "meters") ?? 0;
      acc[type] = (acc[type] || 0) + distance;

      return acc;
    }, {});

    return { total };
  }, [geoJsonData, getDistance]);
}
