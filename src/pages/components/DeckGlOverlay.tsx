import { GoogleMapsOverlay } from "@deck.gl/google-maps";
import { type LayersList } from "deck.gl";
import { useEffect, useMemo } from "react";
import { useMap } from "@vis.gl/react-google-maps";

export type DeckglOverlayProps = { layers?: LayersList };

export const DeckGlOverlay = ({ layers }: DeckglOverlayProps) => {
  const deck = useMemo(() => new GoogleMapsOverlay({ interleaved: true }), []);

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
