import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Welcome.module.css'; 

import cartPath from '../../assets/logo/cart logo.svg'; 
import brandPath from '../../assets/logo/brand name.svg';

const Welcome = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => navigate('/home'), 3500);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className={styles.welcomeContainer}>
      <div className={styles.logoWrapper}>
        <img 
          src={cartPath} 
          className={styles.cartIcon} 
          alt="Cart Logo" 
        />
        <img 
          src={brandPath} 
          className={styles.brandNameSvg} 
          alt="Brand Name" 
        />
      </div>
    </div>
  );
};

export default Welcome;