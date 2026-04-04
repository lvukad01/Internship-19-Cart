import api from './axiosInstance'; 

export interface Product {
  id: number;  
  name: string;
  price: number;
  images: string[];    
  colors: string[];   
  sizes: string[];    
  stock: number;
  category: {        
    id: number;
    name: string;
  };
}

export const getProducts = async (params?: any) => {
  const { data } = await api.get('/products', { params });
  return data.data; 
};

export const getProductById = async (id: number) => {
  const { data } = await api.get(`/products/${id}`);
  return data.data;
};