// Icons
import { Spline } from "lucide-react";
// Components
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
// App components
import { MapPinCustom } from "@/assets/icons/1x/map-pin";
// Packages imports
import type { Dispatch, SetStateAction } from "react";
// Interface
interface IProps {
  dataVisualization: string[];
  setDataVisualization: Dispatch<SetStateAction<string[]>>;
}

export function GeoJsonControls({ dataVisualization, setDataVisualization }: IProps) {
  return (
    <main className="flex justify-start space-x-6 py-3 sm:justify-end">
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
      <div className="flex items-center space-x-2">
        <Checkbox
          className="bg-card"
          id="markers"
          defaultChecked={dataVisualization.some((item) => item === "marker")}
          onCheckedChange={(event) => {
            if (event === true) {
              if (!dataVisualization.includes("marker")) {
                setDataVisualization((prev) => [...prev, "marker"]);
              }
            } else {
              const filtered = dataVisualization.filter((item) => item !== "marker");
              setDataVisualization(filtered);
            }
          }}
        />
        <label
          htmlFor="markers"
          className="flex items-center space-x-1 text-xs leading-none font-light peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          <MapPinCustom width={16} height={16} fill="#fb7185" />
          <span className="hidden md:inline">Marcadores</span>
        </label>
      </div>
    </main>
  );
}
