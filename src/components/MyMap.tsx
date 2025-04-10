import "maplibre-gl/dist/maplibre-gl.css";
import type { Dispatch, SetStateAction } from "react";
import { Color, DeckProps } from "@deck.gl/core";
import { Map, useControl } from "react-map-gl/maplibre";
import { MapboxOverlay } from "@deck.gl/mapbox";
import { PathLayer, ScatterplotLayer } from "@deck.gl/layers";
import { PickingInfo } from "deck.gl";

import type { IPathData } from "@/interfaces/path-data.interface";
import { cn } from "@/lib/utils";

function DeckGLOverlay(props: DeckProps) {
  const overlay = useControl<MapboxOverlay>(() => new MapboxOverlay(props));
  overlay.setProps(props);
  return null;
}

interface IProps {
  className?: string;
  setInfo: Dispatch<SetStateAction<any>>;
}

export function MyMap({ className, setInfo }: IProps) {
  const layers = [
    new ScatterplotLayer({
      id: "deckgl-circle",
      data: [{ name: "Coop. Wanda", position: [-54.565368, -25.972807] }],
      getPosition: (d) => d.position,
      getFillColor: [255, 0, 0, 100],
      getRadius: 10,
      beforeId: "watername_ocean",
      pickable: true,
      onClick: (item: PickingInfo<IPathData>) => {
        console.log(item.coordinate);
        setInfo({
          name: item.object?.name,
          coordinate: item.coordinate,
        });
      },
    }),
    new PathLayer<IPathData>({
      id: "deckgl-paths",
      data: [
        {
          name: "Red principal",
          path: [
            [-54.56696333042627, -25.97305329916473],
            [-54.56500377505447, -25.972640965079822],
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
      getPath: (d: IPathData) => d.path,
      getWidth: 2,
      pickable: true,
      onClick: (item) => setInfo(item.object.name),
    }),
    new PathLayer({
      id: "deckgl-paths-secondary",
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
      getColor: (d) => {
        const hex = d.color;
        return hex.match(/[0-9a-f]{2}/g).map((x: string) => parseInt(x, 16));
      },
      getPath: (d) => d.path,
      getWidth: 1,
      pickable: true,
      onClick: (item) => setInfo(item.coordinate),
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
