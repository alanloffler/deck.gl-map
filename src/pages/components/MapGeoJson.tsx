import DeckGL from "@deck.gl/react";
import { GeoJsonLayer } from "@deck.gl/layers";
import type { Feature, Geometry } from "geojson";
import type { PickingInfo } from "@deck.gl/core";

type PropertiesType = {
  name: string;
  color: string;
};

export function MapGeoJson() {
  const layer = new GeoJsonLayer<PropertiesType>({
    id: "GeoJsonLayer",
    data: "https://raw.githubusercontent.com/visgl/deck.gl-data/master/website/bart.geo.json",
    stroked: false,
    filled: true,
    pointType: "circle+text",
    pickable: true,
    getFillColor: [160, 160, 180, 200],
    getLineColor: (f: Feature<Geometry, PropertiesType>) => {
      const defaultColor: [number, number, number, number] = [0, 0, 0, 255];

      const hex: string = f.properties.color;
      if (!hex) return defaultColor;

      const rgbMatch = hex.match(/[0-9a-f]{2}/g);
      if (!rgbMatch) return defaultColor;

      const rgb: number[] = rgbMatch.map((x) => parseInt(x, 16));

      if (rgb.length === 3) {
        return [rgb[0], rgb[1], rgb[2], 255];
      } else if (rgb.length === 4) {
        return [rgb[0], rgb[1], rgb[2], rgb[3]];
      }

      return defaultColor;
    },
    getText: (f: Feature<Geometry, PropertiesType>) => f.properties.name,
    getLineWidth: 20,
    getPointRadius: 4,
    getTextSize: 12,
  });

  return (
    <DeckGL
      initialViewState={{
        longitude: -122.4,
        latitude: 37.74,
        zoom: 11,
      }}
      controller
      getTooltip={({
        object,
      }: PickingInfo<Feature<Geometry, PropertiesType>>) =>
        object ? object.properties.name : null
      }
      layers={[layer]}
    />
  );
}
