// Icons
import { Milestone, Ruler, Spline, X } from "lucide-react";
// Components
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// App components
import { TestGMap } from "./components/TestGMap";
import { MapControls } from "./components/MapControls";
// import { VisControls } from "./components/VisControls";
// Packages imports
import { useEffect, useState } from "react";
// App imports
import type { ICameraOptions } from "@/interfaces/camera-options.interface";
import type { IDetails } from "@/interfaces/details.interface";
import { cameraConfig } from "@/config/camera.config";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

export default function TestMap() {
  const local = localStorage.getItem("dataVis");

  const [cameraOptions, setCameraOptions] = useState<ICameraOptions>(cameraConfig);
  const [colorScheme, setColorScheme] = useState<string>(localStorage.getItem("colorScheme") ?? "LIGHT");
  const [contentVisible, setContentVisible] = useState<boolean>(false);
  const [dataVisualization, setDataVisualization] = useState<string[]>(
    local !== null ? JSON.parse(local) : ["main-network", "secondary-network"],
  );
  const [details, setDetails] = useState<IDetails | null>(null);
  const [isClosing, setIsClosing] = useState(false);
  const [mapKey, setMapKey] = useState<string>("mapKey");
  const [mapTypeId, setMapTypeId] = useState<string>(localStorage.getItem("mapTypeId") ?? "roadmap");
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  useEffect(() => {
    setMapKey(crypto.randomUUID());
  }, [colorScheme]);

  const handleClose = () => {
    setIsClosing(true);
    setSelectedIndex(null);
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

  useEffect(() => {
    localStorage.setItem("dataVis", JSON.stringify(dataVisualization));
  }, [dataVisualization]);

  return (
    <main className="flex flex-col gap-6 overflow-x-hidden md:flex-row">
      <Card
        className={cn(
          "w-full transition-all duration-300 ease-in-out",
          isPanelVisible && !isClosing ? "md:w-2/3" : isClosing ? "md:w-full" : "md:w-full",
        )}
      >
        <CardHeader>
          <CardTitle>Redes de agua potable</CardTitle>
          <CardDescription className="text-sm">Visualización de conexiones</CardDescription>
        </CardHeader>
        <CardContent>
          <MapControls
            colorScheme={colorScheme}
            mapTypeId={mapTypeId}
            setCameraOptions={setCameraOptions}
            setColorScheme={setColorScheme}
            setMapTypeId={setMapTypeId}
          />
          <section className="flex justify-start space-x-6 py-3 sm:justify-end">
            <Label>Mostrar:</Label>
            <div className="flex items-center space-x-2">
              <Checkbox
                className="bg-card"
                id="main-network"
                defaultChecked={dataVisualization.some((item) => item === "main-network")}
                onCheckedChange={(event) => {
                  if (event === true) {
                    if (!dataVisualization.includes("main-network")) {
                      setDataVisualization((prev) => [...prev, "main-network"]);
                    }
                  } else {
                    const filtered = dataVisualization.filter((item) => item !== "main-network");
                    setDataVisualization(filtered);
                  }
                }}
              />
              <label
                htmlFor="main-network"
                className="flex items-center space-x-1 text-xs leading-none font-light peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                <Spline size={15} strokeWidth={2} className="stroke-sky-400" />
                <span className="hidden md:inline">Red principal</span>
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                className="bg-card"
                id="secondary-network"
                defaultChecked={dataVisualization.some((item) => item === "secondary-network")}
                onCheckedChange={(event) => {
                  if (event === true) {
                    if (!dataVisualization.includes("secondary-network")) {
                      setDataVisualization((prev) => [...prev, "secondary-network"]);
                    }
                  } else {
                    const filtered = dataVisualization.filter((item) => item !== "secondary-network");
                    setDataVisualization(filtered);
                  }
                }}
              />
              <label
                htmlFor="secondary-network"
                className="flex items-center space-x-1 text-xs leading-none font-light peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                <Spline size={15} strokeWidth={2} className="stroke-purple-400" />
                <span className="hidden md:inline">Red secundaria</span>
              </label>
            </div>
          </section>
          <TestGMap
            cameraOptions={cameraOptions}
            colorScheme={colorScheme || "FOLLOW_SYSTEM"}
            dataVisualization={dataVisualization}
            key={mapKey}
            mapTypeId={mapTypeId}
            selectedIndex={selectedIndex}
            setCameraOptions={setCameraOptions}
            setDetails={setDetails}
            setSelectedIndex={setSelectedIndex}
          />
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
                      className={cn(
                        details.details?.id?.charAt(0).toUpperCase() !== "R"
                          ? "h-3 w-3 rounded-full"
                          : "h-1.5 w-7 rounded-sm",
                      )}
                      style={{ background: details.color }}
                    ></span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <span className="ml-1 w-fit font-medium">
                      {details.type === "connection"
                        ? "# Conexión"
                        : details.type === "marker"
                          ? "# Item"
                          : details.type === "network"
                            ? "# Red"
                            : "#"}
                    </span>
                    <span>{details.details?.id}</span>
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
