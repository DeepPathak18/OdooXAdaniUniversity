import axios from 'axios';

const API_URL = '/api/equipment';

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

export const getAllEquipment = async () => {
  try {
    const response = await axiosInstance.get('/');
    return response.data;
  } catch (error) {
    console.error('Error fetching equipment:', error);
    throw error;
  }
};

export const getEquipmentById = async (id) => {
  try {
    const response = await axiosInstance.get(`/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching equipment:', error);
    throw error;
  }
};

export const createEquipment = async (equipmentData) => {
  try {
    const response = await axiosInstance.post('/', equipmentData);
    return response.data;
  } catch (error) {
    console.error('Error creating equipment:', error);
    throw error;
  }
};

export const updateEquipment = async (id, equipmentData) => {
  try {
    const response = await axiosInstance.put(`/${id}`, equipmentData);
    return response.data;
  } catch (error) {
    console.error('Error updating equipment:', error);
    throw error;
  }
};

export const deleteEquipment = async (id) => {
  try {
    const response = await axiosInstance.delete(`/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting equipment:', error);
    throw error;
  }
};
