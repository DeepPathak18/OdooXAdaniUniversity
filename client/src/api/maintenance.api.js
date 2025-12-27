import axios from 'axios';

const API_URL = '/api/requests';

// Function to get the JWT token from local storage
const getToken = () => {
  return localStorage.getItem('token');
};

// Create an axios instance with default headers
const axiosInstance = axios.create({
  baseURL: API_URL,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const getAllMaintenanceRequests = async () => {
  try {
    const response = await axiosInstance.get('/');
    return response.data;
  } catch (error) {
    console.error('Error fetching maintenance requests:', error);
    throw error;
  }
};

export const createMaintenanceRequest = async (requestData) => {
  try {
    const response = await axiosInstance.post('/', requestData);
    return response.data;
  } catch (error) {
    console.error('Error creating maintenance request:', error);
    throw error;
  }
};

export const getMaintenanceRequestById = async (id) => {
  try {
    const response = await axiosInstance.get(`/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching maintenance request by id:', error);
    throw error;
  }
};

export const updateMaintenanceRequest = async (id, requestData) => {
  try {
    const response = await axiosInstance.put(`/${id}`, requestData);
    return response.data;
  } catch (error) {
    console.error('Error updating maintenance request:', error);
    throw error;
  }
};

export const deleteMaintenanceRequest = async (id) => {
  try {
    const response = await axiosInstance.delete(`/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting maintenance request:', error);
    throw error;
  }
};
