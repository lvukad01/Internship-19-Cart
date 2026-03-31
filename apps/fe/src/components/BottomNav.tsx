import { Link, useLocation } from 'react-router-dom';

export const BottomNav = () => {
  const location = useLocation();
  if (location.pathname === '/') return null;

  return (
    <nav style={{ position: 'fixed', bottom: 0, width: '100%', maxWidth: '430px', display: 'flex', justifyContent: 'space-around', background: 'white', borderTop: '1px solid #eee', padding: '10px 0' }}>
      <Link to="/home">🏠</Link>
      <Link to="/cart">🛒</Link>
      <Link to="/profile">👤</Link>
    </nav>
  );
};