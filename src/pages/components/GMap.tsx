import type { Feature, GeoJSON } from "geojson";
import { APIProvider, Map } from "@vis.gl/react-google-maps";
import { GeoJsonLayer } from "deck.gl";
import { useEffect, useState } from "react";
import { DeckGlOverlay } from "./DeckGlOverlay";

// const DATA_URL =
// ("https://raw.githubusercontent.com/visgl/deck.gl-data/master/website/bart.geo.json");

import watter from "../../data/watter.json";

export function GMap() {
  const [data, setData] = useState<GeoJSON | null>(null);

  useEffect(() => {
    setData(watter as GeoJSON);
    // fetch(DATA_URL)
    //   .then((res) => res.json())
    //   .then((data) => setData(data as GeoJSON));
  }, []);

  return (
    <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
      <Map
        mapId={import.meta.env.VITE_GOOGLE_MAPS_ID}
        // defaultCenter={{ lat: 37.74, lng: -122.4 }}
        defaultCenter={{ lng: -54.566963, lat: -25.973053 }}
        defaultZoom={16}
        gestureHandling={"greedy"}
        disableDefaultUI={false}
        colorScheme="LIGHT"
        fullscreenControl
        mapTypeControl
      >
        <DeckGlOverlay layers={getDeckGlLayers(data)} />
      </Map>
    </APIProvider>
  );
}

function getDeckGlLayers(data: GeoJSON | null) {
  if (!data) return [];

  return [
    new GeoJsonLayer({
      id: "geojson-layer",
      data,
      stroked: false,
      filled: true,
      extruded: true,
      pointType: "circle",
      lineWidthScale: 5,
      lineWidthMinPixels: 4,
      getFillColor: [160, 160, 180, 200],
      getLineColor: (f: Feature) => {
        const hex = f?.properties?.color;
        if (!hex) return [0, 0, 0];

        return hex.match(/[0-9a-f]{2}/g)!.map((x: string) => parseInt(x, 16));
      },
      getPointRadius: 20,
      getLineWidth: 1,
      getElevation: 30,
    }),
  ];
}
