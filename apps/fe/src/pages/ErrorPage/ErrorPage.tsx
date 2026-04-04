import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './ErrorPage.module.css';

const ErrorPage = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        
        <h1 className={styles.title}>DOGODILA SE GREŠKA</h1>
        <p className={styles.description}>
          Nažalost, nismo uspjeli obraditi vašu narudžbu. 
          Moguće je da podaci na vašem profilu nisu potpuni.
        </p>

        <div className={styles.buttonGroup}>
          <button 
            onClick={() => navigate('/checkout')} 
            className={styles.retryBtn}
          >
            POKUŠAJ PONOVNO
          </button>
          
          <button 
            onClick={() => navigate('/profile')} 
            className={styles.profileBtn}
          >
            UREDI PROFIL
          </button>
        </div>

        <button 
          onClick={() => navigate('/')} 
          className={styles.backHome}
        >
          Vrati se na početnu
        </button>
      </div>
    </div>
  );
};

export default ErrorPage;