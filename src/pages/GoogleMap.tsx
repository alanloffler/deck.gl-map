import { Settings2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { GMap } from "./components/GMap";
import { useEffect, useState } from "react";
import type { IDetails } from "../interfaces/details.interface";

export function GoogleMap() {
  const [clickableIcons, setClickableIcons] = useState<boolean>(false);
  const [colorScheme, setColorScheme] = useState<string>(
    localStorage.getItem("colorScheme") ?? "LIGHT",
  );
  const [details, setDetails] = useState<IDetails | null>(null);
  const [mapKey, setMapKey] = useState<string>("mapKey");
  const [mapTypeId, setMapTypeId] = useState<string>(
    localStorage.getItem("mapTypeId") ?? "roadmap",
  );
  const [poiVisibility, setPoiVisibility] = useState<"on" | "off">("on");

  useEffect(() => {
    setMapKey(crypto.randomUUID());
  }, [colorScheme]);

  function handleInteractivity(event: boolean): void {
    setClickableIcons(event);
    if (event === true) {
      setPoiVisibility("on");
    } else setPoiVisibility("off");
  }

  return (
    <main className="flex flex-col gap-6 md:flex-row">
      <Card className="w-full md:w-2/3">
        <CardHeader>
          <CardTitle>Redes de agua potable</CardTitle>
          <CardDescription>Visualización de conexiones</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <section className="flex justify-between rounded-md bg-slate-100 px-3 py-2">
            <div className="hidden items-center space-x-3 lg:flex">
              <Settings2 size={17} strokeWidth={2} />
              <span className="text-sm font-medium">Controles</span>
            </div>
            <div className="flex flex-row items-center space-x-3">
              <div className="flex items-center space-x-3">
                <Label className="font-normal text-slate-500">Tema</Label>
                <Select
                  defaultValue={colorScheme}
                  onValueChange={(item) => {
                    setColorScheme(item);
                    localStorage.setItem("colorScheme", item);
                  }}
                >
                  <SelectTrigger className="bg-card w-fit" size="sm">
                    <SelectValue placeholder="Tema" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="LIGHT" size="sm">
                        Claro
                      </SelectItem>
                      <SelectItem value="DARK" size="sm">
                        Oscuro
                      </SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-3">
                <Label className="font-normal text-slate-500">Tipo</Label>
                <Select
                  defaultValue={mapTypeId}
                  onValueChange={(item) => {
                    setMapTypeId(item);
                    localStorage.setItem("mapTypeId", item);
                  }}
                >
                  <SelectTrigger className="bg-card w-fit" size="sm">
                    <SelectValue placeholder="Tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="roadmap" size="sm">
                        Mapa
                      </SelectItem>
                      <SelectItem value="satellite" size="sm">
                        Satelite
                      </SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  className="bg-card"
                  id="terms"
                  onCheckedChange={handleInteractivity}
                />
                <label
                  htmlFor="terms"
                  className="font-base text-xs leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Interactivo
                </label>
              </div>
            </div>
          </section>
          <div className="h-[450px] w-full">
            <GMap
              clickableIcons={clickableIcons}
              colorScheme={colorScheme || "FOLLOW_SYSTEM"}
              key={mapKey}
              mapTypeId={mapTypeId}
              poiVisibility={poiVisibility}
              setDetails={setDetails}
            />
          </div>
        </CardContent>
      </Card>
      <Card className="w-full md:w-1/3">
        <CardHeader>
          <CardTitle>Datos de la selección</CardTitle>
        </CardHeader>
        <CardContent className="h-full">
          <section className="flex h-full flex-col">
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
            <section className="mt-auto pt-8 md:pt-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="terms"
                  onCheckedChange={() => setClickableIcons(!clickableIcons)}
                />
                <label
                  htmlFor="terms"
                  className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Elementos interactivos
                </label>
              </div>
            </section>
          </section>
        </CardContent>
      </Card>
    </main>
  );
}
