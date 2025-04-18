import { MapPin, Milestone, Pin, Ruler, Spline, X } from "lucide-react";

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

import { GMap } from "./components/GMap";
import { MapControls } from "./components/MapControls";

import { useEffect, useState } from "react";

import type { IDetails } from "../interfaces/details.interface";
import type { IVisualization } from "@/interfaces/visualization.interface";
import { cn } from "@/lib/utils";

export function GoogleMap() {
  const [colorScheme, setColorScheme] = useState<string>(
    localStorage.getItem("colorScheme") ?? "LIGHT",
  );
  const [contentVisible, setContentVisible] = useState<boolean>(false);
  const [details, setDetails] = useState<IDetails | null>(null);
  const [isClosing, setIsClosing] = useState(false);
  const [mapKey, setMapKey] = useState<string>("mapKey");
  const [mapTypeId, setMapTypeId] = useState<string>(
    localStorage.getItem("mapTypeId") ?? "roadmap",
  );

  useEffect(() => {
    setMapKey(crypto.randomUUID());
  }, [colorScheme]);

  const [visualizations, setVisualizations] = useState<IVisualization>({
    showGmMarkers: localStorage.getItem("showGmMarkers") ?? "off",
    showMarkers: localStorage.getItem("showMarkers") ?? "on",
    showMainNetworks: localStorage.getItem("showMainNetwork") ?? "on",
    showSecondaryNetworks: localStorage.getItem("showSecondaryNetwork") ?? "on",
    showStreetNames: localStorage.getItem("showStreetNames") ?? "on",
  });

  function handleVisualizations(event: boolean, type: string): void {
    const value: string = event ? "on" : "off";

    setVisualizations((prev) => ({
      ...prev,
      [type]: value,
    }));

    localStorage.setItem(type, value);
    console.log(`Show ${type}: `, value);
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
          <MapControls
            colorScheme={colorScheme}
            mapTypeId={mapTypeId}
            setColorScheme={setColorScheme}
            setMapTypeId={setMapTypeId}
            visualizations={visualizations}
          />
          <section className="flex justify-end space-x-6 py-3">
            <Label>Mostrar:</Label>
            <div className="flex space-x-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  className="bg-card"
                  id="main-networks"
                  defaultChecked={
                    visualizations.showMainNetworks === "on" ? true : false
                  }
                  onCheckedChange={(event) =>
                    handleVisualizations(event as boolean, "showMainNetworks")
                  }
                />
                <label
                  htmlFor="main-networks"
                  className="text-xs leading-none font-light peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  <Spline
                    size={19}
                    strokeWidth={2}
                    className="stroke-sky-400"
                  />
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  className="bg-card"
                  id="markers"
                  defaultChecked={
                    visualizations.showMarkers === "on" ? true : false
                  }
                  onCheckedChange={(event) =>
                    handleVisualizations(event as boolean, "showMarkers")
                  }
                />
                <label
                  htmlFor="markers"
                  className="text-xs leading-none font-light peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  <Pin
                    size={19}
                    strokeWidth={2}
                    className="fill-amber-400/70 stroke-amber-400"
                  />
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  className="bg-card"
                  id="street-names"
                  defaultChecked={
                    visualizations.showStreetNames === "on" ? true : false
                  }
                  onCheckedChange={(event: boolean) =>
                    handleVisualizations(event, "showStreetNames")
                  }
                />
                <label
                  htmlFor="street-names"
                  className="text-xs leading-none font-light peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  <Milestone
                    size={19}
                    strokeWidth={2}
                    className="fill-stone-400/70 stroke-stone-400"
                  />
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  className="bg-card"
                  id="google-markers"
                  defaultChecked={
                    visualizations.showGmMarkers === "on" ? true : false
                  }
                  onCheckedChange={(event: boolean) => {
                    handleVisualizations(event, "showGmMarkers");
                    if (mapTypeId !== "roadmap") {
                      const type = event ? "hybrid" : "satellite";
                      setMapTypeId(type);
                      localStorage.setItem("mapTypeId", type);
                    }
                  }}
                />
                <label
                  htmlFor="google-markers"
                  className="text-xs leading-none font-light peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  <MapPin
                    size={19}
                    strokeWidth={2}
                    className="fill-rose-400/70 stroke-rose-400"
                  />
                </label>
              </div>
            </div>
          </section>
          <div className="h-[450px] w-full bg-slate-50">
            <GMap
              colorScheme={colorScheme || "FOLLOW_SYSTEM"}
              key={mapKey}
              mapTypeId={mapTypeId}
              setDetails={setDetails}
              visualizations={visualizations}
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
                      {details.details?.id}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Milestone size={17} strokeWidth={2} />
                    <div className="text-xsm flex flex-col">
                      <span>{details.details?.street},</span>
                      <span>{details.details?.district}</span>
                    </div>
                  </div>
                  {details.distance && (
                    <div className="flex items-center space-x-2">
                      <Ruler size={17} strokeWidth={2} />
                      <span className="text-xsm">
                        {new Intl.NumberFormat("es-AR", {
                          maximumFractionDigits: 2,
                        }).format(details.distance)}{" "}
                        metros de longitud
                      </span>
                    </div>
                  )}
                </section>
              )}
            </section>
          </CardContent>
        </Card>
      )}
    </main>
  );
}
