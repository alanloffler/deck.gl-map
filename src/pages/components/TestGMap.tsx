// Packages imports
import {
  type Feature,
  type GeoJSON,
  type Geometry,
  type MultiLineString,
  type Position,
} from "geojson";
import {
  APIProvider,
  Map,
  type ColorScheme,
  type MapCameraChangedEvent,
} from "@vis.gl/react-google-maps";
import { GeoJsonLayer, type PickingInfo } from "deck.gl";
import { DataFilterExtension } from "@deck.gl/extensions";
import { distance } from "@turf/distance";
import {
  type Dispatch,
  type SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";
// App immports
import type { ICameraOptions } from "@/interfaces/camera-options.interface";
import type { IDetails } from "@/interfaces/details.interface";
import type { IGeoJsonData } from "@/interfaces/geojson-data.interface";
import type { IMarker } from "@/interfaces/marker.interface";
import type { IVisualization } from "@/interfaces/visualization.interface";
import { DeckGLOverlay } from "./DeckGLOverlay";
import { hexToRgb } from "@/lib/helpers";
// Interface
interface IProps {
  cameraOptions: ICameraOptions;
  colorScheme: string;
  mapTypeId: string;
  selectedIndex: number | null;
  setCameraOptions: Dispatch<SetStateAction<ICameraOptions>>;
  setDetails: Dispatch<SetStateAction<IDetails | null>>;
  setSelectedIndex: Dispatch<SetStateAction<number | null>>;
  visualizations: IVisualization;
  dataVisualization: string[];
}

import testData from "../../data/test-data.json";

export function TestGMap({
  cameraOptions,
  colorScheme,
  mapTypeId,
  selectedIndex,
  setCameraOptions,
  setDetails,
  setSelectedIndex,
  visualizations,
  dataVisualization,
}: IProps) {
  const [data, setData] = useState<GeoJSON | null>(null);

  useEffect(() => {
    setData(testData as GeoJSON);
  }, []);

  const handleCameraChange = useCallback(
    (ev: MapCameraChangedEvent) => {
      setCameraOptions({
        center: ev.detail.center,
        zoom: ev.detail.zoom,
      });
    },
    [setCameraOptions],
  );

  function getDeckGlLayers() {
    if (!data) return [];

    return [
      new GeoJsonLayer({
        id: "main-network",
        data,
        visible: visualizations.showMainNetworks === "on",
        stroked: false,
        filled: true,
        extruded: true,
        getElevation: 300,
        lineWidthScale: 2,
        lineWidthMinPixels: 1,
        getLineWidth: 2,
        lineCapRounded: true,
        getLineColor: (f: Feature<Geometry, IGeoJsonData>) =>
          hexToRgb(f.properties?.color),
        autoHighlight: true,
        highlightColor: [251, 191, 36],
        highlightedObjectIndex: selectedIndex,
        pickable: true,
        onClick: (
          item: PickingInfo<Feature<MultiLineString, IGeoJsonData>>,
        ) => {
          const dist: number | undefined = getDistance(
            item.object?.geometry.coordinates,
          );
          setDetails({
            color: item.object?.properties.color,
            details: item.object?.properties.details,
            distance: dist && dist * 1000,
            name: item.object?.properties.name,
            type: item.object?.properties.type,
          });
          setSelectedIndex(item.index);
        },
        getFilterCategory: (f: Feature<MultiLineString, IGeoJsonData>) =>
          f.properties.type,
        filterCategories: dataVisualization,
        extensions: [new DataFilterExtension({ categorySize: 1 })],
      }),
    ];
  }

  function getDistance(
    multiLineArray: GeoJSON.Position[][] | undefined,
  ): number | undefined {
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
        units: "kilometers",
      });

      distancesByLineString.push(directDistance);
    }

    const totalDistance: number = distancesByLineString.reduce(
      (sum, distance) => sum + distance,
      0,
    );

    return totalDistance;
  }

  const getTooltip = useCallback(
    ({ object }: PickingInfo<IMarker | Feature<Geometry, IGeoJsonData>>) => {
      if (!object) return null;

      if ("name" in object && "icon" in object.details) {
        const item = object as IMarker;

        return {
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
          html: `<div class="flex flex-col space-y-1">
              <div class="flex flex-row space-x-2 items-center">
                <div class="${item.properties.type === "connection" ? "h-3 w-3 rounded-full" : "h-1 w-5"}" style="background:${item.properties.color}"></div>
                <span class="font-medium">${item.properties.name}</span>
              </div>
              <span class="font-normal">${item.properties.details.street}</span>
            </div>`,
          style: {
            backgroundColor: "#ffffff",
            border: "1px solid #e2e8f0",
            borderRadius: "8px",
            boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
            color: "#000000",
            fontSize: "13px",
          },
        };
      }
    },
    [],
  );

  return (
    <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
      <Map
        className="relative h-[450px] w-full"
        clickableIcons={visualizations.showGmMarkers === "on" ? true : false}
        colorScheme={colorScheme as ColorScheme}
        disableDefaultUI={true}
        fullscreenControl
        gestureHandling={"greedy"}
        mapId={import.meta.env.VITE_GOOGLE_MAPS_ID}
        mapTypeId={mapTypeId}
        onCameraChanged={handleCameraChange}
        streetViewControl
        tilt={0}
        {...cameraOptions}
      >
        <DeckGLOverlay layers={getDeckGlLayers()} getTooltip={getTooltip} />
      </Map>
    </APIProvider>
  );
}
