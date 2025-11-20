import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Grid, Heart, User, ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';

export const BottomNav: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { items } = useCart();

  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);

  const isActive = (path: string) => location.pathname === path;

  // Dynamic color based on page to match screenshots, or default to primary
  const getActiveColorClass = () => 'text-primary';

  return (
    <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white/90 backdrop-blur-md border-t border-slate-200 z-50">
      <div className="flex justify-around items-center h-16">
        <button 
          onClick={() => navigate('/')}
          className={`flex flex-col items-center ${isActive('/') ? getActiveColorClass() : 'text-slate-400 hover:text-slate-600'}`}
        >
          <Home size={24} strokeWidth={isActive('/') ? 2.5 : 2} />
          <span className="text-[10px] font-medium mt-1">Início</span>
        </button>
        
        <button 
          onClick={() => navigate('/products')}
          className={`flex flex-col items-center ${isActive('/products') ? getActiveColorClass() : 'text-slate-400 hover:text-slate-600'}`}
        >
          <Grid size={24} strokeWidth={isActive('/products') ? 2.5 : 2} />
          <span className="text-[10px] font-medium mt-1">Categorias</span>
        </button>

        <button 
          onClick={() => navigate('/cart')}
          className={`flex flex-col items-center relative ${isActive('/cart') ? getActiveColorClass() : 'text-slate-400 hover:text-slate-600'}`}
        >
          <ShoppingCart size={24} strokeWidth={isActive('/cart') ? 2.5 : 2} />
          <span className="text-[10px] font-medium mt-1">Carrinho</span>
          {totalItems > 0 && (
            <span className="absolute top-0 right-2 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
              {totalItems}
            </span>
          )}
        </button>
        
        <button 
          onClick={() => navigate('/services')}
          className={`flex flex-col items-center ${isActive('/services') ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}
        >
          <User size={24} strokeWidth={isActive('/services') ? 2.5 : 2} />
          <span className="text-[10px] font-medium mt-1">Serviços</span>
        </button>
      </div>
    </nav>
  );
};