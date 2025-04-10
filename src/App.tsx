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

export default function App() {
  const [info, setInfo] = useState(undefined);

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
              <p>{info}</p>
            ) : (
              <p>Realiza la selección de algún elemento del mapa</p>
            )}
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
