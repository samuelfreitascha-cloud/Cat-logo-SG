
import React, { useState } from 'react';
import { Bell, Search, Umbrella, Armchair, Sofa, Tag } from 'lucide-react';
import { PRODUCTS } from '../constants';
import { ProductCard } from '../components/ProductCard';
import { useNavigate } from 'react-router-dom';
import { HeroCarousel } from '../components/HeroCarousel';

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const [imgError, setImgError] = useState(false);

  return (
    <div className="p-6 pb-24">
      {/* Header */}
      <header className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          {/* 
            Lógica de Logo: Tenta carregar a imagem. 
            Se der erro (bloqueio do Google), mostra o ícone de fallback.
          */}
          {!imgError ? (
            <img 
              src="https://drive.google.com/thumbnail?id=1EcR3fq9V9oav2sUrMDdm1SNeuEJgcbxh&sz=s200" 
              alt="Logo Catalogo Sungap" 
              className="w-12 h-12 object-contain"
              onError={() => setImgError(true)}
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
              <Umbrella className="text-primary" size={28} />
            </div>
          )}
          <div>
            <h1 className="text-xl font-bold text-slate-800 leading-tight">Catalogo Sungap</h1>
            <p className="text-xs text-slate-500">Encontre o assento perfeito</p>
          </div>
        </div>
        <button className="relative p-2 rounded-full hover:bg-slate-100 transition-colors">
          <Bell className="text-slate-600" size={24} />
          <span className="absolute top-2 right-2 flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary"></span>
          </span>
        </button>
      </header>

      {/* Search */}
      <div className="relative mb-8 group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={20} />
        <input 
          type="text" 
          placeholder="Procurar cadeiras, espreguiçadeiras..." 
          className="w-full pl-12 pr-4 py-3 bg-slate-100 border-transparent focus:bg-white focus:border-primary focus:ring-primary rounded-xl text-slate-700 placeholder-slate-400 transition-all outline-none border-2"
        />
      </div>

      {/* Novo Carrossel Interativo */}
      <HeroCarousel />

      {/* Categories */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4 text-slate-800">Categorias</h3>
        <div className="grid grid-cols-4 gap-4 text-center">
          {[
            { name: 'Praia', icon: Umbrella, color: 'text-primary', bg: 'bg-primary/10' },
            { name: 'Jardim', icon: Armchair, color: 'text-slate-500', bg: 'bg-slate-100' },
            { name: 'Casa', icon: Sofa, color: 'text-slate-500', bg: 'bg-slate-100' },
            { name: 'Ofertas', icon: Tag, color: 'text-slate-500', bg: 'bg-slate-100' },
          ].map((cat, idx) => (
            <button 
              key={idx} 
              onClick={() => navigate('/products')}
              className="flex flex-col items-center space-y-2 group"
            >
              <div className={`w-16 h-16 ${cat.bg} rounded-2xl flex items-center justify-center transition-all group-hover:scale-95 group-active:scale-90`}>
                <cat.icon className={`${cat.color} text-3xl`} size={28} strokeWidth={1.5} />
              </div>
              <p className="text-xs font-medium text-slate-600">{cat.name}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Popular Products */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-slate-800">Mais Populares</h3>
          <button onClick={() => navigate('/products')} className="text-sm font-medium text-primary hover:text-primary-dark">
            Ver todos
          </button>
        </div>
        <div className="space-y-4">
          {PRODUCTS.slice(0, 2).map(product => (
            <ProductCard key={product.id} product={product} variant="list" />
          ))}
        </div>
      </div>
    </div>
  );
};
