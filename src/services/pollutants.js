import apiClient from "./apiClient";

export const fetchPollutantById = async (id) => {
  const response = await apiClient.get(`/pollutants/${id}`);
  return response.data;
};

export const fetchAllPollutants = async () => {
  const response = await apiClient.get("/pollutants");
  return response.data;
};
