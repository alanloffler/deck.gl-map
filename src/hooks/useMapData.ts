// Packages imports
import type { Feature, FeatureCollection, Geometry, Point } from "geojson";
import { useEffect, useState } from "react";
// App imports
import type { IGeoJsonData } from "@/interfaces/geojson-data.interface";
import { EType } from "@/enums/type.enum";
// GeoJSON data
import networksData from "@/data/networks.json";

export function useMapData() {
  const [geoJsonData, setGeoJsonData] = useState<FeatureCollection<Geometry, IGeoJsonData> | null>(null);
  const [textData, setTextData] = useState<{ id: string; name: string; coordinates: number[] }[] | undefined>(
    undefined,
  );

  useEffect(() => {
    setGeoJsonData(networksData as FeatureCollection<Geometry, IGeoJsonData>);
  }, []);

  useEffect(() => {
    geoJsonData?.features.forEach((feature, index) => {
      feature.properties.id = index;
    });

    const filterFeatures = geoJsonData?.features.filter(
      (feature) => feature.properties.type === EType.Connection,
    ) as Feature<Point, IGeoJsonData>[];

    const textFeatures = filterFeatures?.map((feat) => ({
      coordinates: feat.geometry.coordinates,
      id: feat.properties.details.id,
      name: feat.properties.details.id,
    }));

    setTextData(textFeatures);
  }, [geoJsonData?.features]);

  return { geoJsonData, textData };
}
