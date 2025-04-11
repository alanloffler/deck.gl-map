import { useState } from "react";
import "./App.css";
import { MyMap } from "./components/MyMap";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./components/ui/card";
import { MapPin } from "lucide-react";
import type { IInfo } from "./interfaces/info.interface";

export default function App() {
  const [info, setInfo] = useState<IInfo | undefined>(undefined);

  function getDistanceBetweenPositions(position1, position2) {
    // Extract coordinates (assuming deck.gl format [longitude, latitude])
    const [lon1, lat1] = position1;
    const [lon2, lat2] = position2;

    // Earth's radius in meters
    const R = 6371000;

    // Convert degrees to radians
    const lat1Rad = (lat1 * Math.PI) / 180;
    const lon1Rad = (lon1 * Math.PI) / 180;
    const lat2Rad = (lat2 * Math.PI) / 180;
    const lon2Rad = (lon2 * Math.PI) / 180;

    // Differences in coordinates
    const dLat = lat2Rad - lat1Rad;
    const dLon = lon2Rad - lon1Rad;

    // Haversine formula
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1Rad) *
        Math.cos(lat2Rad) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    return distance; // Distance in meters
  }

  // Example usage with your coordinates
  const position1 = [-54.565458, -25.972745]; // [longitude, latitude]
  const position2 = [-54.565458, -25.972906]; // [longitude, latitude]

  const distanceInMeters = getDistanceBetweenPositions(position1, position2);
  console.log(`Distance: ${distanceInMeters.toFixed(2)} meters`);

  return (
    <main className="flex flex-row gap-6">
      <Card className="w-2/3">
        <CardHeader>
          <CardTitle>Redes de agua potable</CardTitle>
          <CardDescription>Visualización de conexiones</CardDescription>
        </CardHeader>
        <CardContent>
          <MyMap className="w-full" setInfo={setInfo} />
        </CardContent>
      </Card>
      <Card className="w-1/3">
        <CardHeader>
          <CardTitle>Datos de la selección</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-base font-normal">
            {info ? (
              <div className="flex flex-col text-sm space-y-2">
                <div className="flex items-center space-x-3 font-semibold text-base">
                  <span>{info.name}</span>
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: info.color ?? "#00000099" }}
                  ></div>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin size={17} strokeWidth={2} />
                  <span>{info.position && info.position[0]}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin size={17} strokeWidth={2} />
                  <span>{info.position && info.position[1]}</span>
                </div>
              </div>
            ) : (
              <p>Realiza la selección de algún elemento del mapa</p>
            )}
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
