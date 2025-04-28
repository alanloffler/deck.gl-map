// Icons
import { Milestone, Ruler, X } from "lucide-react";
// Components
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// App imports
import { cn } from "@/lib/utils";
import { IDetails } from "@/interfaces/details.interface";
// Interface
interface IProps {
  contentVisible: boolean;
  details: IDetails | null;
  handleClose: () => void;
  isClosing: boolean;
  isPanelVisible: boolean;
}

enum ETypes {
  "main-network" = "Red principal",
  "secondary-network" = "Red secundaria",
  connection = "Conexión",
  marker = "Marcador",
  network = "Red",
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
              "flex flex-col transition-opacity duration-300 ease-in-out",
              contentVisible ? "opacity-100" : "opacity-0",
            )}
          >
            {details && (
              <section className="flex flex-col space-y-3">
                <div className="flex items-center space-x-3 text-base font-semibold">
                  {/* <span>{details.name}</span> */}
                  <span>{details.type && (ETypes[details.type] as unknown as keyof typeof ETypes)}</span>
                  <span
                    className={cn(
                      details.details?.id?.charAt(0).toUpperCase() !== "R"
                        ? "h-3 w-3 rounded-full"
                        : "h-1.5 w-7 rounded-sm",
                    )}
                    style={{ background: details.color }}
                  ></span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <span className="ml-1 w-fit font-medium">
                    {details.type === "connection"
                      ? "# Conexión"
                      : details.type === "marker"
                        ? "# Item"
                        : details.type === "network"
                          ? "# Red"
                          : "#"}
                  </span>
                  <span>{details.details?.id}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Milestone size={17} strokeWidth={2} />
                  <div className="text-xsm flex flex-col">
                    <span>{details.details?.street},</span>
                    <span>{details.details?.district}</span>
                  </div>
                </div>
                {details.distance && (
                  <div className="flex items-center space-x-2">
                    <Ruler size={17} strokeWidth={2} />
                    <span className="text-xsm">
                      {new Intl.NumberFormat("es-AR", {
                        maximumFractionDigits: 2,
                      }).format(details.distance)}{" "}
                      metros de longitud
                    </span>
                  </div>
                )}
              </section>
            )}
          </section>
        </CardContent>
      </Card>
    );
}
