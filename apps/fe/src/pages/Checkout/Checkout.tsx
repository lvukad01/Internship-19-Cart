import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FiTruck, FiMapPin, FiChevronLeft } from 'react-icons/fi';
import api from '../../api/axiosInstance';
import styles from './Checkout.module.css';

const Checkout = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const token = localStorage.getItem('token');

  const { data: userData, isLoading } = useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => {
      if (!token) return null;
      const response = await api.get('/users/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data.data || response.data;
    }
  });

  const cartKey = userData?.id ? `cart_${userData.id}` : 'cart';
  const cartItems = JSON.parse(localStorage.getItem(cartKey) || '[]');
  
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

      return await api.post('/orders', orderPayload, {
        headers: { Authorization: `Bearer ${token}` }
      });
    },
    onSuccess: () => {
      alert('Narudžba uspješno poslana!');
      localStorage.removeItem(cartKey);
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      navigate('/');
    },
    onError: (error: any) => {
      alert(error.response?.data?.message || 'Greška pri slanju narudžbe');
    }
  });

  if (isLoading) return <div className={styles.loader}>Učitavanje...</div>;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <button onClick={() => navigate(-1)} className={styles.backBtn}>
          <FiChevronLeft size={24} />
        </button>
        <h1 className={styles.pageTitle}>Blagajna</h1>
        <div style={{ width: 24 }}></div>
      </header>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>ADRESA DOSTAVE</h2>
          <FiTruck size={20} />
        </div>
        
        <div className={styles.addressBox}>
          <div className={styles.addressInfo}>
            <div className={styles.addressTitleGroup}>
              <h3>Poštanska adresa</h3>
              <p className={styles.userNameInCard}>{userData?.name}</p>
            </div>
            <button className={styles.changeBtn}>PROMIJENI</button>
          </div>
          <div className={styles.details}>
            <p>{userData?.address}</p>
            <p>{userData?.email}</p>
            <p>{userData?.phone}</p>
          </div>
        </div>
      </section>

      <div className={styles.parcelOption}>
        <FiMapPin size={20} />
        <span>POKUPI NA PAKETOMATU</span>
      </div>

      <hr className={styles.divider} />

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>ADRESA NAPLATE</h2>
          <FiTruck size={20} />
        </div>
        
        <div className={styles.addressBox}>
          <div className={styles.addressInfo}>
            <div className={styles.addressTitleGroup}>
              <h3>Poštanska adresa</h3>
              <p className={styles.userNameInCard}>{userData?.name}</p>
            </div>
            <button className={styles.changeBtn}>PROMIJENI</button>
          </div>
          <div className={styles.details}>
            <p>{userData?.address}</p>
          </div>
        </div>
      </section>

      <div className={styles.orderSummary}>
        {cartItems.map((item: any, idx: number) => (
          <div key={idx} className={styles.summaryItem}>
            <span>{item.name} x {item.quantity}</span>
            <span>{(item.price * item.quantity).toFixed(2)} $</span>
          </div>
        ))}
      </div>

      <footer className={styles.footer}>
        <div className={styles.totalRow}>
            <span>Ukupno za platiti:</span>
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