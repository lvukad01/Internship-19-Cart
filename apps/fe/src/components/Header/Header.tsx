import { useNavigate } from 'react-router-dom';
import { FiBell, FiChevronLeft } from 'react-icons/fi';
import cartLogo from '../../assets/logo/cart logo.svg';
import brandLogo from '../../assets/logo/brand name.svg';
import styles from './Header.module.css';

interface HeaderProps {
  showBack?: boolean;
  title?: string;
  showLogo?: boolean;
}

const Header = ({ showBack = false, title, showLogo = false }: HeaderProps) => {
  const navigate = useNavigate();

  return (
    <header className={styles.header}>
      <div className={styles.leftSection}>
        {showBack ? (
          <FiChevronLeft size={24} onClick={() => navigate(-1)} className={styles.icon} />
        ) : showLogo ? (
          <img src={cartLogo} className={styles.logo} alt="Cart" />
        ) : null}
        
        {showLogo && <img src={brandLogo} className={styles.brand} alt="Brand" />}
        {title && <h1 className={styles.title}>{title}</h1>}
      </div>

      <div className={styles.notification}>
        <FiBell size={24} />
        <span className={styles.badge}></span>
      </div>
    </header>
  );
};

export default Header;