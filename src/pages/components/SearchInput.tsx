// Icons
import { Circle, Spline, X } from "lucide-react";
import { MapPinCustom } from "@/assets/icons/1x/map-pin";
// Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
// Packages imports
import type { Feature, Geometry, MultiLineString, Point } from "geojson";
import type { Position } from "deck.gl";
import { type ChangeEvent, type Dispatch, type KeyboardEvent, type SetStateAction, useState } from "react";
// App imports
import colors from "@/config/geojson-colors.config.json";
import type { ICameraOptions } from "@/interfaces/camera-options.interface";
import type { IDetails } from "@/interfaces/details.interface";
import type { IGeoJsonData } from "@/interfaces/geojson-data.interface";
import { EType } from "@/enums/type.enum";
import { cn } from "@/lib/utils";
import { useDistance } from "@/hooks/useDistance";
import { useSearch } from "@/hooks/useSearch";
// Interface
interface IProps {
  setCameraOptions: Dispatch<SetStateAction<ICameraOptions>>;
  setDetails: Dispatch<SetStateAction<IDetails | null>>;
  setSelectedIndex: Dispatch<SetStateAction<number | undefined>>;
}

export function SearchInput({ setCameraOptions, setDetails, setSelectedIndex }: IProps) {
  const [displayResults, setDisplayResults] = useState<boolean>(false);
  const [searchResult, setSearchResult] = useState<Feature<Geometry, IGeoJsonData>[] | undefined>(undefined);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [error, setError] = useState<boolean>(false);
  const { getDistance } = useDistance();
  const { getSearch } = useSearch();

  function handleSearch(searchTerm: string): void {
    setError(false);

    const finded = getSearch(searchTerm);

    if (finded && finded.length > 0) {
      setSearchResult(finded);
      setDisplayResults(true);
    } else {
      setError(true);
    }
  }

  function handleClearSearch(): void {
    setDisplayResults(false);
    setSearchTerm("");
    setError(false);
  }

  function handleInputValue(event: ChangeEvent<HTMLInputElement>): void {
    setError(false);

    if (event.target.value.length === 0) {
      handleClearSearch();
    } else setSearchTerm(event.target.value);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>): void {
    if (event.key === "Enter") handleSearch(searchTerm);
    if (event.key === "Escape") handleClearSearch();
  }

  function getColor(type: string): string {
    return colors.find((c) => c.type === type)?.normal ?? "#000000";
  }

  return (
    <div className="relative w-fit px-6">
      <div className="flex items-center space-x-4">
        <div className="relative">
          <Input
            className={cn("text-xsm h-8 w-[150px] pr-8", error ? "text-red-400 focus-visible:border-red-400" : "")}
            value={searchTerm}
            placeholder="Buscar"
            onKeyDown={handleKeyDown}
            onChange={handleInputValue}
            onFocus={() => setError(false)}
          />
          {searchTerm && (
            <button className="absolute top-1/2 right-3 -translate-y-1/2 p-1" onClick={handleClearSearch}>
              <X size={15} strokeWidth={2} />
            </button>
          )}
        </div>
        <Button
          className="!text-xsm py-1.5 font-normal text-white"
          size="sm"
          variant="default"
          onClick={() => handleSearch(searchTerm)}
        >
          Buscar
        </Button>
      </div>
      {displayResults && (
        <div className="absolute">
          <ScrollArea
            className={cn(
              "bg-card z-50 mt-2 w-[250px] rounded-md border shadow-sm",
              searchResult && searchResult.length > 5 ? "h-[136px]" : "h-fit",
            )}
          >
            <ul className="p-2">
              {searchResult?.map((result, index) => (
                <li key={index}>
                  <button
                    className="flex w-full items-center space-x-2 rounded-sm px-2 py-1 text-left text-xs hover:bg-slate-100"
                    onClick={() => {
                      handleClearSearch();
                      setSelectedIndex(result.properties.id);

                      const res = result as Feature<Point, IGeoJsonData>;
                      const mlres = result as Feature<MultiLineString, IGeoJsonData>;
                      if (res)
                        setDetails({
                          color: getColor(res.properties.type),
                          coordinates:
                            result.geometry.type !== "MultiLineString"
                              ? (res.geometry.coordinates as Position)
                              : undefined,
                          details: res.properties.details,
                          distance:
                            mlres.geometry.type === "MultiLineString"
                              ? getDistance(mlres.geometry.coordinates, "meters")
                              : undefined,
                          name: res.properties.name,
                          type: res.properties.type,
                        });

                      if (res.geometry.type === "Point")
                        setCameraOptions((prev) => {
                          const zoom = res.properties.type === EType.Connection ? 19 : prev.zoom;

                          return {
                            zoom: zoom,
                            center: {
                              lat: res.geometry.coordinates[1],
                              lng: res.geometry.coordinates[0],
                            },
                          };
                        });
                    }}
                  >
                    <span>
                      {result.properties.type === EType.Connection && (
                        <Circle size={15} strokeWidth={0} style={{ fill: getColor(result.properties.type) }} />
                      )}
                      {(result.properties.type === EType.MainNetwork ||
                        result.properties.type === EType.SecondaryNetwork) && (
                        <Spline size={15} strokeWidth={2} color={getColor(result.properties.type)} />
                      )}
                      {result.properties.type === EType.Marker && (
                        <MapPinCustom width={15} height={15} fill={getColor(result.properties.type)} />
                      )}
                    </span>
                    <span className="">{result.properties.details.id}</span>
                    <span>{result.properties.details.title}</span>
                  </button>
                </li>
              ))}
            </ul>
          </ScrollArea>
        </div>
      )}
    </div>
  );
}
