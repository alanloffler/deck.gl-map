// Icons
import { MapPin, Spline } from "lucide-react";
// Components
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
// Packages imports
import { type Dispatch, type SetStateAction } from "react";
// App imports
import type { IVisualization } from "@/interfaces/visualization.interface";
// Interface
interface IProps {
  setVisualizations: Dispatch<SetStateAction<IVisualization>>;
  visualizations: IVisualization;
}

export function VisControls({ setVisualizations, visualizations }: IProps) {
  function handleVisualizations(event: boolean, type: string): void {
    const value: string = event ? "on" : "off";

    setVisualizations((prev) => ({
      ...prev,
      [type]: value,
    }));

    localStorage.setItem(type, value);
  }

  return (
    <section className="flex justify-start space-x-6 py-3 sm:justify-end">
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
            className="flex items-center space-x-1 text-xs leading-none font-light peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            <Spline size={15} strokeWidth={2} className="stroke-sky-400" />
            <span className="hidden md:inline">Red principal</span>
          </label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            className="bg-card"
            id="secondary-networks"
            defaultChecked={
              visualizations.showSecondaryNetworks === "on" ? true : false
            }
            onCheckedChange={(event) =>
              handleVisualizations(event as boolean, "showSecondaryNetworks")
            }
          />
          <label
            htmlFor="secondary-networks"
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
            defaultChecked={visualizations.showMarkers === "on" ? true : false}
            onCheckedChange={(event) =>
              handleVisualizations(event as boolean, "showMarkers")
            }
          />
          <label
            htmlFor="markers"
            className="flex items-center space-x-1 text-xs leading-none font-light peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            <MapPin
              size={19}
              strokeWidth={2}
              className="fill-rose-400/70 stroke-rose-400"
            />
            <span className="hidden md:inline">Marcadores</span>
          </label>
        </div>
      </div>
    </section>
  );
}
