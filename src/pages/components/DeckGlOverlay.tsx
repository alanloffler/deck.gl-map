import { GoogleMapsOverlay } from "@deck.gl/google-maps";
import { type LayersList, type PickingInfo } from "deck.gl";
import { useEffect, useMemo } from "react";
import { useMap } from "@vis.gl/react-google-maps";
import type { ITooltip } from "@/interfaces/tooltip.type";

type IDeckglOverlay = {
  layers?: LayersList;
  getTooltip?: (object: PickingInfo) => ITooltip | null;
};

export const DeckGlOverlay = ({ layers, getTooltip }: IDeckglOverlay) => {
  const deck = useMemo(
    () =>
      new GoogleMapsOverlay({
        interleaved: true,
        getTooltip: getTooltip,
      }),
    [getTooltip],
  );

  const map = useMap();
  useEffect(() => {
    deck.setMap(map);

    return () => deck.setMap(null);
  }, [deck, map]);

  useEffect(() => {
    deck.setProps({ layers });
  }, [deck, layers]);

  return null;
};
