import axios from 'axios';

const API_URL = '/api/workcenters';

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

export const getAllWorkCenters = async () => {
  try {
    const response = await axiosInstance.get('/');
    return response.data;
  } catch (error) {
    console.error('Error fetching work centers:', error);
    throw error;
  }
};

export const getWorkCenterById = async (id) => {
  try {
    const response = await axiosInstance.get(`/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching work center:', error);
    throw error;
  }
};

export const createWorkCenter = async (workCenterData) => {
  try {
    const response = await axiosInstance.post('/', workCenterData);
    return response.data;
  } catch (error) {
    console.error('Error creating work center:', error);
    throw error;
  }
};

export const updateWorkCenter = async (id, workCenterData) => {
  try {
    const response = await axiosInstance.put(`/${id}`, workCenterData);
    return response.data;
  } catch (error) {
    console.error('Error updating work center:', error);
    throw error;
  }
};

export const deleteWorkCenter = async (id) => {
  try {
    const response = await axiosInstance.delete(`/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting work center:', error);
    throw error;
  }
};

