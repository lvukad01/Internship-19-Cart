import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { FiChevronLeft, FiTrash2, FiMinus, FiPlus } from 'react-icons/fi';
import styles from './Cart.module.css';

const Cart = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState<any[]>([]);
  const token = localStorage.getItem('token');

  const { data: user, isLoading: userLoading } = useQuery({
    queryKey: ['user-me'],
    queryFn: async () => {
      const res = await axios.get('http://localhost:3000/api/users/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      return res.data;
    },
    enabled: !!token
  });

  useEffect(() => {
    if (!token) {
      navigate('/profile');
      return;
    }

    if (user) {
      const cartKey = `cart_${user.id}`;
      const savedCart = JSON.parse(localStorage.getItem(cartKey) || '[]');
      setCartItems(savedCart);
    }
  }, [user, token, navigate]);

  const updateQuantity = (cartId: number, delta: number) => {
    if (!user) return;
    const cartKey = `cart_${user.id}`;
    const updated = cartItems.map(item => {
      if (item.cartId === cartId) {
        return { ...item, quantity: Math.max(1, item.quantity + delta) };
      }
      return item;
    });
    setCartItems(updated);
    localStorage.setItem(cartKey, JSON.stringify(updated));
  };

  const removeItem = (cartId: number) => {
    if (!user) return;
    const cartKey = `cart_${user.id}`;
    const filtered = cartItems.filter(item => item.cartId !== cartId);
    setCartItems(filtered);
    localStorage.setItem(cartKey, JSON.stringify(filtered));
  };

  if (userLoading) return <div>Učitavanje...</div>;

  const subTotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const delivery = cartItems.length > 0 ? 5.00 : 0;
  const total = subTotal + delivery;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <button onClick={() => navigate(-1)} className={styles.backBtn}><FiChevronLeft size={24} /></button>
        <h1>MOJA KOŠARICA</h1>
        <div style={{ width: 24 }}></div>
      </header>

      <div className={styles.itemList}>
        {cartItems.length === 0 ? (
          <p className={styles.emptyMsg}>Vaša košarica je prazna.</p>
        ) : (
          cartItems.map((item) => (
            <div key={item.cartId} className={styles.cartCard}>
              <img src={item.image.startsWith('http') ? item.image : `http://localhost:3000${item.image}`} className={styles.productImg} />
              <div className={styles.details}>
                <div className={styles.row}>
                  <h3>{item.name.toUpperCase()}</h3>
                  <button onClick={() => removeItem(item.cartId)} className={styles.removeBtn}><FiTrash2 size={18} /></button>
                </div>
                <p className={styles.sizeLabel}>Veličina: <strong>{item.size}</strong></p>
                <div className={styles.priceRow}>
                  <span className={styles.price}>{(item.price * item.quantity).toFixed(2)} $</span>
                  <div className={styles.qtyControls}>
                    <button onClick={() => updateQuantity(item.cartId, -1)}><FiMinus /></button>
                    <span>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.cartId, 1)}><FiPlus /></button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {cartItems.length > 0 && (
        <footer className={styles.footer}>
          <div className={styles.summaryRow}><span>Podtotal:</span><span>{subTotal.toFixed(2)} $</span></div>
          <div className={styles.summaryRow}><span>Dostava:</span><span>{delivery.toFixed(2)} $</span></div>
          <div className={`${styles.summaryRow} ${styles.total}`}><span>UKUPNO:</span><span>{total.toFixed(2)} $</span></div>
          <button className={styles.checkoutBtn} onClick={() => navigate('/checkout')}>NA BLAGAJNU</button>
        </footer>
      )}
    </div>
  );
};

export default Cart;