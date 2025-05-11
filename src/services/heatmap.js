import apiClient from "./apiClient";

export const fetchHeatmapData = async (pollutantId, from, to) => {
  const response = await apiClient.get(`/heatmap/${pollutantId}`, {
    params: { from, to },
  });
  return response.data;
};
