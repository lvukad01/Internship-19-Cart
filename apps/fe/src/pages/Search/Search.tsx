import { useSearchParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { getProducts } from '../../api/products';
import styles from './Search.module.css';
import { FiHeart, FiSearch, FiChevronLeft } from 'react-icons/fi';

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const token = localStorage.getItem('token');
  const activeCategory = searchParams.get('category') || 'Sve';

  const { data: products = [] } = useQuery({
    queryKey: ['products', activeCategory],
    queryFn: () => getProducts(),
  });

  const { data: favorites = [] } = useQuery({
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

  const toggleFavoriteMutation = useMutation({
    mutationFn: async ({ productId, isFavorite }: { productId: number, isFavorite: boolean }) => {
      if (!token) {
        navigate('/profile');
        return;
      }
      if (isFavorite) {
        await axios.delete(`http://localhost:3000/api/favorites/product/${productId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await axios.post(`http://localhost:3000/api/favorites/${productId}`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
    },
  });

  const categories = ['Sve', 'Streetwear', 'Formal Wear', 'Footwear'];

  const filteredProducts = activeCategory === 'Sve' 
    ? products 
    : products.filter((p: any) => p.category.name === activeCategory);

  const handleFavorite = (e: React.MouseEvent, productId: number, isFavorite: boolean) => {
    e.stopPropagation();
    toggleFavoriteMutation.mutate({ productId, isFavorite });
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <FiChevronLeft size={24} onClick={() => navigate(-1)} style={{ cursor: 'pointer' }} />
        <div className={styles.searchBar}>
          <FiSearch className={styles.searchIcon} />
          <input type="text" placeholder="Search..." className={styles.searchInput} />
        </div>
      </header>

      <div className={styles.tabs}>
        {categories.map((cat) => (
          <button
            key={cat}
            className={activeCategory === cat ? styles.activeTab : styles.tab}
            onClick={() => setSearchParams({ category: cat })}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className={styles.productGrid}>
        {filteredProducts.map((product: any) => {
          const isFavorite = favorites.some((fav: any) => fav.productId === product.id);

          return (
            <div 
              key={product.id} 
              className={styles.productCard}
              onClick={() => navigate(`/product/${product.id}`)}
            >
              <div className={styles.imageContainer}>
                <div 
                  className={styles.wishlistIcon} 
                  onClick={(e) => handleFavorite(e, product.id, isFavorite)}
                >
                  <FiHeart 
                    fill={isFavorite ? "black" : "none"} 
                    stroke={isFavorite ? "black" : "currentColor"} 
                  />
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
                  {product.colors.map((c: string) => (
                    <span key={c} className={styles.colorDot} style={{ backgroundColor: c.toLowerCase() }}></span>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Search;