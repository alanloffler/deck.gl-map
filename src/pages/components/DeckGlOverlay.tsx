import { GoogleMapsOverlay } from "@deck.gl/google-maps";
import { Layer, type LayersList, type PickingInfo } from "deck.gl";
import { useEffect, useMemo } from "react";
import { useMap } from "@vis.gl/react-google-maps";
import type { ITooltip } from "@/interfaces/tooltip.type";

type IDeckGLOverlay = {
  layers?: LayersList;
  getTooltip?: (object: PickingInfo) => ITooltip | null;
};

export const DeckGLOverlay = ({ layers, getTooltip }: IDeckGLOverlay) => {
  const deck = useMemo(
    () =>
      new GoogleMapsOverlay({
        interleaved: true,
      }),
    [],
  );

  const map = useMap();
  useEffect(() => {
    deck.setMap(map);

    return () => deck.setMap(null);
  }, [deck, map]);

  useEffect(() => {
    deck.setProps({ layers, getTooltip });
  }, [deck, getTooltip, layers]);

  return null;
};
