import axios from 'axios';
import { getTokens, saveTokens, clearTokens, Tokens } from './storage';

const CLOUD_URL = 'https://votre-vps.exemple.com:8000/api';

const instance = axios.create({
  baseURL: CLOUD_URL,
  timeout: 8000,
});

instance.interceptors.request.use(
  async (config) => {
    const tokens = await getTokens();
    if (tokens?.access) {
      config.headers.Authorization = `Bearer ${tokens.access}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      const tokens = await getTokens();
      if (tokens?.refresh) {
        try {
          const response = await axios.post(
            `${CLOUD_URL}/auth/refresh`,
            {},
            {
              headers: { Authorization: `Bearer ${tokens.refresh}` },
            }
          );
          
          const newTokens: Tokens = {
            access: response.data.access_token,
            refresh: tokens.refresh,
          };
          
          await saveTokens(newTokens);
          originalRequest.headers.Authorization = `Bearer ${newTokens.access}`;
          return axios(originalRequest);
        } catch (refreshError) {
          await clearTokens();
          return Promise.reject(refreshError);
        }
      }
    }
    
    return Promise.reject(error);
  }
);

export const loginAdmin = async (email: string, motDePasse: string) => {
  const response = await instance.post('/auth/login', { email, mot_de_passe: motDePasse });
  await saveTokens({ access: response.data.access_token, refresh: response.data.refresh_token });
  return response.data;
};

export const getDevices = async () => {
  const response = await instance.get('/devices');
  return response.data;
};

export const addDevice = async (deviceId: string, nom: string) => {
  const response = await instance.post('/devices', { device_id: deviceId, nom });
  return response.data;
};

export const getDrivers = async (deviceId?: string) => {
  const url = deviceId ? `/drivers?device_id=${deviceId}` : '/drivers';
  const response = await instance.get(url);
  return response.data;
};

export const addDriver = async (driver: any) => {
  const response = await instance.post('/drivers', driver);
  return response.data;
};

export default instance;