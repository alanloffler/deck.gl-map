// Icons
import { Circle, Spline } from "lucide-react";
// Components
import { Label } from "@/components/ui/label";
// App imports
import colors from "@/config/geojson-colors.config.json";
import { EType } from "@/enums/type.enum";
import { useMapData } from "@/hooks/useMapData";
import { useTotalByNetworks } from "@/hooks/useTotalByNetworks";
import { useTotalConnections } from "@/hooks/useTotalConnections";

export function Statistics() {
  const { geoJsonData } = useMapData();
  const connections = useTotalConnections(geoJsonData);
  const networks = useTotalByNetworks(geoJsonData);

  return (
    <main className="flex flex-col space-y-2">
      <Label>Totales</Label>
      <section className="text-xsm flex items-center space-x-2">
        <Spline
          size={15}
          strokeWidth={2}
          style={{ stroke: colors.find((c) => c.type === EType.MainNetwork)?.normal }}
        />
        <span className="leading-0 text-slate-500 md:hidden lg:block">Redes primarias:</span>
        {networks?.total && (
          <span className="text-xs leading-0 font-light">
            {`${new Intl.NumberFormat("es-AR", {
              maximumFractionDigits: 2,
              minimumFractionDigits: 2,
            }).format(networks?.total["main-network"])} mts.`}
          </span>
        )}
      </section>
      <section className="text-xsm flex items-center space-x-2">
        <Spline
          size={15}
          strokeWidth={2}
          style={{ stroke: colors.find((c) => c.type === EType.SecondaryNetwork)?.normal }}
        />
        <span className="leading-0 text-slate-500 md:hidden lg:block">Redes secundarias:</span>
        {networks?.total && (
          <span className="text-xs leading-0 font-light">
            {`${new Intl.NumberFormat("es-AR", {
              maximumFractionDigits: 2,
              minimumFractionDigits: 2,
            }).format(networks?.total["secondary-network"])} mts.`}
          </span>
        )}
      </section>
      <section className="text-xsm flex items-center space-x-2">
        <Circle size={15} strokeWidth={0} style={{ fill: colors.find((c) => c.type === EType.Connection)?.normal }} />
        <span className="leading-0 text-slate-500 md:hidden lg:block">Conexiones:</span>
        <span className="text-xs leading-0 font-light">{connections}</span>
      </section>
    </main>
  );
}
