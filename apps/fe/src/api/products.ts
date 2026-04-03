import api from './axiosInstance'; 


export interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  category: string;
}

export const getProducts = async (params?: any) => {
  const { data } = await api.get('/products', { params });
  return data.data; 
};
    
export const getProductById = async (id: string) => {
  const { data } = await api.get(`/products/${id}`);
  return data.data;
};