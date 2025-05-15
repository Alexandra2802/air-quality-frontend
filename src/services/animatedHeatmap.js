import apiClient from "./apiClient";

export const fetchAnimatedHeatmap = async (pollutantId, from, to) => {
  const response = await apiClient.get(`/animated-heatmap/${pollutantId}`, {
    params: { from, to },
  });
  return response.data;
};
