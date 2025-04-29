// Packages imports
import { APIProvider, Map, type ColorScheme, type MapCameraChangedEvent } from "@vis.gl/react-google-maps";
import { DataFilterExtension } from "@deck.gl/extensions";
import { GeoJsonLayer, TextLayer, type PickingInfo, type Position } from "deck.gl";
import { type Dispatch, type SetStateAction, useCallback } from "react";
import { type Feature, type Geometry, type MultiLineString, type Point } from "geojson";
// App immports
import selectedColors from "@/config/geojson-colors.config.json";
import type { ICameraOptions } from "@/interfaces/camera-options.interface";
import type { IDetails } from "@/interfaces/details.interface";
import type { IGeoJsonData } from "@/interfaces/geojson-data.interface";
import { DeckGLOverlay } from "@/pages/components/DeckGLOverlay";
import { hexToRgb } from "@/lib/helpers";
import { useDistance } from "@/hooks/useDistance";
import { useMapData } from "@/hooks/useMapData";
import { useTooltip } from "@/hooks/useTooltip";
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
  const { geoJsonData, textData } = useMapData();
  const { getDistance } = useDistance();
  const { getTooltip } = useTooltip();

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
    if (!geoJsonData) return [];

    const isConnectionZoomVisible: boolean = cameraOptions.zoom >= 17;
    const effectiveDataVisualization: string[] = [...dataVisualization];
    const renderDataVisualization: string[] = effectiveDataVisualization.filter(
      (type) => type !== "connection" || isConnectionZoomVisible,
    );

    return [
      new GeoJsonLayer({
        id: "networks",
        data: geoJsonData,
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
          let dist: number | undefined;

          if (item.object?.geometry.type === "MultiLineString") {
            dist = getDistance(item.object?.geometry.coordinates, "meters");
          }

          setDetails({
            color: selectedColors.find((c) => c.type === item.object?.properties.type)?.normal,
            coordinates:
              item.object?.geometry.type !== "MultiLineString"
                ? (item.object?.geometry.coordinates as Position)
                : undefined,
            details: item.object?.properties.details,
            distance: dist,
            name: item.object?.properties.name,
            type: item.object?.properties.type,
          });

          setSelectedIndex(item.index);

          setCameraOptions((prev) => ({
            ...prev,
            center: {
              lng: item.coordinate && item.coordinate[0],
              lat: item.coordinate && item.coordinate[1],
            } as unknown as { lng: number; lat: number },
          }));
        },
        // Filters
        extensions: [new DataFilterExtension({ categorySize: 1 })],
        getFilterCategory: (f: Feature<Geometry, IGeoJsonData>) => f.properties.type,
        filterCategories: renderDataVisualization,
      }),
      new TextLayer<{ id: string; name: string; coordinates: [number, number] }>({
        id: "connections-id-layer",
        data: textData,
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
