import { useSearchParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, useMemo } from 'react';
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
  const [searchTerm, setSearchTerm] = useState('');

  const { data: products = [] } = useQuery({
    queryKey: ['products'],
    queryFn: () => getProducts(),
  });

  const { data: categoriesData = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await axios.get('http://localhost:3000/api/categories');
      return Array.isArray(response.data) ? response.data : (response.data.data || []);
    },
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

  const categoryNames = useMemo(() => ['Sve', ...categoriesData.map((c: any) => c.name)], [categoriesData]);

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

  const filteredProducts = useMemo(() => {
    return products.filter((p: any) => {
      const categoryMatch = activeCategory === 'Sve' || 
        (typeof p.category === 'object' ? p.category.name === activeCategory : p.category === activeCategory);
      
      const searchMatch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        (p.brand && p.brand.toLowerCase().includes(searchTerm.toLowerCase()));

      return categoryMatch && searchMatch;
    });
  }, [products, activeCategory, searchTerm]);

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
          <input 
            type="text" 
            placeholder="Pretraži proizvode..." 
            className={styles.searchInput}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </header>

      <div className={styles.tabs}>
        {categoryNames.map((cat) => (
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
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product: any) => {
            const isFavorite = favorites.some((fav: any) => fav.productId === product.id);
            const displayImage = product.images?.[0]?.startsWith('http') 
              ? product.images[0] 
              : `http://localhost:3000${product.images?.[0]}`;

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
                  <img src={displayImage} alt={product.name} />
                </div>
                <div className={styles.details}>
                  <h4 className={styles.brandName}>{product.brand || product.name.split(' ')[0]}</h4> 
                  <p className={styles.productName}>{product.name}</p>
                  <span className={styles.price}>{product.price.toFixed(2)} $</span>
                  <div className={styles.colors}>
                    {product.colors?.map((c: string) => (
                      <span key={c} className={styles.colorDot} style={{ backgroundColor: c.toLowerCase() }}></span>
                    ))}
                  </div>
                </div>
              </div>
            )
          })
        ) : (
          <div className={styles.noResults}>Nema pronađenih proizvoda.</div>
        )}
      </div>
    </div>
  );
};

export default Search;