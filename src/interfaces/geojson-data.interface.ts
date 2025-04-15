export interface IGeoJsonData {
  geometry: {
    type: string;
    coordinates: [number, number][][];
  };
  properties: {
    name: string;
    color: string;
    section: {
      district: string;
      id: string;
      street: string;
    };
  };
  type: string;
}
