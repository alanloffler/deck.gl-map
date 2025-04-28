import selectedColors from "@/config/geojson-colors.config.json";
import type { Feature, Geometry } from "geojson";
import type { IGeoJsonData } from "@/interfaces/geojson-data.interface";
import { Viewport, type PickingInfo } from "deck.gl";
import { useCallback } from "react";

export function useTooltip() {
  function flipTooltip(x: number, y: number, viewport: Viewport, content: string, objType: string): string {
    const tempEl = document.createElement("div");
    tempEl.innerHTML = content;
    tempEl.style.position = "absolute";
    tempEl.style.visibility = "hidden";
    tempEl.style.display = "block";
    document.body.appendChild(tempEl);

    const tooltipWidth = tempEl.offsetWidth;
    const tooltipHeight = tempEl.offsetHeight;

    document.body.removeChild(tempEl);

    const { width, height } = viewport;
    let newX = x;
    let newY = y;
    let extraPixels = 0;
    if (objType === "marker") extraPixels = 12;
    if (objType === "connection") extraPixels = 0;
    if (x + tooltipWidth > width) newX = x - tooltipWidth - extraPixels;
    else newX = x;
    if (y + tooltipHeight > height) newY = y - tooltipHeight - extraPixels;
    else newY = y;

    return `translate(${newX}px, ${newY}px)`;
  }

  const getTooltip = useCallback(({ object, x, y, viewport }: PickingInfo<Feature<Geometry, IGeoJsonData>>) => {
    if (!object) return null;

    const objColor = selectedColors.find((c) => c.type === object.properties.type);
    const htmlTooltip = `<div class="flex flex-col space-y-1">
              <div class="flex flex-row space-x-2 items-center">
                <div
                  class="${object.geometry.type === "Point" ? "h-3 w-3 rounded-full" : "h-1 w-4"}"
                  style="background:${objColor?.normal}"></div>
                <span class="font-medium">${object.properties.name}</span>
              </div>
              <span class="font-medium text-xs"># ${object.properties.details.id}</span>
              <span class="font-normal text-xs">${object.properties.details.street}</span>
            </div>`;

    return {
      html: htmlTooltip,
      style: {
        transform: flipTooltip(x, y, viewport!, htmlTooltip, object.properties.type),
        backgroundColor: "#ffffff",
        border: "1px solid #e2e8f0",
        borderRadius: "8px",
        boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
        color: "#000000",
        fontSize: "13px",
      },
    };
  }, []);

  return { getTooltip };
}
