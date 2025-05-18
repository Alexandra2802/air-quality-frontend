import apiClient from "./apiClient";

export const fetchAnimatedCentroid = async (pollutantId, from, to) => {
  const response = await apiClient.get(`/animated-centroid/${pollutantId}`, {
    params: {
      from,
      to
    }
  });
  return response.data; 
};
