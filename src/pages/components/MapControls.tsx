import { Map } from "lucide-react";

import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { type Dispatch, type SetStateAction } from "react";

import type { IVisualization } from "@/interfaces/visualization.interface";

interface IProps {
  colorScheme: string;
  mapTypeId: string;
  setColorScheme: Dispatch<SetStateAction<string>>;
  setMapTypeId: Dispatch<SetStateAction<string>>;
  visualizations: IVisualization;
}

export function MapControls({
  colorScheme,
  mapTypeId,
  setColorScheme,
  setMapTypeId,
  visualizations,
}: IProps) {
  return (
    <section className="flex rounded-md bg-slate-100 px-3 py-2 md:justify-between">
      <div className="hidden items-center space-x-3 md:flex">
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
              const actualType =
                item === "satellite" && visualizations.showGmMarkers === "on"
                  ? "hybrid"
                  : item;

              setMapTypeId(actualType);
              localStorage.setItem("mapTypeId", actualType);
            }}
          >
            <SelectTrigger className="bg-card w-fit" size="sm">
              {mapTypeId === "roadmap"
                ? "Mapa"
                : mapTypeId === "hybrid"
                  ? "Satelite"
                  : "Satelite"}
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
      </div>
    </section>
  );
}
