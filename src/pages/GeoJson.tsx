import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GoogleMapsOverlay } from "@deck.gl/google-maps";
import { APIProvider, Map, useMap } from "@vis.gl/react-google-maps";
import { DeckProps, GeoJsonLayer, PickingInfo } from "deck.gl";
import { useCallback, useEffect, useMemo, useState } from "react";
import geojsonData from "../data/networks/main-network.json";
import { Feature, GeoJSON, Geometry } from "geojson";
import { hexToRgb } from "@/lib/helpers";
import { IGeoJsonData } from "@/interfaces/geojson-data.interface";
import { IMarker } from "@/interfaces/marker.interface";
import { DeckGLOverlay } from "./components/DeckGLOverlay";

export function GeoJson() {
  const [data, setData] = useState<GeoJSON>();

  useEffect(() => {
    setData(geojsonData as GeoJSON);
  }, []);

  const layers = [
    new GeoJsonLayer({
      id: "geojson-layer",
      data: data,
      lineWidthScale: 2,
      lineWidthMinPixels: 3,
      getLineColor: (f: Feature<Geometry, IGeoJsonData>) =>
        hexToRgb(f.properties?.color),
      parameters: {
        depthTest: false,
      },
      pickable: true,
    }),
  ];

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
    <Card>
      <CardHeader>
        <CardTitle>GeoJson map</CardTitle>
      </CardHeader>
      <CardContent>
        <section className="h-[450px]">
          <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
            <Map
              mapId="cd5bd2065fd561ba"
              defaultCenter={{ lng: -54.566963, lat: -25.973053 }}
              defaultZoom={15}
            >
              <DeckGLOverlay layers={layers} getTooltip={getTooltip} />
            </Map>
          </APIProvider>
        </section>
      </CardContent>
    </Card>
  );
}
