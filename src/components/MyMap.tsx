import "maplibre-gl/dist/maplibre-gl.css";
import type { Dispatch, SetStateAction } from "react";
import { Color, DeckProps } from "@deck.gl/core";
import { Map, useControl } from "react-map-gl/maplibre";
import { MapboxOverlay } from "@deck.gl/mapbox";
import { PathLayer, ScatterplotLayer } from "@deck.gl/layers";
import { PickingInfo } from "deck.gl";

import type { IPathData } from "@/interfaces/path-data.interface";
import { cn } from "@/lib/utils";
import { IScatterplotData } from "@/interfaces/scatterplot-data.interface";
import { IInfo } from "@/interfaces/info.interface";

function DeckGLOverlay(props: DeckProps) {
  const overlay = useControl<MapboxOverlay>(() => new MapboxOverlay(props));
  overlay.setProps(props);
  return null;
}

interface IProps {
  className?: string;
  setInfo: Dispatch<SetStateAction<IInfo | undefined>>;
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
      onClick: (item) =>
        setInfo({
          name: item.object.name,
        }),
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
    <main className={cn("w-full h-[500px]", className)}>
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
