export interface IDetails {
  color?: string;
  distance?: number;
  name?: string;
  details?: {
    district?: string;
    id?: string;
    street?: string;
  };
  type?: "connection" | "marker" | "network";
}
