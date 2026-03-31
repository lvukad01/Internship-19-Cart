import api from './axiosInstance';

export const login = async (credentials: any) => {
  const { data } = await api.post('/auth/login', credentials);
  localStorage.setItem('token', data.data.accessToken); 
  return data.data;
};