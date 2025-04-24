// Packages imports
import {
  type Feature,
  type FeatureCollection,
  type Geometry,
  type MultiLineString,
  type Point,
  type Position,
} from "geojson";
import { APIProvider, Map, type ColorScheme, type MapCameraChangedEvent } from "@vis.gl/react-google-maps";
import { DataFilterExtension } from "@deck.gl/extensions";
import { GeoJsonLayer, type PickingInfo } from "deck.gl";
import { distance } from "@turf/distance";
import { type Dispatch, type SetStateAction, useCallback, useEffect, useState } from "react";
// App immports
import type { ICameraOptions } from "@/interfaces/camera-options.interface";
import type { IDetails } from "@/interfaces/details.interface";
import type { IGeoJsonData } from "@/interfaces/geojson-data.interface";
import { DeckGLOverlay } from "./DeckGLOverlay";
import { hexToRgb } from "@/lib/helpers";
// Interface
interface IProps {
  cameraOptions: ICameraOptions;
  colorScheme: string;
  dataVisualization: string[];
  mapTypeId: string;
  selectedIndex: number | null;
  setCameraOptions: Dispatch<SetStateAction<ICameraOptions>>;
  setDetails: Dispatch<SetStateAction<IDetails | null>>;
  setSelectedIndex: Dispatch<SetStateAction<number | null>>;
}
// GeoJSON data
import testData from "../../data/test-data.json";
// Config
import selectedColors from "../../config/geojson-colors.config.json";

export function TestGMap({
  cameraOptions,
  colorScheme,
  dataVisualization,
  mapTypeId,
  selectedIndex,
  setCameraOptions,
  setDetails,
  setSelectedIndex,
}: IProps) {
  const [data, setData] = useState<FeatureCollection<Geometry, IGeoJsonData> | null>(null);

  useEffect(() => {
    setData(testData as FeatureCollection<Geometry, IGeoJsonData>);
  }, []);

  useEffect(() => {
    data?.features.forEach((feature, index) => {
      feature.properties.id = index;
    });
  }, [data?.features]);

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
        id: "networks",
        data,
        visible: true,
        filled: true,
        // Lines
        lineWidthScale: 2,
        lineWidthMinPixels: 1,
        getLineWidth: 2,
        lineCapRounded: true,
        getLineColor: (f: Feature<Geometry, IGeoJsonData>) => {
          const type = f.properties.type;
          const colorObj = selectedColors.find((c) => c.type === type);
          const colorType = selectedIndex === f.properties.id ? colorObj?.selected : colorObj?.normal;
          return hexToRgb(colorType);
        },
        // Icon
        pointType: "icon",
        getIcon: (marker: Feature<Geometry, IGeoJsonData>) => ({
          url: new URL(`../../assets/icons/${marker.properties.details.icon}`, import.meta.url).href,
          width: 24,
          height: 24,
          anchorX: 12,
          anchorY: 12,
          mask: true,
        }),
        getIconSize: 24,
        iconSizeUnits: "pixels",
        iconSizeScale: 1,
        getIconColor: ((f: Feature<Point, IGeoJsonData>) => {
          const type = f.properties.type;
          const colorObj = selectedColors.find((c) => c.type === type);
          const colorType = selectedIndex === f.properties.id ? colorObj?.selected : colorObj?.normal;
          return hexToRgb(colorType);
        }) as unknown as [number, number, number],
        getPosition: (marker: Feature<Point, IGeoJsonData>) => marker.geometry.coordinates,
        // Selection
        pickable: true,
        autoHighlight: true,
        // highlightColor: [251, 191, 36],
        highlightColor: (item: PickingInfo<Feature<Geometry, IGeoJsonData>>) => {
          const type = item.object?.properties.type;
          const color = selectedColors.find((color) => color.type === type);

          return hexToRgb(color?.selected) as number[];
        },
        updateTriggers: {
          getLineColor: [selectedIndex],
          getIconColor: [selectedIndex],
        },
        onClick: (item: PickingInfo<Feature<MultiLineString | Point, IGeoJsonData>>) => {
          let dist: number | undefined;
          if (item.object?.geometry.type === "MultiLineString") {
            dist = getDistance(item.object?.geometry.coordinates);
          }
          setDetails({
            color: item.object?.properties.color,
            details: item.object?.properties.details,
            distance: dist && dist * 1000,
            name: item.object?.properties.name,
            type: item.object?.properties.type,
          });
          // item.layer?.setState({ color: "#000099" });
          setSelectedIndex(item.index);
        },
        // Filters
        getFilterCategory: (f: Feature<Geometry, IGeoJsonData>) => f.properties.type,
        filterCategories: dataVisualization,
        extensions: [new DataFilterExtension({ categorySize: 1 })],
      }),
    ];
  }

  function getDistance(multiLineArray: GeoJSON.Position[][] | undefined): number | undefined {
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

    const totalDistance: number = distancesByLineString.reduce((sum, distance) => sum + distance, 0);

    return totalDistance;
  }

  const getTooltip = useCallback(({ object }: PickingInfo<Feature<Geometry, IGeoJsonData>>) => {
    if (!object) return null;

    return {
      html: `<div class="flex flex-col space-y-1">
                <div class="flex flex-row space-x-2 items-center">
                  <div
                    class="${object.geometry.type === "Point" ? "h-3 w-3 rounded-full" : "h-1 w-4"}"
                    style="background:${object.properties.color}"></div>
                  <span class="font-medium">${object.properties.name}</span>
                </div>
                <span class="font-normal">${object.properties.details.street}</span>
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
  }, []);

  return (
    <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
      <Map
        className="relative h-[450px] w-full"
        clickableIcons={true}
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
