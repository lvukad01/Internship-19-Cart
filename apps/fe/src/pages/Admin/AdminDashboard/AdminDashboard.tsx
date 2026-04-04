import { useState } from 'react';
import AdminOrders from '../AdminOrders';
import styles from './AdminDashboard.module.css';
import AdminProducts from '../AdminProducts';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState<'products' | 'categories' | 'orders'>('products');

  return (
    <div className={styles.adminContainer}>
      <aside className={styles.sidebar}>
        <h2>ADMIN PANEL</h2>
        <nav>
          <button 
            className={activeTab === 'products' ? styles.active : ''} 
            onClick={() => setActiveTab('products')}
          >
            Proizvodi
          </button>
          <button 
            className={activeTab === 'categories' ? styles.active : ''} 
            onClick={() => setActiveTab('categories')}
          >
            Kategorije
          </button>
          <button 
            className={activeTab === 'orders' ? styles.active : ''} 
            onClick={() => setActiveTab('orders')}
          >
            Narudžbe
          </button>
        </nav>
      </aside>

      <main className={styles.content}>
        {activeTab === 'products' && <AdminProducts />}
        {activeTab === 'orders' && <AdminOrders />}
      </main>
    </div>
  );
};

export default AdminDashboard;