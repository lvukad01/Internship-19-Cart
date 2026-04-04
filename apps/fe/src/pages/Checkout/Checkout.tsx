import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { FiTruck, FiMapPin, FiChevronLeft } from 'react-icons/fi';
import api from '../../api/axiosInstance';
import styles from './Checkout.module.css';

const Checkout = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  // Dohvaćamo podatke o korisniku iz localStorage (spremljeno pri login-u)
  const [customerData] = useState({
    name: localStorage.getItem('userName') || 'Filip Dunpić',
    address: localStorage.getItem('userAddress') || 'Ul. Ruđera Boškovića 32, Split',
    phone: localStorage.getItem('userPhone') || '091 123 4567',
    county: 'Splitsko Dalmatinska županija',
    zip: '21430 Hrvatska'
  });

  const cartItems = JSON.parse(localStorage.getItem('cart') || '[]');
  const subTotal = cartItems.reduce((acc: any, item: any) => acc + item.price * item.quantity, 0);
  const deliveryPrice = 5.00;
  const totalPrice = subTotal + deliveryPrice;

  const orderMutation = useMutation({
    mutationFn: async () => {
      const token = localStorage.getItem('token');
      const orderPayload = {
        customerName: customerData.name,
        customerPhone: customerData.phone,
        shippingAddress: `${customerData.address}, ${customerData.zip}`,
        paymentMethod: 'CASH', // Ili CARD ovisno o selekciji
        deliveryMethod: 'Pošta',
        subTotal: subTotal,
        deliveryPrice: deliveryPrice,
        totalPrice: totalPrice,
        items: cartItems.map((item: any) => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
          size: item.size
        }))
      };

      return await api.post('/orders', orderPayload, {
        headers: { Authorization: `Bearer ${token}` }
      });
    },
    onSuccess: () => {
      alert('Narudžba uspješno poslana!');
      localStorage.removeItem('cart'); // Isprazni košaricu nakon kupnje
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      navigate('/'); 
    },
    onError: (error: any) => {
      alert(error.response?.data?.message || 'Greška pri slanju narudžbe');
    }
  });

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <button onClick={() => navigate(-1)} className={styles.backBtn}>
          <FiChevronLeft size={24} />
        </button>
        <h1 className={styles.pageTitle}>Blagajna</h1>
        <div style={{ width: 24 }}></div>
      </header>

      {/* ADRESA DOSTAVE */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>ADRESA DOSTAVE</h2>
          <FiTruck size={20} />
        </div>
        
        <div className={styles.addressBox}>
          <div className={styles.addressInfo}>
            <h3>Poštanska adresa</h3>
            <button className={styles.changeBtn}>PROMIJENI</button>
          </div>
          <div className={styles.details}>
            <p className={styles.name}>{customerData.name}</p>
            <p>{customerData.address}</p>
            <p>{customerData.county}</p>
            <p>{customerData.zip}</p>
          </div>
        </div>
      </section>

      {/* PAKETOMAT OPCIJA */}
      <div className={styles.parcelOption}>
        <FiMapPin size={20} />
        <span>POKUPI NA PAKETOMATU</span>
      </div>

      <hr className={styles.divider} />

      {/* ADRESA NAPLATE */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>ADRESA NAPLATE</h2>
          <FiTruck size={20} />
        </div>
        
        <div className={styles.addressBox}>
          <div className={styles.addressInfo}>
            <h3>Poštanska adresa</h3>
            <button className={styles.changeBtn}>PROMIJENI</button>
          </div>
          <div className={styles.details}>
            <p className={styles.name}>{customerData.name}</p>
            <p>{customerData.address}</p>
            <p>{customerData.county}</p>
            <p>{customerData.zip}</p>
          </div>
        </div>
      </section>

      <footer className={styles.footer}>
        <div className={styles.priceSummary}>
            <span>Ukupno za platiti: <strong>{totalPrice.toFixed(2)} $</strong></span>
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