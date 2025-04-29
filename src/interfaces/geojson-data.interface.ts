export interface IGeoJsonData {
  id?: number;
  color: string;
  details: {
    district: string;
    icon?: string;
    id: string;
    street: string;
    title: string;
  };
  name: string;
  type: "connection" | "marker" | "network" | "main-network" | "secondary-network";
}
