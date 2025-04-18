import { MapPin, Milestone, Pin, Spline } from "lucide-react";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

import { type Dispatch, type SetStateAction } from "react";

import type { IVisualization } from "@/interfaces/visualization.interface";

interface IProps {
  mapTypeId: string;
  setMapTypeId: Dispatch<SetStateAction<string>>;
  setVisualizations: Dispatch<SetStateAction<IVisualization>>;
  visualizations: IVisualization;
}

export function VisControls({
  mapTypeId,
  setMapTypeId,
  setVisualizations,
  visualizations,
}: IProps) {
  function handleVisualizations(event: boolean, type: string): void {
    const value: string = event ? "on" : "off";

    setVisualizations((prev) => ({
      ...prev,
      [type]: value,
    }));

    localStorage.setItem(type, value);
  }

  return (
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
            <Spline size={19} strokeWidth={2} className="stroke-sky-400" />
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
  );
}
