import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getProductById } from '../../api/products'; 
import styles from './Product.module.css';
import { FiX, FiHeart } from 'react-icons/fi';
import { useState } from 'react';
import axios from 'axios';

const Product = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const token = localStorage.getItem('token');

  const { data: user } = useQuery({
    queryKey: ['user-me'],
    queryFn: async () => {
      const res = await axios.get('http://localhost:3000/api/users/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      return res.data;
    },
    enabled: !!token
  });

  const { data: product, isLoading } = useQuery({
    queryKey: ['product', id],
    queryFn: () => getProductById(Number(id)),
  });

  const { data: favorites = [] } = useQuery({
    queryKey: ['favorites'],
    queryFn: async () => {
      if (!token) return [];
      const response = await axios.get('http://localhost:3000/api/favorites', {
        headers: { Authorization: `Bearer ${token}` }
      });
      return Array.isArray(response.data) ? response.data : (response.data.data || []);
    },
    enabled: !!token,
  });

  const isFavorite = favorites.some((fav: any) => fav.productId === Number(id));

  const favoriteMutation = useMutation({
    mutationFn: async () => {
      if (!token) return navigate('/profile');
      if (isFavorite) {
        await axios.delete(`http://localhost:3000/api/favorites/product/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await axios.post(`http://localhost:3000/api/favorites/${id}`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['favorites'] })
  });

  const handleAddToCart = () => {
    if (!product) return;
    if (!selectedSize) return alert('Molimo odaberite veličinu!');
    if (!user) return alert('Morate biti ulogirani!');

    const cartKey = `cart_${user.id}`;
    const existingCart = JSON.parse(localStorage.getItem(cartKey) || '[]');
    
    const newCartItem = {
      cartId: Date.now(), 
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      size: selectedSize,
      quantity: 1
    };

    localStorage.setItem(cartKey, JSON.stringify([...existingCart, newCartItem]));
    alert('Proizvod dodan u košaricu!');
  };

  if (isLoading || !product) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <button className={styles.closeBtn} onClick={() => navigate(-1)}><FiX size={24} /></button>
        <div className={styles.imageSection}>
          <img src={product.images[0].startsWith('http') ? product.images[0] : `http://localhost:3000${product.images[0]}`} alt={product.name} />
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
            <button className={styles.addToCartBtn} onClick={handleAddToCart}>DODAJ U KOŠARICU</button>
            <button className={styles.favBtn} onClick={() => favoriteMutation.mutate()}>
              <FiHeart size={24} fill={isFavorite ? "black" : "none"} stroke={isFavorite ? "black" : "currentColor"} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Product;