import { useMapData } from "@/hooks/useMapData";

export function useSearch() {
  const { geoJsonData } = useMapData();

  const defaultOptions = {
    caseSensitive: false,
    searchFields: {
      name: true,
      type: true,
      detailsId: true,
      detailsTitle: true,
      detailsStreet: true,
      detailsDistrict: true,
    },
  };

  function processText(text: string): string {
    return defaultOptions.caseSensitive ? text : text.toLowerCase().trim();
  }

  function getSearch(searchTerm: string) {
    if (searchTerm === "") return;

    const processedTerm = defaultOptions.caseSensitive ? searchTerm : searchTerm.toLowerCase().trim();

    const result = geoJsonData?.features.filter((feature) => {
      const { properties } = feature;
      const { searchFields } = defaultOptions;

      if (searchFields.name && properties.name && processText(properties.name).includes(processedTerm)) return true;
      if (searchFields.type && properties.type && processText(properties.type).includes(processedTerm)) return true;

      const { details } = properties;

      if (searchFields.detailsId && details.id && processText(details.id).includes(processedTerm)) return true;
      if (searchFields.detailsTitle && details.title && processText(details.title).includes(processedTerm)) return true;
      if (searchFields.detailsStreet && details.street && processText(details.street).includes(processedTerm))
        return true;
      if (searchFields.detailsDistrict && details.district && processText(details.district).includes(processedTerm))
        return true;

      return false;
    });

    return result;
  }

  return { getSearch };
}
