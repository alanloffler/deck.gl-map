// Icons
import { Circle, Spline } from "lucide-react";
// Components
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
// App components
import { MapPinCustom } from "@/assets/icons/1x/map-pin";
// Packages imports
import type { Dispatch, SetStateAction } from "react";
// App imports
import colors from "@/config/geojson-colors.config.json";
import { EType } from "@/enums/type.enum";
import { cn } from "@/lib/utils";
// Interface
interface IProps {
  dataVisualization: string[];
  isPanelVisible: boolean;
  setDataVisualization: Dispatch<SetStateAction<string[]>>;
}

export function GeoJsonControls({ dataVisualization, isPanelVisible, setDataVisualization }: IProps) {
  return (
    <main className="flex items-center justify-start space-x-6 py-3 sm:justify-end">
      <Label className={cn("!text-xsm text-slate-700", isPanelVisible ? "hidden lg:inline" : "hidden sm:inline")}>
        Mostrar:
      </Label>
      <div className="flex items-center space-x-2">
        <Checkbox
          className="bg-card"
          id="main-network"
          defaultChecked={dataVisualization.some((item) => item === EType.MainNetwork)}
          onCheckedChange={(event) => {
            if (event === true) {
              if (!dataVisualization.includes(EType.MainNetwork)) {
                setDataVisualization((prev) => [...prev, EType.MainNetwork]);
              }
            } else {
              const filtered = dataVisualization.filter((item) => item !== EType.MainNetwork);
              setDataVisualization(filtered);
            }
          }}
        />
        <label
          htmlFor="main-network"
          className="flex items-center space-x-1 text-xs leading-none font-light peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          <Spline
            size={15}
            strokeWidth={2}
            style={{ stroke: colors.find((c) => c.type === EType.MainNetwork)?.normal }}
          />
          <span className={cn(isPanelVisible ? "hidden lg:inline" : "hidden md:inline")}>Red principal</span>
        </label>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox
          className="bg-card"
          id="secondary-network"
          defaultChecked={dataVisualization.some((item) => item === EType.SecondaryNetwork)}
          onCheckedChange={(event) => {
            if (event === true) {
              if (!dataVisualization.includes(EType.SecondaryNetwork)) {
                setDataVisualization((prev) => [...prev, EType.SecondaryNetwork]);
              }
            } else {
              const filtered = dataVisualization.filter((item) => item !== EType.SecondaryNetwork);
              setDataVisualization(filtered);
            }
          }}
        />
        <label
          htmlFor="secondary-network"
          className="flex items-center space-x-1 text-xs leading-none font-light peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          <Spline
            size={15}
            strokeWidth={2}
            style={{ stroke: colors.find((c) => c.type === EType.SecondaryNetwork)?.normal }}
          />
          <span className={cn(isPanelVisible ? "hidden lg:inline" : "hidden md:inline")}>Red secundaria </span>
        </label>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox
          className="bg-card"
          id="markers"
          defaultChecked={dataVisualization.some((item) => item === EType.Marker)}
          onCheckedChange={(event) => {
            if (event === true) {
              if (!dataVisualization.includes(EType.Marker)) {
                setDataVisualization((prev) => [...prev, EType.Marker]);
              }
            } else {
              const filtered = dataVisualization.filter((item) => item !== EType.Marker);
              setDataVisualization(filtered);
            }
          }}
        />
        <label
          htmlFor="markers"
          className="flex items-center space-x-1 text-xs leading-none font-light peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          <MapPinCustom width={16} height={16} fill={colors.find((c) => c.type === EType.Marker)?.normal} />
          <span className={cn(isPanelVisible ? "hidden lg:inline" : "hidden md:inline")}>Marcadores</span>
        </label>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox
          className="bg-card"
          id="connections"
          defaultChecked={dataVisualization.some((item) => item === EType.Connection)}
          onCheckedChange={(event) => {
            if (event === true) {
              if (!dataVisualization.includes(EType.Connection)) {
                setDataVisualization((prev) => [...prev, EType.Connection]);
              }
            } else {
              const filtered = dataVisualization.filter((item) => item !== EType.Connection);
              setDataVisualization(filtered);
            }
          }}
        />
        <label
          htmlFor="connections"
          className="flex items-center space-x-1 text-xs leading-none font-light peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          <Circle size={16} strokeWidth={0} style={{ fill: colors.find((c) => c.type === EType.Connection)?.normal }} />
          <span className={cn(isPanelVisible ? "hidden lg:inline" : "hidden md:inline")}>Conexiones</span>
        </label>
      </div>
    </main>
  );
}
