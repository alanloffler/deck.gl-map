// Icons
import { Map } from "lucide-react";
// Components
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
// Package imports
import { type Dispatch, type SetStateAction } from "react";
// Interface
interface IProps {
  colorScheme: string;
  mapTypeId: string;
  setColorScheme: Dispatch<SetStateAction<string>>;
  setMapTypeId: Dispatch<SetStateAction<string>>;
}

export function MapControls({
  colorScheme,
  mapTypeId,
  setColorScheme,
  setMapTypeId,
}: IProps) {
  function handleColorScheme(value: string): void {
    setColorScheme(value);
    localStorage.setItem("colorScheme", value);
  }

  function handleMapTypeId(value: string): void {
    setMapTypeId(value);
    localStorage.setItem("mapTypeId", value);
  }

  return (
    <section className="flex rounded-md bg-slate-100 px-3 py-2 sm:justify-between">
      <div className="hidden items-center space-x-3 sm:flex">
        <Map size={17} strokeWidth={2} />
        <span className="text-sm font-medium">Mapa</span>
      </div>
      <div className="flex flex-row items-center space-x-3">
        <div className="flex items-center space-x-3">
          <Label className="font-normal text-slate-500">Tema</Label>
          <Select defaultValue={colorScheme} onValueChange={handleColorScheme}>
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
          <Select defaultValue={mapTypeId} onValueChange={handleMapTypeId}>
            <SelectTrigger className="bg-card w-fit" size="sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="roadmap" size="sm">
                  Ruta
                </SelectItem>
                <SelectItem value="terrain" size="sm">
                  Terreno
                </SelectItem>
                <SelectItem value="satellite" size="sm">
                  Satélite
                </SelectItem>
                <SelectItem value="hybrid" size="sm">
                  Híbrido
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
    </section>
  );
}
