import { MapPin, Ruler } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { MyMap } from "./components/MyMap";
import { useState } from "react";
import type { IInfo } from "../interfaces/info.interface";

export function MapLibre() {
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
              <div className="flex flex-col space-y-2 text-sm">
                <div className="flex items-center space-x-3 text-base font-semibold">
                  <span>{info.name}</span>
                  <div
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: info.color ?? "#00000099" }}
                  ></div>
                </div>
                {info.position && (
                  <div className="flex items-center space-x-3">
                    <MapPin size={17} strokeWidth={2} />
                    <span>{info.position[0]}</span>
                  </div>
                )}
                {info.position && (
                  <div className="flex items-center space-x-3">
                    <MapPin size={17} strokeWidth={2} />
                    <span>{info.position[1]}</span>
                  </div>
                )}
                {info.mts && (
                  <div className="flex items-center space-x-3">
                    <Ruler size={17} strokeWidth={2} />
                    <span>
                      {Intl.NumberFormat("es-AR", {
                        maximumFractionDigits: 2,
                      }).format(info.mts)}{" "}
                      metros
                    </span>
                  </div>
                )}
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
