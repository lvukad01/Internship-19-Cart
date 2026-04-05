import { Outlet } from 'react-router-dom';
import {BottomNav} from '../BottomNav';
import styles from './MobileLayout.module.css';

const MobileLayout = () => {
  return (
    <div className={styles.mobileContainer}>
      <BottomNav />
      <main className={styles.mainContent}>
        <Outlet /> 
      </main>
    </div>
  );
};

export default MobileLayout;