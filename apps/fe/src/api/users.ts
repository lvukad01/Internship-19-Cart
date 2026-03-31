import api from './axiosInstance';

export const getMe = async () => {
  const { data } = await api.get('/users/me');
  return data.data; 
};