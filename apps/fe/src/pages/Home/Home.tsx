import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FiBell, FiSearch } from 'react-icons/fi';
import cartLogo from '../../assets/logo/cart logo.svg';
import brandLogo from '../../assets/logo/brand name.svg';
import styles from './Home.module.css';

const Home = () => {
  const navigate = useNavigate();

  const { data: productsRes } = useQuery({
    queryKey: ['products', 'home'],
    queryFn: async () => {
      const response = await axios.get('http://localhost:3000/api/products?limit=100');
      return response.data;
    },
  });

  const { data: categoriesRes } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await axios.get('http://localhost:3000/api/categories');
      return response.data;
    },
  });

  const products = productsRes?.data || [];
  const categories = categoriesRes?.data || (Array.isArray(categoriesRes) ? categoriesRes : []);

  const getCardStyle = (index: number) => {
    const stylesList = [
      { size: styles.cardSmall, color: styles.orange },
      { size: styles.cardLarge, color: styles.gray },
      { size: styles.cardMedium, color: styles.brown },
    ];
    return stylesList[index % stylesList.length];
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <img src={cartLogo} className={styles.logo} alt="Cart" />
        <img src={brandLogo} className={styles.brand} alt="Brand" />
        <div className={styles.notification}>
          <FiBell size={24} />
          <span className={styles.badge}></span>
        </div>
      </header>

      <div className={styles.searchContainer} onClick={() => navigate('/search')}>
        <FiSearch className={styles.searchIcon} />
        <input type="text" placeholder="Search..." className={styles.searchInput} readOnly />
      </div>

      <div className={styles.grid}>
        {categories.map((category: any, index: number) => {
          const { size, color } = getCardStyle(index);
          const sampleProduct = products.find((p: any) => 
            (p.category?.name || p.category) === category.name
          );

          const displayImage = sampleProduct?.images?.[0]
            ? (sampleProduct.images[0].startsWith('http') ? sampleProduct.images[0] : `http://localhost:3000${sampleProduct.images[0]}`)
            : 'https://placehold.co/400x600?text=' + category.name;

          return (
            <div 
              key={category.id} 
              className={`${styles.card} ${size} ${color}`}
              onClick={() => navigate(`/search?category=${encodeURIComponent(category.name)}`)}
            >
              <div className={styles.imageWrapper}>
                <img src={displayImage} alt={category.name} />
              </div>
              
              <div className={styles.cardInfo}>
                <h3 className={styles.categoryTitle}>{category.name}</h3>
                <p>Explore collection</p>
              </div>
              <span className={styles.arrow}>&gt;</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Home;