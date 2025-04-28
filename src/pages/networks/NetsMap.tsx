// Packages imports
import { type Feature, type FeatureCollection, type Geometry, type MultiLineString, type Point } from "geojson";
import { APIProvider, Map, type ColorScheme, type MapCameraChangedEvent } from "@vis.gl/react-google-maps";
import { DataFilterExtension } from "@deck.gl/extensions";
import { GeoJsonLayer, TextLayer, Viewport, type PickingInfo } from "deck.gl";
import { type Dispatch, type SetStateAction, useCallback, useEffect, useState } from "react";
// App immports
import type { ICameraOptions } from "@/interfaces/camera-options.interface";
import type { IDetails } from "@/interfaces/details.interface";
import type { IGeoJsonData } from "@/interfaces/geojson-data.interface";
import { DeckGLOverlay } from "../components/DeckGLOverlay";
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
import { useDistance } from "@/hooks/useDistance";

export function NetsMap({
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
  const [connText, setConnText] = useState<{ id: string; name: string; coordinates: number[] }[] | undefined>(
    undefined,
  );
  const getDistance = useDistance();

  useEffect(() => {
    setData(testData as FeatureCollection<Geometry, IGeoJsonData>);
  }, []);

  useEffect(() => {
    data?.features.forEach((feature, index) => {
      feature.properties.id = index;
    });

    const filterFeatures = data?.features.filter((feature) => feature.properties.type === "connection") as Feature<
      Point,
      IGeoJsonData
    >[];
    const textFeatures = filterFeatures?.map((feat) => ({
      id: feat.properties.details.id,
      name: feat.properties.details.id,
      coordinates: feat.geometry.coordinates,
    }));
    setConnText(textFeatures);
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

    const isConnectionZoomVisible: boolean = cameraOptions.zoom >= 17;
    const effectiveDataVisualization: string[] = [...dataVisualization];
    const renderDataVisualization: string[] = effectiveDataVisualization.filter(
      (type) => type !== "connection" || isConnectionZoomVisible,
    );

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
        getIcon: (marker: Feature<Geometry, IGeoJsonData>) => {
          const iconPath: string = marker.properties.type === "marker" ? "map-pin.png" : "connection.svg";
          return {
            url: new URL(`../../assets/icons/1x/${iconPath}`, import.meta.url).href,
            width: 120,
            height: 120,
            anchorX: 60,
            anchorY: 60,
            mask: true,
          };
        },
        getIconSize: (item: Feature<Geometry, IGeoJsonData>) => {
          const size: number = 1.73 * Math.pow(1.18, cameraOptions.zoom);
          if (item.properties.type === "connection") return size / 2.5;
          return size;
        },
        iconSizeUnits: "pixels",
        iconSizeScale: 1,
        iconSizeMinPixels: 1,
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
        highlightColor: (item: PickingInfo<Feature<Geometry, IGeoJsonData>>) => {
          const type = item.object?.properties.type;
          const color = selectedColors.find((color) => color.type === type);

          return hexToRgb(color?.selected) as number[];
        },
        updateTriggers: {
          getLineColor: [selectedIndex],
          getIconColor: [selectedIndex],
          getIconSize: [cameraOptions.zoom],
          getFilterCategory: [renderDataVisualization, cameraOptions.zoom],
        },
        onClick: (item: PickingInfo<Feature<MultiLineString | Point, IGeoJsonData>>) => {
          console.log(item);
          let dist: number | undefined;
          if (item.object?.geometry.type === "MultiLineString") {
            dist = getDistance(item.object?.geometry.coordinates, "meters");
          }
          setDetails({
            color: selectedColors.find((c) => c.type === item.object?.properties.type)?.normal,
            details: item.object?.properties.details,
            distance: dist,
            name: item.object?.properties.name,
            type: item.object?.properties.type,
          });
          setSelectedIndex(item.index);
        },
        // Filters
        extensions: [new DataFilterExtension({ categorySize: 1 })],
        getFilterCategory: (f: Feature<Geometry, IGeoJsonData>) => f.properties.type,
        filterCategories: renderDataVisualization,
      }),
      new TextLayer<{ id: string; name: string; coordinates: [number, number] }>({
        id: "connections-id-layer",
        data: connText,
        visible: cameraOptions.zoom >= 18 && renderDataVisualization.includes("connection"),
        getText: (f) => f.id,
        getPosition: (f) => f.coordinates,
        getSize: 11,
        fontFamily: "InterVariable",
        fontWeight: 500,
        getPixelOffset: [0, cameraOptions.zoom - 2],
        pickable: false,
      }),
    ];
  }

  function flipTooltip(x: number, y: number, viewport: Viewport, content: string, objType: string): string {
    const tempEl = document.createElement("div");
    tempEl.innerHTML = content;
    tempEl.style.position = "absolute";
    tempEl.style.visibility = "hidden";
    tempEl.style.display = "block";
    document.body.appendChild(tempEl);

    const tooltipWidth = tempEl.offsetWidth;
    const tooltipHeight = tempEl.offsetHeight;

    document.body.removeChild(tempEl);

    const { width, height } = viewport;
    let newX = x;
    let newY = y;
    let extraPixels = 0;
    if (objType === "marker") extraPixels = 12;
    if (objType === "connection") extraPixels = 0;
    if (x + tooltipWidth > width) newX = x - tooltipWidth - extraPixels;
    else newX = x;
    if (y + tooltipHeight > height) newY = y - tooltipHeight - extraPixels;
    else newY = y;

    return `translate(${newX}px, ${newY}px)`;
  }

  const getTooltip = useCallback(({ object, x, y, viewport }: PickingInfo<Feature<Geometry, IGeoJsonData>>) => {
    if (!object) return null;

    const objColor = selectedColors.find((c) => c.type === object.properties.type);
    const htmlTooltip = `<div class="flex flex-col space-y-1">
              <div class="flex flex-row space-x-2 items-center">
                <div
                  class="${object.geometry.type === "Point" ? "h-3 w-3 rounded-full" : "h-1 w-4"}"
                  style="background:${objColor?.normal}"></div>
                <span class="font-medium">${object.properties.name}</span>
              </div>
              <span class="font-medium text-xs"># ${object.properties.details.id}</span>
              <span class="font-normal text-xs">${object.properties.details.street}</span>
            </div>`;

    return {
      html: htmlTooltip,
      style: {
        transform: flipTooltip(x, y, viewport!, htmlTooltip, object.properties.type),
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
