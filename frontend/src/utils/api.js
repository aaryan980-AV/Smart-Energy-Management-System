import axios from 'axios';

const API_BASE_URL = '/api';

export const fetchHeatRiskData = async () => {
  const response = await axios.get(`${API_BASE_URL}/heat-risk`);
  return response.data;
};

export const fetchEnergyForecast = async () => {
  const response = await axios.get(`${API_BASE_URL}/energy-forecast`);
  return response.data;
};

export const fetchSustainabilityData = async () => {
  const response = await axios.get(`${API_BASE_URL}/sustainability`);
  return response.data;
};

export const fetchAdminRecommendations = async () => {
  const response = await axios.get(`${API_BASE_URL}/admin/recommendations`);
  return response.data;
};

export const fetchEnergyMix = async () => {
  const response = await axios.get(`${API_BASE_URL}/energy-mix`);
  return response.data;
};

export const fetchWardEnergy = async () => {
  const response = await axios.get(`${API_BASE_URL}/ward-energy`);
  return response.data;
};
