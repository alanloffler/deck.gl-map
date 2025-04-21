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
import { GeoJsonLayer, IconLayer, type PickingInfo } from "deck.gl";
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
  setCameraOptions: Dispatch<SetStateAction<ICameraOptions>>;
  setDetails: Dispatch<SetStateAction<IDetails | null>>;
  visualizations: IVisualization;
}

import markersData from "../../data/markers/markers.json";
import mainNetwork from "../../data/networks/main-network.json";
import secondaryNetwork from "../../data/networks/secondary-network.json";

export function GMap({
  cameraOptions,
  colorScheme,
  mapTypeId,
  setCameraOptions,
  setDetails,
  visualizations,
}: IProps) {
  const [data, setData] = useState<GeoJSON | null>(null);
  const [secondaryNetworkData, setSecondaryNetworkData] =
    useState<GeoJSON | null>(null);
  const [markers, setMarkers] = useState<IMarker[] | null>(null);

  useEffect(() => {
    setData(mainNetwork as GeoJSON);
    setSecondaryNetworkData(secondaryNetwork as GeoJSON);
    setMarkers(markersData as IMarker[]);
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
    if (!data || !secondaryNetworkData) return [];

    return [
      new GeoJsonLayer<IGeoJsonData>({
        id: "secondary-network",
        data: secondaryNetworkData,
        visible: visualizations.showSecondaryNetworks === "on",
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
        highlightColor: [168, 85, 247],
        pickable: true,
        onClick: (
          item: PickingInfo<Feature<MultiLineString, IGeoJsonData>>,
        ) => {
          const dist: number | undefined = getDistance(
            item.object?.geometry.coordinates,
          );

          setDetails({
            color: item.object?.properties.color,
            distance: dist && dist * 1000,
            name: item.object?.properties.name,
            details: item.object?.properties.details,
          });
        },
      }),
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
        highlightColor: [14, 165, 233],
        pickable: true,
        onClick: (
          item: PickingInfo<Feature<MultiLineString, IGeoJsonData>>,
        ) => {
          const dist: number | undefined = getDistance(
            item.object?.geometry.coordinates,
          );

          setDetails({
            color: item.object?.properties.color,
            distance: dist && dist * 1000,
            name: item.object?.properties.name,
            details: item.object?.properties.details,
          });
        },
      }),
      new IconLayer<IMarker>({
        id: "markers-layer",
        data: markers,
        visible: visualizations.showMarkers === "on",
        getIcon: (d: IMarker) => ({
          url: new URL(`../../assets/icons/${d.details.icon}`, import.meta.url)
            .href,
          width: 24,
          height: 24,
        }),
        getPosition: (d: IMarker) => d.coordinates,
        getSize: 24,
        pickable: true,
        onClick: (item: PickingInfo<IMarker>) => {
          setDetails({
            color: item.object?.color,
            name: item.object?.name,
            details: item.object?.details,
          });
        },
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
          html: `<div class="flex flex-col">
              <span class="font-medium">${item.properties.details.street}</span>
              <div class="flex flex-row space-x-2 items-center">
                <div class="h-1 w-5" style="background:${item.properties.color}"></div>
                <span>${item.properties.name}</span>
              </div>
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
