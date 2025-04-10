import "maplibre-gl/dist/maplibre-gl.css";
import { DeckProps } from "@deck.gl/core";
import { Map, useControl } from "react-map-gl/maplibre";
import { MapboxOverlay } from "@deck.gl/mapbox";
import { ScatterplotLayer } from "@deck.gl/layers";
import { Dispatch } from "react";

function DeckGLOverlay(props: DeckProps) {
  const overlay = useControl<MapboxOverlay>(() => new MapboxOverlay(props));
  overlay.setProps(props);
  return null;
}

interface IProps {
  setInfo: Dispatch<any>;
}

export function MyMap({ setInfo }: IProps) {
  const layers = [
    new ScatterplotLayer({
      id: "deckgl-circle",
      data: [{ name: "Coop. Wanda", position: [-54.565368, -25.972807] }],
      getPosition: (d) => d.position,
      getFillColor: [255, 0, 0, 100],
      getRadius: 10,
      beforeId: "watername_ocean",
      pickable: true,
      onClick: (item) => setInfo(item.object.name),
    }),
  ];

  return (
    <main className="w-full h-[500px]">
      <Map
        initialViewState={{
          longitude: -54.565368,
          latitude: -25.972807,
          zoom: 16,
        }}
        mapStyle="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
      >
        <DeckGLOverlay
          getTooltip={({ object }) => object && object.name}
          layers={layers}
        />
      </Map>
    </main>
  );
}
