
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Grid, User, FileText } from 'lucide-react';

export const BottomNav: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  // Dynamic color based on page to match screenshots, or default to primary
  const getActiveColorClass = () => 'text-primary';

  const openPdfCatalog = () => {
    window.open('https://drive.google.com/file/d/1l10mJMnb9s5-v8_g10DmWOzKSzuF4Kt_/view?usp=sharing', '_blank');
  };

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
          onClick={openPdfCatalog}
          className="flex flex-col items-center text-slate-400 hover:text-red-600 transition-colors"
        >
          <FileText size={24} strokeWidth={2} />
          <span className="text-[10px] font-medium mt-1">Catálogo</span>
        </button>
        
        <button 
          onClick={() => navigate('/services')}
          className={`flex flex-col items-center ${isActive('/services') ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}
        >
          <User size