import { Map, MapPin, Milestone, Ruler, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { GMap } from "./components/GMap";
import { useEffect, useState } from "react";
import type { IDetails } from "../interfaces/details.interface";
import { cn } from "@/lib/utils";

export function GoogleMap() {
  const [clickableIcons, setClickableIcons] = useState<boolean>(false);
  const [colorScheme, setColorScheme] = useState<string>(
    localStorage.getItem("colorScheme") ?? "LIGHT",
  );
  const [contentVisible, setContentVisible] = useState<boolean>(false);
  const [details, setDetails] = useState<IDetails | null>(null);
  const [isClosing, setIsClosing] = useState(false);
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

  const handleClose = () => {
    setIsClosing(true);

    setTimeout(() => {
      setDetails(null);
      setIsClosing(false);
    }, 350);
  };

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (details && !isClosing) {
      timeout = setTimeout(() => {
        setContentVisible(true);
      }, 300);
    } else {
      setContentVisible(false);
    }

    return () => clearTimeout(timeout);
  }, [details, isClosing]);

  const isPanelVisible = details !== null || isClosing;

  return (
    <main className="flex flex-col gap-6 overflow-x-hidden md:flex-row">
      <Card
        className={cn(
          "w-full transition-all duration-300 ease-in-out",
          isPanelVisible && !isClosing
            ? "md:w-2/3"
            : isClosing
              ? "md:w-full"
              : "md:w-full",
        )}
      >
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
                  id="street-names"
                  defaultChecked={streetNames === "on" ? true : false}
                  onCheckedChange={handleStreetNames}
                />
                <label
                  htmlFor="street-names"
                  className="text-xs leading-none font-light peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  <Milestone size={17} strokeWidth={2} />
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  className="bg-card"
                  id="interactive"
                  defaultChecked={interactive === "on" ? true : false}
                  onCheckedChange={handleInteractivity}
                />
                <label
                  htmlFor="interactive"
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
      {isPanelVisible && (
        <Card
          className={cn(
            "relative w-full transition-all duration-300 ease-in-out md:w-1/3",
            isClosing
              ? "translate-x-full opacity-0 md:max-w-0 md:min-w-0 md:overflow-hidden"
              : "translate-x-0 opacity-100",
          )}
        >
          <Button
            className="text-foreground absolute top-2 right-2 rounded-full bg-slate-200 p-1 hover:bg-slate-200/80"
            onClick={handleClose}
            size="miniIcon"
            variant="secondary"
          >
            <X size={17} strokeWidth={2} />
          </Button>
          <CardHeader>
            <CardTitle
              className={cn(
                "transition-opacity duration-300 ease-in-out",
                contentVisible ? "opacity-100" : "opacity-0",
              )}
            >
              Datos de la selección
            </CardTitle>
          </CardHeader>
          <CardContent>
            <section
              className={cn(
                "flex flex-col transition-opacity duration-300 ease-in-out",
                contentVisible ? "opacity-100" : "opacity-0",
              )}
            >
              {details && (
                <section className="flex flex-col space-y-3">
                  <div className="flex items-center space-x-3 text-base font-semibold">
                    <span>{details.name}</span>
                    <span
                      className="h-1.5 w-7 rounded-sm"
                      style={{ background: details.color }}
                    ></span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="ml-1 w-3">#</span>
                    <span className="text-sm font-medium">
                      {details.section?.id}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Milestone size={17} strokeWidth={2} />
                    <div className="text-xsm flex flex-col">
                      <span>{details.section?.street},</span>
                      <span>{details.section?.district}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Ruler size={17} strokeWidth={2} />
                    <span className="text-xsm">
                      {details.distance &&
                        new Intl.NumberFormat("es-AR", {
                          maximumFractionDigits: 2,
                        }).format(details.distance)}{" "}
                      metros de longitud
                    </span>
                  </div>
                </section>
              )}
            </section>
          </CardContent>
        </Card>
      )}
    </main>
  );
}
