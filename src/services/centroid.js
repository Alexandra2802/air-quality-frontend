import apiClient from "./apiClient";

export const fetchCentroidByPollutantId = async (id) => {
  const response = await apiClient.get(`/measurements/stats/centroid/${id}`, {
    params: {
      from: "2024-01-01",
      to: "2025-04-01",
    },
  });
  return response.data;
};
