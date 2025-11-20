import React, { useState, useRef } from 'react';
import { Plus, X, ZoomIn } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';

interface ProductCardProps {
  product: Product;
  variant?: 'list' | 'grid';
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, variant = 'list' }) => {
  const { addToCart } = useCart();
  const [isZoomOpen, setIsZoomOpen] = useState(false);
  
  // Estados para Gestos de Zoom
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const lastTouchRef = useRef<{ x: number; y: number; dist: number } | null>(null);
  const initialScaleRef = useRef(1);

  // Lógica de Gestos (Copiada e adaptada do HeroCarousel para consistência)
  const getDistance = (touches: React.TouchList) => {
    return Math.hypot(
      touches[0].pageX - touches[1].pageX,
      touches[0].pageY - touches[1].pageY
    );
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      const dist = getDistance(e.touches);
      lastTouchRef.current = { x: 0, y: 0, dist };
      initialScaleRef.current = scale;
    } else if (e.touches.length === 1 && scale > 1) {
      lastTouchRef.current = { 
        x: e.touches[0].pageX, 
        y: e.touches[0].pageY, 
        dist: 0 
      };
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isZoomOpen) e.preventDefault();
    
    if (e.touches.length === 2 && lastTouchRef.current) {
      const dist = getDistance(e.touches);
      const scaleFactor = dist / lastTouchRef.current.dist;
      const newScale = Math.min(Math.max(initialScaleRef.current * scaleFactor, 1), 4);
      setScale(newScale);
    } else if (e.touches.length === 1 && scale > 1 && lastTouchRef.current) {
      const dx = e.touches[0].pageX - lastTouchRef.current.x;
      const dy = e.touches[0].pageY - lastTouchRef.current.y;
      setPosition(prev => ({ x: prev.x + dx, y: prev.y + dy }));
      lastTouchRef.current = { ...lastTouchRef.current, x: e.touches[0].pageX, y: e.touches[0].pageY };
    }
  };

  const handleTouchEnd = () => {
    lastTouchRef.current = null;
    if (scale < 1) { setScale(1); setPosition({ x: 0, y: 0 }); }
  };

  const handleDoubleTap = () => {
    if (scale > 1) { setScale(1); setPosition({ x: 0, y: 0 }); }
    else { setScale(2.5); }
  };

  const openZoom = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsZoomOpen(true);
  };

  const closeZoom = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setIsZoomOpen(false);
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  // Conteúdo do Modal de Zoom
  const ZoomModal = () => (
    <div 
      className="fixed inset-0 z-[60] bg-black flex items-center justify-center animate-in fade-in duration-200"
      onClick={closeZoom}
      style={{ touchAction: 'none' }}
    >
      <button 
        className="absolute top-4 right-4 text-white/70 hover:text-white p-2 rounded-full bg-white/10 backdrop-blur-md transition-colors z-50"
        onClick={closeZoom}
      >
        <X size={32} />
      </button>
      
      <div 
        className="w-full h-full flex items-center justify-center"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onDoubleClick={handleDoubleTap}
        onClick={(e) => e.stopPropagation()}
      >
        <img 
          src={product.image} 
          alt={product.name}
          className="max-w-full max-h-full object-contain transition-transform duration-75 ease-out"
          style={{
            transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
            cursor: scale > 1 ? 'grab' : 'zoom-in'
          }}
          draggable={false}
        />
      </div>
      
      <div className="absolute bottom-8 left-0 right-0 text-center text-white pointer-events-none">
        <h2 className="text-xl font-bold mb-1 drop-shadow-md">{product.name}</h2>
        <p className="text-white/80 text-sm drop-shadow-md">
           {scale > 1 ? 'Toque duplo para resetar' : 'Faça o gesto de pinça para zoom'}
        </p>
      </div>
    </div>
  );

  if (variant === 'list') {
    return (
      <>
        <div className="flex items-center bg-white p-3 rounded-xl shadow-sm border border-slate-100">
          <div className="relative cursor-pointer group" onClick={openZoom}>
            <img 
              src={product.image} 
              alt={product.name} 
              className="w-20 h-20 object-contain bg-white rounded-lg mr-4 border border-slate-50"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors rounded-lg flex items-center justify-center mr-4">
               <ZoomIn className="text-white opacity-0 group-hover:opacity-100" size={20} />
            </div>
          </div>
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
        {isZoomOpen && <ZoomModal />}
      </>
    );
  }

  // Grid Variant
  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden group flex flex-col h-full">
        <div 
          className="relative aspect-square bg-white overflow-hidden cursor-pointer"
          onClick={openZoom}
        >
          <img 
            src={product.image} 
            alt={product.name} 
            className="w-full h-full object-contain p-2 transition-transform duration-500 group-hover:scale-105" 
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/5 transition-colors">
             <ZoomIn className="text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity bg-white/80 p-1.5 rounded-full shadow-sm" size={28} />
          </div>
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
              onClick={(e) => {
                  e.stopPropagation();
                  addToCart(product);
              }}
              className="p-2 bg-blue-500 rounded-lg text-white hover:bg-blue-600 transition-colors shadow-md shadow-blue-200 active:scale-95"
            >
              <Plus size={16} />
            </button>
          </div>
        </div>
      </div>
      {isZoomOpen && <ZoomModal />}
    </>
  );
};