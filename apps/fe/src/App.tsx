import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Welcome from './pages/Welcome/Welcome';
import Home from './pages/Home/Home';
import Cart from './pages/Cart';
import Profile from './pages/Profile/Profile';
import Favorites from './pages/Favorites';
import  {BottomNav}  from './components/BottomNav/BottomNav';
import Search from './pages/Search';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <div id="root">
          <Routes>
            <Route path="/" element={<Welcome />} />
            <Route path="/home" element={<Home />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/search" element={<Search />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
          
          <BottomNav />
        </div>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
