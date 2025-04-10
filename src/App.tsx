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
                <span className="font-semibold text-base">{info.name}</span>
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
