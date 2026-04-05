import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FiChevronLeft } from 'react-icons/fi';
import { useEffect, useState } from 'react';
import api from '../../api/axiosInstance';
import styles from './Checkout.module.css';

const Checkout = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const token = localStorage.getItem('token');
  const [cartItems, setCartItems] = useState<any[]>([]);

  const { data: userRes, isLoading: userLoading } = useQuery({
    queryKey: ['user-me'], 
    queryFn: async () => {
      const res = await api.get('/users/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      return res.data;
    },
    enabled: !!token
  });

  const userData = userRes?.data || userRes;

  useEffect(() => {
    const loadCart = () => {
      if (userData?.id) {
        const cartKey = `cart_${userData.id}`;
        const savedCart = localStorage.getItem(cartKey);
        if (savedCart) {
          setCartItems(JSON.parse(savedCart));
          return;
        }
      }

      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('cart_')) {
          const savedCart = localStorage.getItem(key);
          if (savedCart) {
            setCartItems(JSON.parse(savedCart));
            break;
          }
        }
      }
    };

    loadCart();
  }, [userData]);

  const subTotal = cartItems.reduce((acc: number, item: any) => acc + (Number(item.price) * Number(item.quantity)), 0);
  const deliveryPrice = 5.00;
  const totalPrice = subTotal + deliveryPrice;

  const orderMutation = useMutation({
    mutationFn: async () => {
      if (!userData) throw new Error('Korisnik nije učitan');

      const orderPayload = {
        customerName: userData.name,
        customerPhone: userData.phone || 'Nema telefona',
        shippingAddress: userData.address || 'Nema adrese',
        paymentMethod: 'CASH',
        deliveryMethod: 'Pošta',
        subTotal: Number(subTotal),
        deliveryPrice: Number(deliveryPrice),
        totalPrice: Number(totalPrice),
        isCompleted: false,
        status: 'PENDING',
        items: cartItems.map((item: any) => ({
          productId: Number(item.productId),
          quantity: Number(item.quantity),
          price: Number(item.price)
        }))
      };

      const response = await api.post('/orders', orderPayload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      for (const item of cartItems) {
        const prodRes = await api.get(`/products/${item.productId}`);
        const currentProduct = prodRes.data.data || prodRes.data;
        
        const currentStock = Number(currentProduct.stock);
        const quantityOrdered = Number(item.quantity);
        const newStock = Math.max(0, currentStock - quantityOrdered);

        await api.patch(`/products/${item.productId}`, {
          stock: newStock
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }

      return response;
    },
    onSuccess: () => {
      alert('Narudžba uspješno poslana!');
      const cartKey = `cart_${userData?.id}`;
      localStorage.removeItem(cartKey);
      
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      
      navigate('/');
    },
    onError: (error: any) => {
      console.error("Greška pri narudžbi:", error);
      alert("Došlo je do greške prilikom slanja narudžbe.");
    }
  });

  if (userLoading) return <div className={styles.loader}>Učitavanje...</div>;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <button onClick={() => navigate(-1)} className={styles.backBtn}>
          <FiChevronLeft size={24} />
        </button>
        <h1 className={styles.pageTitle}>BLAGAJNA</h1>
        <div style={{ width: 24 }}></div>
      </header>

      <section className={styles.section}>
        <div className={styles.addressBox}>
          <h3>Adresa dostave</h3>
          <p><strong>{userData?.name}</strong></p>
          <p>{userData?.address}</p>
          <p>{userData?.phone}</p>
        </div>
      </section>

      <div className={styles.orderSummary}>
        {cartItems.length > 0 ? (
          cartItems.map((item: any, idx: number) => (
            <div key={idx} className={styles.summaryItem}>
              <span>{item.name} x {item.quantity}</span>
              <span>{(item.price * item.quantity).toFixed(2)} $</span>
            </div>
          ))
        ) : (
          <p className={styles.emptyCart}>Nema proizvoda u košarici.</p>
        )}
      </div>

      <footer className={styles.footer}>
        <div className={styles.totalRow}>
          <span>Ukupno:</span>
          <strong>{totalPrice.toFixed(2)} $</strong>
        </div>
        <button 
          className={styles.confirmBtn} 
          onClick={() => orderMutation.mutate()}
          disabled={orderMutation.isPending || cartItems.length === 0}
        >
          {orderMutation.isPending ? 'OBRADA...' : 'POTVRDI NARUDŽBU'}
        </button>
      </footer>
    </div>
  );
};

export default Checkout;