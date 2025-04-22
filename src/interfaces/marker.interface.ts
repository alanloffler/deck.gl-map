export interface IMarker {
  color: string;
  coordinates: [number, number];
  details: {
    district: string;
    icon: string;
    id: string;
    street: string;
  };
  name: string;
  type: "connection" | "marker" | "network";
}
