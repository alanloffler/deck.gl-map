import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GoogleMapsOverlay } from "@deck.gl/google-maps";
import { APIProvider, Map, useMap } from "@vis.gl/react-google-maps";
import { DeckProps, GeoJsonLayer } from "deck.gl";
import { useEffect, useMemo, useState } from "react";
import geojsonData from "../data/networks/main-network.json";
import { Feature, GeoJSON, Geometry } from "geojson";
import { hexToRgb } from "@/lib/helpers";
import { IGeoJsonData } from "@/interfaces/geojson-data.interface";

export function GeoJson() {
  const [data, setData] = useState<GeoJSON>();
  useEffect(() => {
    setData(geojsonData as GeoJSON);
  }, []);
  function DeckGLOverlay(props: DeckProps) {
    const map = useMap();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const overlay = useMemo(() => new GoogleMapsOverlay(props), []);

    useEffect(() => {
      overlay.setMap(map);
      return () => overlay.setMap(null);
    }, [map]);

    overlay.setProps({ ...props, interleaved: true });
    return null;
  }

  const layers = [
    new GeoJsonLayer({
      id: "geojson-layer",
      data: data,
      lineWidthScale: 2,
      lineWidthMinPixels: 3,
      getLineColor: (f: Feature<Geometry, IGeoJsonData>) =>
        hexToRgb(f.properties?.color),
      getLineWidth: 2,
      parameters: {
        depthTest: false,
      },
    }),
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>GeoJson map</CardTitle>
      </CardHeader>
      <CardContent>
        <section className="h-[450px]">
          <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
            <Map
              defaultCenter={{ lng: -54.566963, lat: -25.973053 }}
              defaultZoom={15}
            >
              <DeckGLOverlay layers={layers} />
            </Map>
          </APIProvider>
        </section>
      </CardContent>
    </Card>
  );
}
