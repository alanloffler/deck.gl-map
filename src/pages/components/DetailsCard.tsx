// Icons
import { X } from "lucide-react";
// Components
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// App components
import { MapPinCustom } from "@/assets/icons/1x/map-pin";
// App imports
import color from "@/config/geojson-colors.config.json";
import type { IDetails } from "@/interfaces/details.interface";
import { EType } from "@/enums/type.enum";
import { cn } from "@/lib/utils";
import { Statistics } from "../networks/Statistics";
// Interface
interface IProps {
  contentVisible: boolean;
  details: IDetails | null;
  handleClose: () => void;
  isClosing: boolean;
  isPanelVisible: boolean;
}

export function DetailsCard({ contentVisible, details, handleClose, isClosing, isPanelVisible }: IProps) {
  if (isPanelVisible)
    return (
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
            className={cn("transition-opacity duration-300 ease-in-out", contentVisible ? "opacity-100" : "opacity-0")}
          >
            Datos de la selección
          </CardTitle>
        </CardHeader>
        <CardContent>
          <section
            className={cn(
              "flex flex-col space-y-12 transition-opacity duration-300 ease-in-out md:space-y-0",
              contentVisible ? "opacity-100" : "opacity-0",
            )}
          >
            {details && (
              <section className="flex flex-col space-y-3">
                <div className="flex items-center space-x-3 text-base font-semibold">
                  <span
                    style={{ color: details.color }}
                    className="text-xsm rounded-md border border-slate-200 bg-slate-50 p-1.5 leading-none font-semibold shadow-xs"
                  >
                    {details.details?.id}
                  </span>
                  <span>{details.name}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-xsm font-semibold text-slate-500">
                    <small>NOMBRE:</small>
                  </span>
                  <span className="text-xsm font-semibold"> {details.details?.title}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-xsm font-semibold text-slate-500">
                    <small>DIRECCION:</small>
                  </span>
                  <span className="text-xsm">{details.details?.street}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-xsm font-semibold text-slate-500">
                    <small>BARRIO:</small>
                  </span>
                  <span className="text-xsm">{details.details?.district}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-xsm font-semibold text-slate-500">
                    <small>ID:</small>
                  </span>
                  <span className="text-xsm">{details.details?.id}</span>
                </div>
                {details.distance && (
                  <div className="flex items-center space-x-2">
                    <span className="text-xsm font-semibold text-slate-500">
                      <small>LONGITUD:</small>
                    </span>
                    <span className="text-xsm">
                      {`${new Intl.NumberFormat("es-AR", {
                        maximumFractionDigits: 2,
                        minimumFractionDigits: 2,
                      }).format(details.distance)} mts.`}
                    </span>
                  </div>
                )}
                {details.coordinates && (
                  <div className="-ml-1 flex items-center space-x-2">
                    <MapPinCustom
                      width={18}
                      height={18}
                      fill={color.find((c) => c.type === EType.Marker)?.normal ?? "black"}
                    />
                    <span className="text-xs font-light text-slate-600">{`[${details.coordinates[0]}, ${details.coordinates[1]}]`}</span>
                  </div>
                )}
              </section>
            )}
            <section className="bottom-5 flex md:fixed">
              <Statistics />
            </section>
          </section>
        </CardContent>
      </Card>
    );
}
