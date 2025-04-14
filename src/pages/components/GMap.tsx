import type { Feature, GeoJSON } from "geojson";
import { APIProvider, Map, type ColorScheme } from "@vis.gl/react-google-maps";
import { type PickingInfo, GeoJsonLayer } from "deck.gl";
import { type Dispatch, type SetStateAction, useEffect, useState } from "react";
import { DeckGlOverlay } from "./DeckGlOverlay";
import type { IDetails } from "@/interfaces/details.interface";
import type { IGeoJsonData } from "@/interfaces/geojson-data.interface";

// const DATA_URL =
// ("https://raw.githubusercontent.com/visgl/deck.gl-data/master/website/bart.geo.json");

interface IProps {
  clickableIcons: boolean;
  colorScheme: string;
  mapTypeId: string;
  poiVisibility: string;
  setDetails: Dispatch<SetStateAction<IDetails | null>>;
}

import watter from "../../data/watter.json";

export function GMap({
  clickableIcons,
  colorScheme,
  mapTypeId,
  poiVisibility,
  setDetails,
}: IProps) {
  const [data, setData] = useState<GeoJSON | null>(null);

  useEffect(() => {
    setData(watter as GeoJSON);
  }, []);

  function getDeckGlLayers(data: GeoJSON | null) {
    if (!data) return [];

    return [
      new GeoJsonLayer<IGeoJsonData>({
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
        pickable: true,
        onClick: (item: PickingInfo<IGeoJsonData>) => {
          setDetails({
            name: item.object?.properties.name,
            color: item.object?.properties.color,
          });
          console.log(item);
        },
      }),
    ];
  }

  return (
    <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
      <Map
        clickableIcons={clickableIcons}
        colorScheme={colorScheme as ColorScheme}
        defaultCenter={{ lng: -54.566963, lat: -25.973053 }}
        defaultZoom={16}
        disableDefaultUI={true}
        fullscreenControl
        gestureHandling={"greedy"}
        mapTypeId={mapTypeId}
        streetViewControl
        styles={[
          {
            featureType: "poi",
            elementType: "labels",
            stylers: [{ visibility: poiVisibility }],
          },
        ]}
      >
        <DeckGlOverlay layers={getDeckGlLayers(data)} />
      </Map>
    </APIProvider>
  );
}
