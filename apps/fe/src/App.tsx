import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Welcome from './pages/Welcome/Welcome';
import Home from './pages/Home/Home';
import Cart from './pages/Cart/Cart';
import Profile from './pages/Profile/Profile';
import Favorites from './pages/Favorites/Favorites';
import { BottomNav } from './components/BottomNav/BottomNav';
import Search from './pages/Search/Search';
import Product from './pages/Product/Product';
import Checkout from './pages/Checkout/Checkout';
import ErrorPage from './pages/ErrorPage/ErrorPage';
import AdminDashboard from './pages/Admin/AdminDashboard/AdminDashboard';

const queryClient = new QueryClient();

const AppContent = () => {
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith('/admin');

  return (
    <div className={isAdminPath ? "admin-root" : "mobile-root"}>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/home" element={<Home />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/search" element={<Search />} />
        <Route path="/product/:id" element={<Product />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/order-error" element={<ErrorPage />} />
        <Route path="/admin/*" element={<AdminDashboard />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      {!isAdminPath && <BottomNav />}
    </div>
  );
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;