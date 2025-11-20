import React from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { BottomNav } from './components/BottomNav';
import { Home } from './pages/Home';
import { ProductList } from './pages/ProductList';
import { Services } from './pages/Services';
import { Cart } from './pages/Cart';
import { Checkout } from './pages/Checkout';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const hideNavRoutes = ['/checkout'];
  const showNav = !hideNavRoutes.includes(location.pathname);

  return (
    <div className="max-w-md mx-auto min-h-screen bg-white shadow-2xl overflow-hidden relative">
      {children}
      {showNav && <BottomNav />}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <CartProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<ProductList />} />
            <Route path="/services" element={<Services />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
          </Routes>
        </Layout>
      </Router>
    </CartProvider>
  );
};

export default App;