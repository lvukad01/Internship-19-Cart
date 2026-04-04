import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getProductById } from '../../api/products'; 
import api from '../../api/axiosInstance';
import styles from './Product.module.css';
import { FiX, FiHeart } from 'react-icons/fi';
import { useState } from 'react';

const Product = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  const { data: product, isLoading } = useQuery({
    queryKey: ['product', id],
    queryFn: () => getProductById(Number(id)),
  });

  const favoriteMutation = useMutation({
    mutationFn: async () => {
      const token = localStorage.getItem('token');
      
      if (product?.isFavorite) {
        return await api.delete(`/favorites/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        return await api.post(`/favorites/${id}`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['product', id] });
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
    },
    onError: (error: any) => {
      console.error("Greška s favoritima:", error.response?.data);
    }
  });

  const handleAddToCart = () => {
    if (!product) return;
    
    if (!selectedSize) {
      alert('Molimo odaberite veličinu!');
      return;
    }

    const existingCart = JSON.parse(localStorage.getItem('cart') || '[]');

    const newCartItem = {
      cartId: Date.now(), 
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      size: selectedSize,
      quantity: 1
    };

    const updatedCart = [...existingCart, newCartItem];
    localStorage.setItem('cart', JSON.stringify(updatedCart));

    alert('Proizvod dodan u košaricu!');
  };

  if (isLoading || !product) return null;

  const isFavorite = product.isFavorite; 

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <button className={styles.closeBtn} onClick={() => navigate(-1)}>
          <FiX size={24} />
        </button>

        <div className={styles.imageSection}>
          <img 
            src={product.images[0].startsWith('http') ? product.images[0] : `http://localhost:3000${product.images[0]}`} 
            alt={product.name} 
          />
        </div>

        <div className={styles.content}>
          <div className={styles.header}>
            <h2 className={styles.title}>{product.name.toUpperCase()}</h2>
            <span className={styles.price}>{product.price.toFixed(2)} $</span>
          </div>

          <div className={styles.sizeSection}>
            <p className={styles.sectionLabel}>Izaberi veličinu:</p>
            <div className={styles.sizeGrid}>
              {product.sizes.map((size: string) => (
                <button
                  key={size}
                  className={`${styles.sizeBtn} ${selectedSize === size ? styles.selectedSize : ''}`}
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.actions}>
            <button 
              className={styles.addToCartBtn}
              onClick={handleAddToCart}
            >
              DODAJ U KOŠARICU
            </button>
            <button 
              className={styles.favBtn}
              onClick={() => favoriteMutation.mutate()}
              disabled={favoriteMutation.isPending}
            >
              <FiHeart 
                size={24} 
                fill={isFavorite ? "black" : "none"} 
                stroke={isFavorite ? "black" : "currentColor"} 
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Product;