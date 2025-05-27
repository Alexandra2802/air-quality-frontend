import apiClient from "./apiClient";

export const fetchImpactHeatmap = async (pollutantId, from, to) => {
  const response = await apiClient.get(`/impact-heatmap/${pollutantId}`, {
    params: { from, to },
  });
  return response.data; 
};
