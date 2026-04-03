import React, { useState, useEffect } from 'react';
import styles from './Profile.module.css';

import userLogo from '../../assets/logo/user.svg';
import shoppingCartLogo from '../../assets/logo/cart logo.svg';

export const Profile = () => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [error, setError] = useState('');
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    
    if (savedToken && savedUser && savedUser !== "undefined") {
      try {
        setUserData(JSON.parse(savedUser));
        setIsLoggedIn(true);
      } catch (e) {
        localStorage.clear();
      }
    }
  }, []);

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setError('');

    const endpoint = isRegistering ? '/api/auth/register' : '/api/auth/login';
    const payload = isRegistering ? { email, password, name } : { email, password };

    try {
      const response = await fetch(`http://localhost:3000${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (response.ok && result.data) {
        const token = result.data.token;
        const user = result.data.user;

        if (token && user) {
          localStorage.setItem('token', token);
          localStorage.setItem('user', JSON.stringify(user));
          
          setUserData(user);
          setIsLoggedIn(true);
        } else {
          setError("Server did not return user data.");
        }
      } else {
        setError(result.message || 'Login failed. Please check your credentials.');
      }
    } catch (err) {
      setError('Server is not available.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setUserData(null);
  };

  if (isLoggedIn && userData) {
    return (
      <div className={styles.profileContainer}>
        <header className={styles.profileHeader}>
          <div className={styles.headerLeft}>
            <img src={shoppingCartLogo} alt="Logo" className={styles.logoIcon} />
            <h1 className={styles.headerTitle}>PROFILE</h1>
          </div>
          <div className={styles.notificationIcon}>🔔</div>
        </header>

        <div className={styles.infoCard}>
          <div className={styles.infoRow}>
            <div className={styles.iconCircle}>
               <img src={userLogo} alt="User" style={{ transform: 'scale(1.7)', objectPosition: '50px -55px', objectFit: 'none' }} />
            </div>
            <div className={styles.textContainer}>
              <p><strong>IME:</strong> {userData.name || 'Nije uneseno'}</p>
              <p><strong>ADRESA:</strong> {userData.address || 'Nije uneseno'}</p>
              <p><strong>EMAIL:</strong> {userData.email}</p>
              <p><strong>ŽUPANIJA:</strong> {userData.county || 'Splitsko-dalmatinska'}</p>
            </div>
          </div>
          <hr className={styles.divider} />
          <div className={styles.infoRow}>
            <div className={styles.visaPlaceholder}>
               <span className={styles.visaText}>VISA</span>
            </div>
            <div className={styles.textContainer}>
              <p><strong>IBAN:</strong> {userData.iban || 'HR****************'}</p>
              <p><strong>DATUM ISTEKA:</strong> 12/28</p>
              <p><strong>ISCT KOD:</strong> ***</p>
            </div>
          </div>
        </div>

        <button onClick={handleLogout} className={styles.logoutBtn}>LOGOUT</button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.loginCard}>
        <h2>{isRegistering ? 'Create Account' : 'Welcome Back'}</h2>
        <p>{isRegistering ? 'Fill in your details' : 'Please sign in to continue'}</p>
        
        {error && <p className={styles.errorText}>{error}</p>}
        
        <form onSubmit={handleSubmit} className={styles.form}>
          {isRegistering && (
            <div className={styles.inputGroup}>
              <label>Name</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
          )}
          <div className={styles.inputGroup}>
            <label>Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className={styles.inputGroup}>
            <label>Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <button type="submit" className={styles.loginBtn}>
            {isRegistering ? 'Sign Up' : 'Sign In'}
          </button>
        </form>
        
        <div className={styles.footer}>
          {isRegistering ? 'Already have an account?' : "Don't have an account?"}
          <span onClick={() => { setIsRegistering(!isRegistering); setError(''); }}>
            {isRegistering ? ' Sign In' : ' Sign Up'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Profile;