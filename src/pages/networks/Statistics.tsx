// Icons
import { Spline } from "lucide-react";
// App imports
import colors from "@/config/geojson-colors.config.json";
import { EType } from "@/enums/type.enum";
import { useMapData } from "@/hooks/useMapData";
import { useTotalByNetworks } from "@/hooks/useTotalByNetworks";

export function Statistics() {
  const { geoJsonData } = useMapData();
  const networks = useTotalByNetworks(geoJsonData);

  return (
    <main className="flex flex-col space-y-2">
      <section className="text-xsm flex items-center space-x-2">
        <Spline
          size={14}
          strokeWidth={2}
          style={{ stroke: colors.find((c) => c.type === EType.MainNetwork)?.normal }}
        />
        <span className="leading-0 text-slate-500">Redes primarias:</span>
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
          size={14}
          strokeWidth={2}
          style={{ stroke: colors.find((c) => c.type === EType.SecondaryNetwork)?.normal }}
        />
        <span className="leading-0 text-slate-500">Redes secundarias:</span>
        {networks?.total && (
          <span className="text-xs leading-0 font-light">
            {`${new Intl.NumberFormat("es-AR", {
              maximumFractionDigits: 2,
              minimumFractionDigits: 2,
            }).format(networks?.total["secondary-network"])} mts.`}
          </span>
        )}
      </section>
    </main>
  );
}
