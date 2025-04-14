import { Map, MapPin, Milestone } from "lucide-react";
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
  const [interactive, setInteractive] = useState<"on" | "off">(
    (localStorage.getItem("interactive") as "on" | "off") ?? "off",
  );
  const [mapKey, setMapKey] = useState<string>("mapKey");
  const [mapTypeId, setMapTypeId] = useState<string>(
    localStorage.getItem("mapTypeId") ?? "roadmap",
  );
  const [streetNames, setStreetNames] = useState<"on" | "off">(
    (localStorage.getItem("streetNames") as "on" | "off") ?? "on",
  );

  useEffect(() => {
    setMapKey(crypto.randomUUID());
  }, [colorScheme]);

  function handleInteractivity(event: boolean): void {
    setClickableIcons(event);
    if (event === true) {
      setInteractive("on");
      localStorage.setItem("interactive", "on");
    }
    if (event === false) {
      setInteractive("off");
      localStorage.setItem("interactive", "off");
    }
  }

  function handleStreetNames(event: boolean): void {
    if (event === true) {
      setStreetNames("on");
      localStorage.setItem("streetNames", "on");
    }
    if (event === false) {
      setStreetNames("off");
      localStorage.setItem("streetNames", "off");
    }
  }

  return (
    <main className="flex flex-col gap-6 md:flex-row">
      <Card className="w-full md:w-2/3">
        <CardHeader>
          <CardTitle>Redes de agua potable</CardTitle>
          <CardDescription className="text-sm">
            Visualización de conexiones
          </CardDescription>
        </CardHeader>
        <CardContent>
          <section className="flex justify-between rounded-md bg-slate-100 px-3 py-2">
            <div className="hidden items-center space-x-3 lg:flex">
              <Map size={17} strokeWidth={2} />
              <span className="text-sm font-medium">Mapa</span>
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
                      <SelectItem
                        value={interactive ? "hybrid" : "satellite"}
                        size="sm"
                      >
                        Satelite
                      </SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </section>
          <section className="flex justify-end py-3">
            <div className="flex space-x-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  className="bg-card"
                  id="terms"
                  defaultChecked={streetNames === "on" ? true : false}
                  onCheckedChange={handleStreetNames}
                />
                <label
                  htmlFor="terms"
                  className="text-xs leading-none font-light peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  <Milestone size={17} strokeWidth={2} />
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  className="bg-card"
                  id="terms"
                  defaultChecked={interactive === "on" ? true : false}
                  onCheckedChange={handleInteractivity}
                />
                <label
                  htmlFor="terms"
                  className="text-xs leading-none font-light peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  <MapPin size={17} strokeWidth={2} />
                </label>
              </div>
            </div>
          </section>
          <div className="h-[450px] w-full bg-slate-50">
            <GMap
              clickableIcons={clickableIcons}
              colorScheme={colorScheme || "FOLLOW_SYSTEM"}
              interactive={interactive}
              key={mapKey}
              mapTypeId={mapTypeId}
              setDetails={setDetails}
              streetNames={streetNames}
            />
          </div>
        </CardContent>
      </Card>
      <Card className="w-full md:w-1/3">
        <CardHeader>
          <CardTitle>Datos de la selección</CardTitle>
        </CardHeader>
        <CardContent className="h-full">
          <section className="flex flex-col">
            {details && (
              <section>
                <div className="flex items-center space-x-3 text-base font-semibold">
                  <span>{details.name}</span>
                  <span
                    className="h-1.5 w-7 rounded-sm"
                    style={{ background: details.color }}
                  ></span>
                </div>
              </section>
            )}
            <section className="sr-only mt-auto pt-8 md:pt-4">
              Card footer
            </section>
          </section>
        </CardContent>
      </Card>
    </main>
  );
}
