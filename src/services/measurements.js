import apiClient from "./apiClient";

export const fetchMeasurements = async () => {
  const response = await apiClient.get("/measurements");
  return response.data;
};
