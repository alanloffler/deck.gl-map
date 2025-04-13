import "maplibre-gl/dist/maplibre-gl.css";
import type { Dispatch, SetStateAction } from "react";
import {
  type Color,
  type DeckProps,
  type PickingInfo,
  PathLayer,
  ScatterplotLayer,
} from "deck.gl";
import { Map, useControl } from "react-map-gl/maplibre";
import { MapboxOverlay } from "@deck.gl/mapbox";

import type { IInfo } from "@/interfaces/info.interface";
import type { IPathData } from "@/interfaces/path-data.interface";
import type { IScatterplotData } from "@/interfaces/scatterplot-data.interface";
import { cn } from "@/lib/utils";

function DeckGLOverlay(props: DeckProps) {
  const overlay = useControl<MapboxOverlay>(() => new MapboxOverlay(props));
  overlay.setProps(props);
  return null;
}

interface IProps {
  className?: string;
  setInfo: Dispatch<SetStateAction<IInfo | undefined>>;
}

function arrayToRGBA(arr: number[]): string {
  return `rgba(${arr[0]}, ${arr[1]}, ${arr[2]}, ${arr[3] / 255})`;
}

function calculateHaversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
  const earthRadius = 6371e3;

  const startLatRad = (lat1 * Math.PI) / 180;
  const endLatRad = (lat2 * Math.PI) / 180;

  const deltaLatRad = ((lat2 - lat1) * Math.PI) / 180;
  const deltaLonRad = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(deltaLatRad / 2) * Math.sin(deltaLatRad / 2) +
    Math.cos(startLatRad) *
      Math.cos(endLatRad) *
      Math.sin(deltaLonRad / 2) *
      Math.sin(deltaLonRad / 2);

  const angularDistance = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const meters = earthRadius * angularDistance;

  return Math.round((meters + Number.EPSILON) * 100) / 100;
}

export function MyMap({ className, setInfo }: IProps) {
  const layers = [
    new ScatterplotLayer<IScatterplotData>({
      id: "scatterplot-layer",
      data: [{ name: "Coop. Wanda", position: [-54.565368, -25.972807] }],
      getFillColor: [255, 0, 0, 100],
      getPosition: (d) => d.position,
      getRadius: 10,
      pickable: true,
      onClick: (item: PickingInfo<IScatterplotData>) => {
        setInfo({
          color: arrayToRGBA([255, 0, 0, 100]),
          name: item.object?.name,
          position: item.object?.position,
        });
      },
    }),
    new PathLayer<IPathData>({
      id: "path-layer-primary",
      data: [
        {
          name: "Red principal",
          position: [
            [-54.566963, -25.973053],
            [-54.565003, -25.97264],
          ],
          color: "#ed1c24",
        },
      ],
      getColor: (d: IPathData) => {
        const hex = d.color;
        const transformed = hex
          .match(/[0-9a-f]{2}/g)
          ?.map((x: string) => parseInt(x, 16));
        return transformed as unknown as Color[];
      },
      getPath: (d: IPathData) => d.position,
      getWidth: 2,
      pickable: true,
      onClick: (item) => {
        console.log(item);
        setInfo({
          mts: calculateHaversineDistance(
            item.object.position[0][0],
            item.object.position[0][1],
            item.object.position[1][0],
            item.object.position[1][1],
          ),
          name: item.object.name,
          color: "#ed1c24",
        });
      },
    }),
    new PathLayer({
      id: "path-layer-secondary",
      data: [
        {
          name: "Red secundaria",
          path: [
            [-54.565458, -25.972745],
            [-54.565458, -25.972906],
          ],
          color: "#0099ff",
        },
      ],
      getColor: (d: IPathData) => {
        const hex = d.color;
        const transformed = hex
          .match(/[0-9a-f]{2}/g)
          ?.map((x: string) => parseInt(x, 16));
        return transformed as unknown as Color[];
      },
      getPath: (d) => d.path,
      getWidth: 1,
      pickable: true,
      onClick: (item) =>
        setInfo({
          name: item.object.name,
        }),
    }),
  ];

  return (
    <main className={cn("h-[500px] w-full", className)}>
      <Map
        initialViewState={{
          longitude: -54.565368,
          latitude: -25.972807,
          zoom: 16,
        }}
        mapStyle="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
      >
        <DeckGLOverlay
          getTooltip={({ object }: PickingInfo<IPathData>) =>
            object ? object.name : null
          }
          layers={layers}
        />
      </Map>
    </main>
  );
}
