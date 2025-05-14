import apiClient from "./apiClient";

export const fetchCentroidByPollutantId = async (id, fromDate, toDate) => {
  const response = await apiClient.get(`/measurements/stats/centroid/${id}`, {
    params: {
      from: fromDate,
      to: toDate,
    },
  });
  return response.data;
};
