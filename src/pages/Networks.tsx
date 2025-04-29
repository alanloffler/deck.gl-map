// Components
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// App components
import { DetailsCard } from "@/pages/components/DetailsCard";
import { GeoJsonControls } from "@/pages/networks/GeoJsonControls";
import { MapControls } from "@/pages/components/MapControls";
import { NetsMap } from "@/pages/networks/NetsMap";
// Packages imports
import { useEffect, useState } from "react";
// App imports
import type { ICameraOptions } from "@/interfaces/camera-options.interface";
import type { IDetails } from "@/interfaces/details.interface";
import { cameraConfig } from "@/config/camera.config";
import { cn } from "@/lib/utils";

export default function Networks() {
  const local: string | null = localStorage.getItem("dataVis");
  const [cameraOptions, setCameraOptions] = useState<ICameraOptions>(cameraConfig);
  const [colorScheme, setColorScheme] = useState<string>(localStorage.getItem("colorScheme") ?? "LIGHT");
  const [contentVisible, setContentVisible] = useState<boolean>(false);
  const [dataVisualization, setDataVisualization] = useState<string[]>(
    local !== null ? JSON.parse(local) : ["connection", "main-network", "secondary-network", "marker"],
  );
  const [details, setDetails] = useState<IDetails | null>(null);
  const [isClosing, setIsClosing] = useState<boolean>(false);
  const [mapKey, setMapKey] = useState<string>("mapKey");
  const [mapTypeId, setMapTypeId] = useState<string>(localStorage.getItem("mapTypeId") ?? "roadmap");
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const isPanelVisible = details !== null || isClosing;

  useEffect(() => {
    setMapKey(crypto.randomUUID());
  }, [colorScheme]);

  function handleClose(): void {
    setIsClosing(true);
    setSelectedIndex(null);
    setTimeout(() => {
      setDetails(null);
      setIsClosing(false);
    }, 350);
  }

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
          <GeoJsonControls
            dataVisualization={dataVisualization}
            isPanelVisible={isPanelVisible}
            setDataVisualization={setDataVisualization}
          />
          <NetsMap
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
      <DetailsCard
        contentVisible={contentVisible}
        details={details}
        handleClose={handleClose}
        isClosing={isClosing}
        isPanelVisible={isPanelVisible}
      />
    </main>
  );
}
