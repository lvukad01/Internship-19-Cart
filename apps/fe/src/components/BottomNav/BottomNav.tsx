import { Link, useLocation } from 'react-router-dom';
import homeLogo from '../../assets/logo/home.svg';
import searchLogo from '../../assets/logo/search.svg';
import favoriteLogo from '../../assets/logo/heart.svg';
import shoppingCartLogo from '../../assets/logo/shopping-bag.svg';
import userLogo from '../../assets/logo/user.svg';

export const BottomNav = () => {
  const location = useLocation();
  if (location.pathname === '/') return null;

  const IconWrapper = ({ src, x, y, customScale = 0.9 }) => (
    <div className="iconMask" style={{
      width: '60px',
      height: '60px',
      overflow: 'hidden',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
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

  return (
    <nav style={{ 
      position: 'fixed', 
      bottom: 0, 
      width: '100%', 
      maxWidth: '430px', 
      display: 'flex', 
      justifyContent: 'space-around', 
      background: 'white', 
      borderTop: '1px solid #eee', 
      padding: '10px 0',
      alignItems: 'center'
    }}>
      <Link to="/home">
        <IconWrapper src={homeLogo} x={50} y={-45} />
      </Link>

      <Link to="/search">
        <IconWrapper src={searchLogo} x={40} y={-115} />
      </Link>

      <Link to="/favorites">
        <IconWrapper src={favoriteLogo} x={30} y={-65} />
      </Link>

      <Link to="/cart">
        <IconWrapper src={shoppingCartLogo} x={22.5} y={-30}   />
      </Link>

      <Link to="/profile">
        <IconWrapper src={userLogo} x={50} y={-55} customScale={1} />
      </Link>
    </nav>
  );
};