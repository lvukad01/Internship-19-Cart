import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { FiHeart, FiChevronLeft } from 'react-icons/fi';
import styles from './Favorites.module.css';

const Favorites = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token || token === 'undefined' || token === null) {
      navigate('/profile');
    }
  }, [token, navigate]);

  const { data: favorites = [], isLoading } = useQuery({
    queryKey: ['favorites'],
    queryFn: async () => {
      if (!token) return [];
      const response = await axios.get('http://localhost:3000/api/favorites', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const result = response.data;
      return Array.isArray(result) ? result : (result.data || []);
    },
    enabled: !!token,
  });

  const removeFavoriteMutation = useMutation({
    mutationFn: async (productId: number) => {
      await axios.delete(`http://localhost:3000/api/favorites/product/${productId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
    },
  });

  const handleRemoveFavorite = (e: React.MouseEvent, productId: number) => {
    e.stopPropagation();
    removeFavoriteMutation.mutate(productId);
  };

  if (isLoading) return <div className={styles.container}>Učitavanje favorita...</div>;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <FiChevronLeft size={24} onClick={() => navigate(-1)} style={{ cursor: 'pointer' }} />
        <h1>MOJI FAVORITI</h1>
      </header>

      <div className={styles.productGrid}>
        {favorites.length === 0 ? (
          <p className={styles.emptyMsg}>
            Nemate spremljenih proizvoda.
          </p>
        ) : (
          favorites.map((fav: any) => {
            const product = fav.product;
            if (!product) return null;

            return (
              <div 
                key={product.id} 
                className={styles.productCard}
                onClick={() => navigate(`/product/${product.id}`)}
              >
                <div className={styles.imageContainer}>
                  <div 
                    className={styles.wishlistIcon} 
                    onClick={(e) => handleRemoveFavorite(e, product.id)}
                  >
                    <FiHeart fill="black" stroke="black" />
                  </div>
                  <img 
                    src={product.images?.[0]?.startsWith('http') ? product.images[0] : `http://localhost:3000${product.images[0]}`} 
                    alt={product.name} 
                  />
                </div>
                <div className={styles.details}>
                  <h4 className={styles.brandName}>{product.name.split(' ')[0]}</h4> 
                  <p className={styles.productName}>{product.name}</p>
                  <span className={styles.price}>{product.price.toFixed(2)} $</span>
                  <div className={styles.colors}>
                    {product.colors?.map((c: string) => (
                      <span key={c} className={styles.colorDot} style={{ backgroundColor: c.toLowerCase() }}></span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Favorites;