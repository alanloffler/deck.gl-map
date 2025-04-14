export interface IGeoJsonData {
  geometry: {
    type: string;
    coordinates: [number, number][][];
  };
  properties: {
    name: string;
    color: string;
  };
  type: string;
}
