import { type Feature, type Geometry, type GeoJSON } from "geojson";
import { APIProvider, Map, type ColorScheme } from "@vis.gl/react-google-maps";
import { GeoJsonLayer, IconLayer, type PickingInfo } from "deck.gl";
import {
  type Dispatch,
  type SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";
import { distance } from "@turf/distance";
import { DeckGlOverlay } from "./DeckGlOverlay";
import type { IDetails } from "@/interfaces/details.interface";
import type { IGeoJsonData } from "@/interfaces/geojson-data.interface";
import type { IMarker } from "@/interfaces/marker.interface";

interface IProps {
  colorScheme: string;
  mapTypeId: string;
  setDetails: Dispatch<SetStateAction<IDetails | null>>;
  visualizations: {
    showGmMarkers: string;
    showMarkers: string;
    showStreetNames: string;
  };
}

import markersData from "../../data/markers.json";
import watter from "../../data/watter.json";
import { hexToRgb } from "@/lib/helpers";
// import iconAtlas from "../../assets/icon-atlas.png";
// import iconAtlasMap from "../../data/icon-atlas.json";

export function GMap({
  colorScheme,
  mapTypeId,
  setDetails,
  visualizations,
}: IProps) {
  const [data, setData] = useState<GeoJSON | null>(null);
  const [markers, setMarkers] = useState<IMarker[] | null>(null);

  useEffect(() => {
    setData(watter as GeoJSON);
    setMarkers(markersData as IMarker[]);
  }, []);

  function getDeckGlLayers() {
    if (!data) return [];

    return [
      new IconLayer<IMarker>({
        id: "markers-layer",
        data: markers,
        visible: visualizations.showMarkers === "on",
        getColor: (d: IMarker) => hexToRgb(d.color),
        getIcon: (d: IMarker) => ({
          url: new URL(`../../assets/icons/${d.details.icon}`, import.meta.url)
            .href,
          width: 320,
          height: 320,
        }),
        getPosition: (d: IMarker) => d.coordinates,
        getSize: 32,
        // iconAtlas: iconAtlas,
        // iconMapping: iconAtlasMap,
        onClick: (item: PickingInfo<IMarker>) => {
          setDetails({
            color: item.object?.color,
            name: item.object?.name,
            details: item.object?.details,
          });
        },
        pickable: true,
      }),
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
        getLineColor: (f: Feature<Geometry, IGeoJsonData>) =>
          hexToRgb(f.properties?.color),
        getPointRadius: 20,
        getLineWidth: 1,
        getElevation: 30,
        pickable: true,
        onClick: (item: PickingInfo<Feature<Geometry, IGeoJsonData>>) => {
          const dist = distance(
            [-54.57118702316389, -25.97701522743678],
            [-54.56932570611937, -25.975259925641254],
            { units: "kilometers" },
          );
          setDetails({
            color: item.object?.properties.color,
            distance: dist * 1000,
            name: item.object?.properties.name,
            details: item.object?.properties.details,
          });
        },
      }),
    ];
  }

  const getTooltip = useCallback(
    ({ object }: PickingInfo<IMarker | Feature<Geometry, IGeoJsonData>>) => {
      if (!object) return null;

      if ("name" in object && "icon" in object.details) {
        const item = object as IMarker;

        return {
          text: item.name,
          html: `<div>${item.name}</div>`,
          style: {
            backgroundColor: "#ffffff",
            border: "1px solid #e2e8f0",
            borderRadius: "8px",
            boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
            color: "#000000",
            fontSize: "13px",
            fontWeight: "500",
          },
        };
      } else {
        const item = object as Feature<Geometry, IGeoJsonData>;

        return {
          text: item.properties.name,
          html: `<div>${item.properties.name}</div>`,
          style: {
            backgroundColor: "#ffffff",
            border: "1px solid #e2e8f0",
            borderRadius: "8px",
            boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
            color: "#000000",
            fontSize: "13px",
            fontWeight: "500",
          },
        };
      }
    },
    [],
  );

  return (
    <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
      <Map
        clickableIcons={visualizations.showGmMarkers === "on" ? true : false}
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
            stylers: [{ visibility: visualizations.showGmMarkers }],
          },
          {
            featureType: "road",
            elementType: "labels",
            stylers: [{ visibility: visualizations.showStreetNames }],
          },
        ]}
      >
        <DeckGlOverlay layers={getDeckGlLayers()} getTooltip={getTooltip} />
      </Map>
    </APIProvider>
  );
}
