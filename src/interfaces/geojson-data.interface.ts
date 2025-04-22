export interface IGeoJsonData {
  color: string;
  details: {
    district: string;
    id: string;
    street: string;
  };
  name: string;
  type:
    | "connection"
    | "marker"
    | "network"
    | "main-network"
    | "secondary-network";
}
