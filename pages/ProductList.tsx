import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, Filter, ArrowUpDown, Grid as GridIcon, List } from 'lucide-react';
import { PRODUCTS } from '../constants';
import { ProductCard } from '../components/ProductCard';

export const ProductList: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background-light pb-20">
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md p-4 border-b border-slate-100">
        <div className="flex justify-between items-center">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-slate-800 hover:bg-slate-100 rounded-full">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-xl font-bold text-slate-900">Cadeiras</h1>
          <button className="p-2 -mr-2 text-slate-800 hover:bg-slate-100 rounded-full">
            <Search size={24} />
          </button>
        </div>
      </header>

      <main className="p-4">
        {/* Controls */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-3">
            <button className="flex items-center space-x-1.5 px-4 py-2 bg-white text-slate-700 rounded-full shadow-sm border border-slate-200 active:scale-95 transition-transform">
              <Filter size={18} />
              <span className="text-sm font-medium">Filtros</span>
            </button>
            <button className="flex items-center space-x-1.5 px-4 py-2 bg-white text-slate-700 rounded-full shadow-sm border border-slate-200 active:scale-95 transition-transform">
              <ArrowUpDown size={18} />
              <span className="text-sm font-medium">Ordenar</span>
            </button>
          </div>
          <div className="flex items-center bg-slate-100 rounded-lg p-1">
            <button className="p-1.5 bg-white rounded text-slate-800 shadow-sm">
              <GridIcon size={20} />
            </button>
            <button className="p-1.5 text-slate-400 hover:text-slate-600">
              <List size={20} />
            </button>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 gap-4">
          {PRODUCTS.map(product => (
            <ProductCard key={product.id} product={product} variant="grid" />
          ))}
        </div>
      </main>
    </div>
  );
};