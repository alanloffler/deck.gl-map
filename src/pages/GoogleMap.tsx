import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { GMap } from "./components/GMap";
import { useState } from "react";
import type { IDetails } from "../interfaces/details.interface";

export function GoogleMap() {
  const [details, setDetails] = useState<IDetails | null>(null);

  return (
    <main className="flex flex-col gap-6 md:flex-row">
      <Card className="w-full md:w-2/3">
        <CardHeader>
          <CardTitle>Redes de agua potable</CardTitle>
          <CardDescription>Visualización de conexiones</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[500px] w-full">
            <GMap setDetails={setDetails} />
          </div>
        </CardContent>
      </Card>
      <Card className="w-full md:w-1/3">
        <CardHeader>
          <CardTitle>Datos de la selección</CardTitle>
        </CardHeader>
        <CardContent>
          {details && (
            <section>
              <div className="flex items-center space-x-3 text-base font-semibold">
                <span>{details.name}</span>
                <span
                  className={`h-1.5 w-7 rounded-sm bg-[${details.color}]`}
                ></span>
              </div>
            </section>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
