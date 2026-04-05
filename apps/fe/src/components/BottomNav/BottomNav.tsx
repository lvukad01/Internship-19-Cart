import { Link, useLocation } from 'react-router-dom';
import homeLogo from '../../assets/logo/home.svg';
import searchLogo from '../../assets/logo/search.svg';
import favoriteLogo from '../../assets/logo/heart.svg';
import shoppingCartLogo from '../../assets/logo/shopping-bag.svg';
import userLogo from '../../assets/logo/user.svg';
import styles from './BottomNav.module.css';

interface IconWrapperProps {
  src: string;
  x: number;
  y: number;
  customScale?: number;
  isActive: boolean; 
}

const IconWrapper = ({ src, x, y, customScale = 0.9, isActive }: IconWrapperProps) => (
  <div style={{
    width: '60px',
    height: '60px',
    overflow: 'hidden',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    filter: isActive ? 'none' : 'grayscale(100%) opacity(0.4)',
    transition: 'filter 0.3s ease' 
  }}>
    <img 
      src={src} 
      alt="icon" 
      style={{
        width: 'auto',
        height: 'auto',
        objectFit: 'none',
        objectPosition: `${x}px ${y}px`,
        transform: `scale(${customScale})`, 
        transformOrigin: 'center'
      }} 
    />
  </div>
);

export const BottomNav = () => {
  const location = useLocation();
  if (location.pathname === '/') return null;

  const isPath = (path: string) => location.pathname === path;

  return (
    <nav className={styles.navContainer}>
      <Link to="/home">
        <IconWrapper src={homeLogo} x={50} y={-45} isActive={isPath('/home')} />
      </Link>

      <Link to="/search">
        <IconWrapper src={searchLogo} x={40} y={-115} isActive={isPath('/search')} />
      </Link>

      <Link to="/favorites">
        <IconWrapper src={favoriteLogo} x={30} y={-65} isActive={isPath('/favorites')} />
      </Link>

      <Link to="/cart">
        <IconWrapper src={shoppingCartLogo} x={22.5} y={-30} customScale={1.1} isActive={isPath('/cart')} />
      </Link>

      <Link to="/profile">
        <IconWrapper src={userLogo} x={50} y={-55} customScale={1} isActive={isPath('/profile')} />
      </Link>
    </nav>
  );
};