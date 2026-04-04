import React, { useState, useEffect } from 'react';
import styles from './Profile.module.css';

import userLogo from '../../assets/logo/user.svg';
import shoppingCartLogo from '../../assets/logo/cart logo.svg';

export const Profile = () => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [county, setCounty] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const response = await fetch('http://localhost:3000/api/users/me', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const result = await response.json();
          const user = result.data || result;
          setUserData(user);
          setIsLoggedIn(true);
          localStorage.setItem('user', JSON.stringify(user));
        } else {
          handleLogout();
        }
      } catch (err) {
        console.error("Greška pri dohvaćanju profila:", err);
      }
    };

    fetchUserData();
  }, []);

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    const endpoint = isRegistering ? '/api/auth/register' : '/api/auth/login';
    
    const payload = isRegistering 
      ? { email, password, name, address, phone } 
      : { email, password };

    try {
      const response = await fetch(`http://localhost:3000${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (response.ok) {
        if (isRegistering) {
          setSuccessMessage('Registracija uspješna! Molimo prijavite se.');
          setIsRegistering(false);
          setPassword('');
        } else {
          const data = result.data || result;
          const token = data.token;
          const user = data.user;

          if (token && user) {
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            setUserData(user);
            setIsLoggedIn(true);
          } else {
            setError("Server nije vratio podatke o korisniku.");
          }
        }
      } else {
        setError(result.message || 'Akcija neuspješna. Provjerite podatke.');
      }
    } catch (err) {
      setError('Server nije dostupan.');
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
            <h1 className={styles.headerTitle}>PROFIL</h1>
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
              <p><strong>TELEFON:</strong> {userData.phone || 'Nije uneseno'}</p>
              <p><strong>EMAIL:</strong> {userData.email}</p>
              <p><strong>ŽUPANIJA:</strong> {userData.county || 'Nije uneseno'}</p>
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
              <p><strong>CVV KOD:</strong> ***</p>
            </div>
          </div>
        </div>

        <button onClick={handleLogout} className={styles.logoutBtn}>ODJAVA</button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.loginCard}>
        <h2>{isRegistering ? 'Kreiraj račun' : 'Dobrodošli natrag'}</h2>
        <p>{isRegistering ? 'Popunite podatke za registraciju' : 'Prijavite se za nastavak'}</p>
        
        {error && <p className={styles.errorText}>{error}</p>}
        {successMessage && <p className={styles.successMessage}>{successMessage}</p>}
        
        <form onSubmit={handleSubmit} className={styles.form}>
          {isRegistering && (
            <div className={styles.inputGroup}>
              <label>Ime i prezime</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
          )}

          <div className={styles.inputGroup}>
            <label>Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>

          <div className={styles.inputGroup}>
            <label>Lozinka</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>

          {isRegistering && (
            <>
              <div className={styles.inputGroup}>
                <label>Adresa</label>
                <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} required />
              </div>
              <div className={styles.inputGroup}>
                <label>Telefon</label>
                <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} required />
              </div>
              <div className={styles.inputGroup}>
                <label>Županija</label>
                <input type="text" value={county} onChange={(e) => setCounty(e.target.value)} required />
              </div>
            </>
          )}

          <button type="submit" className={styles.loginBtn}>
            {isRegistering ? 'Registriraj se' : 'Prijavi se'}
          </button>
        </form>
        
        <div className={styles.footer}>
          {isRegistering ? 'Već imate račun?' : "Nemate račun?"}
          <span onClick={() => { setIsRegistering(!isRegistering); setError(''); }}>
            {isRegistering ? ' Prijavi se' : ' Registriraj se'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Profile;