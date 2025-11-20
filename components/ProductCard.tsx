import React from 'react';
import { Plus } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';

interface ProductCardProps {
  product: Product;
  variant?: 'list' | 'grid';
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, variant = 'list' }) => {
  const { addToCart } = useCart();

  if (variant === 'list') {
    return (
      <div className="flex items-center bg-white p-3 rounded-xl shadow-sm border border-slate-100">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-20 h-20 object-cover rounded-lg mr-4 bg-slate-50"
        />
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-slate-800 truncate">{product.name}</h4>
          <p className="text-sm text-slate-500 truncate">{product.description}</p>
          <p className="text-md font-bold text-primary mt-1">
            R$ {product.price.toFixed(2).replace('.', ',')}
          </p>
        </div>
        <button 
          onClick={() => addToCart(product)}
          className="p-2 rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-white transition-colors"
        >
          <Plus size={20} />
        </button>
      </div>
    );
  }

  // Grid Variant
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden group flex flex-col h-full">
      <div className="relative aspect-square bg-slate-50 overflow-hidden">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
        />
        <button className="absolute top-2 right-2 p-1.5 bg-white/80 rounded-full backdrop-blur-sm hover:bg-white text-slate-400 hover:text-red-500 transition-colors shadow-sm z-10">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>
      </div>
      <div className="p-3 flex flex-col flex-grow">
        <h3 className="font-semibold text-sm text-slate-800 truncate">{product.name}</h3>
        <p className="text-xs text-slate-500 mb-2 truncate">{product.description}</p>
        <div className="mt-auto flex justify-between items-center">
          <span className="font-bold text-base text-slate-900">
            R$ {product.price.toFixed(2).replace('.', ',')}
          </span>
          <button 
            onClick={() => addToCart(product)}
            className="p-2 bg-blue-500 rounded-lg text-white hover:bg-blue-600 transition-colors shadow-md shadow-blue-200 active:scale-95"
          >
            <Plus size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};