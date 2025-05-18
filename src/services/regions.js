import apiClient from "./apiClient";

export const fetchCountyByRegionId = async (regionId) => {
  const response = await apiClient.get(`/region/${regionId}/county`);
  return response.data;
};
