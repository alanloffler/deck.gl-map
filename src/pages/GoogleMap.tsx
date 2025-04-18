import { Milestone, Ruler, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { GMap } from "./components/GMap";
import { MapControls } from "./components/MapControls";
import { VisControls } from "./components/VisControls";

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
          <VisControls
            mapTypeId={mapTypeId}
            setMapTypeId={setMapTypeId}
            setVisualizations={setVisualizations}
            visualizations={visualizations}
          />
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
