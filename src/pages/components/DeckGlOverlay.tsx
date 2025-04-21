import { GoogleMapsOverlay } from "@deck.gl/google-maps";
import { DeckProps } from "deck.gl";
import { useEffect, useMemo } from "react";
import { useMap } from "@vis.gl/react-google-maps";

export const DeckGLOverlay = ({ layers, getTooltip }: DeckProps) => {
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
