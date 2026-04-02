import { useQuery } from '@tanstack/react-query';
import { getProducts, type Product } from '../../api/products';
import styles from './Home.module.css';
import cartLogo from '../../assets/logo/cart logo.svg';

import { useNavigate } from 'react-router-dom';
import { FiBell, FiSearch } from 'react-icons/fi';

const Home = () => {
  const navigate = useNavigate();

  const { data: productsData, isLoading, error } = useQuery({
    queryKey: ['products'],
    queryFn: () => getProducts(),
  });

  if (isLoading) return <div className={styles.loader}>Učitavam kategorije...</div>;
  if (error) return <div className={styles.error}>Greška pri učitavanju.</div>;

  const products = Array.isArray(productsData) ? productsData : (productsData as any)?.data || [];

  const categoriesMap = products.reduce((acc: Record<string, Product>, product: Product) => {
    const categoryName = typeof product.category === 'object' 
      ? (product.category as any).name 
      : product.category;

    if (!acc[categoryName]) {
      acc[categoryName] = product;
    }
    return acc;
  }, {} as Record<string, Product>);

const categoryList: Product[] = Object.values(categoriesMap);
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
        <div className={styles.notification}>
          <FiBell size={24} />
          <span className={styles.badge}></span>
        </div>
      </header>

      <div className={styles.searchContainer}>
        <FiSearch className={styles.searchIcon} />
        <input type="text" placeholder="Pretraži kategorije..." className={styles.searchInput} />
      </div>

      <div className={styles.grid}>
        {categoryList.map((categoryProduct: Product, index: number) => {
          const { size, color } = getCardStyle(index);
          const categoryName = typeof categoryProduct.category === 'object' 
            ? (categoryProduct.category as any).name 
            : categoryProduct.category;

          return (
            <div 
              key={categoryName} 
              className={`${styles.card} ${size} ${color}`}
              onClick={() => navigate(`/category/${categoryName}`)}
            >
              <img 
                src={
                  categoryProduct.imageUrl
                    ? categoryProduct.imageUrl.startsWith('http') 
                      ? categoryProduct.imageUrl 
                      : `http://localhost:3000${categoryProduct.imageUrl}`
                    : 'https://placehold.co/150'
                } 
                alt={categoryName} 
              />
              
              <div className={styles.cardInfo}>
                <h3 className={styles.categoryTitle}>{categoryName}</h3>
                <p>Istraži kolekciju</p>
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