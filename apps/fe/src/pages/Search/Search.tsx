import { useSearchParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, useMemo } from 'react';
import axios from 'axios';
import { FiHeart, FiSearch, FiChevronLeft } from 'react-icons/fi';
import styles from './Search.module.css';

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const token = localStorage.getItem('token');
  
  const activeCategory = searchParams.get('category') || 'Sve';
  const [searchTerm, setSearchTerm] = useState('');

  // 1. Dohvaćanje proizvoda
  const { data: productsRes } = useQuery({
    queryKey: ['products', 'search'],
    queryFn: async () => {
      const response = await axios.get('http://localhost:3000/api/products?limit=100');
      return response.data;
    },
  });

  // 2. Dohvaćanje kategorija
  const { data: categoriesRes } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await axios.get('http://localhost:3000/api/categories');
      return response.data;
    },
  });

  // 3. Dohvaćanje favorita
  const { data: favoritesRes } = useQuery({
    queryKey: ['favorites'],
    queryFn: async () => {
      if (!token) return [];
      const response = await axios.get('http://localhost:3000/api/favorites', {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    },
    enabled: !!token,
  });

  // Sigurno izvlačenje podataka iz API odgovora
  const products = useMemo(() => productsRes?.data || (Array.isArray(productsRes) ? productsRes : []), [productsRes]);
  const categories = useMemo(() => categoriesRes?.data || (Array.isArray(categoriesRes) ? categoriesRes : []), [categoriesRes]);
  const favorites = useMemo(() => {
    const data = favoritesRes?.data || (Array.isArray(favoritesRes) ? favoritesRes : []);
    return Array.isArray(data) ? data : [];
  }, [favoritesRes]);

  const categoryNames = useMemo(() => ['Sve', ...categories.map((c: any) => c.name)], [categories]);

  const toggleFavoriteMutation = useMutation({
    mutationFn: async ({ productId, isFavorite }: { productId: number, isFavorite: boolean }) => {
      if (!token) return navigate('/profile');
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
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['favorites'] }),
  });

  const filteredProducts = useMemo(() => {
    return products.filter((p: any) => {
      const pCatName = p.category?.name || p.category;
      const categoryMatch = activeCategory === 'Sve' || 
        String(pCatName).toLowerCase().trim() === String(activeCategory).toLowerCase().trim();
      const searchMatch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
      return categoryMatch && searchMatch;
    });
  }, [products, activeCategory, searchTerm]);

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
            const isFavorite = favorites.some((fav: any) => Number(fav.productId) === Number(product.id));
            const img = product.images?.[0];
            const displayImage = img?.startsWith('http') ? img : `http://localhost:3000${img}`;

            return (
              <div key={product.id} className={styles.productCard} onClick={() => navigate(`/product/${product.id}`)}>
                <div className={styles.imageContainer}>
                  <div 
                    className={styles.wishlistIcon} 
                    onClick={(e) => { 
                      e.stopPropagation(); 
                      toggleFavoriteMutation.mutate({ productId: product.id, isFavorite }); 
                    }}
                  >
                    <FiHeart 
                      fill={isFavorite ? "black" : "none"} 
                      stroke={isFavorite ? "black" : "currentColor"} 
                    />
                  </div>
                  <img src={displayImage} alt={product.name} />
                </div>
                <div className={styles.details}>
                  <h4 className={styles.brandName}>{product.name.split(' ')[0]}</h4> 
                  <p className={styles.productName}>{product.name}</p>
                  <span className={styles.price}>{Number(product.price).toFixed(2)} $</span>
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