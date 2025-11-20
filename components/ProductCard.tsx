
import React, { useState, useRef, useEffect } from 'react';
import { Plus, X, ZoomIn, ChevronLeft, ChevronRight } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';

interface ProductCardProps {
  product: Product;
  variant?: 'list' | 'grid';
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, variant = 'list' }) => {
  const { addToCart } = useCart();
  const [isZoomOpen, setIsZoomOpen] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  
  // Refs para animação direta (High Performance)
  const imgRef = useRef<HTMLImageElement>(null);
  const transformRef = useRef({ x: 0, y: 0, scale: 1 });
  const lastTouchRef = useRef<{ x: number; y: number; dist: number } | null>(null);
  const initialScaleRef = useRef(1);

  // Determina as imagens a serem usadas (Galeria ou Imagem única)
  const images = product.gallery && product.gallery.length > 0 ? product.gallery : [product.image];

  // --- Lógica de Gestos ---

  const updateImageTransform = () => {
    if (imgRef.current) {
      const { x, y, scale } = transformRef.current;
      imgRef.current.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${scale})`;
    }
  };

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
      initialScaleRef.current = transformRef.current.scale;
    } else if (e.touches.length === 1 && transformRef.current.scale > 1) {
      lastTouchRef.current = { 
        x: e.touches[0].pageX, 
        y: e.touches[0].pageY, 
        dist: 0 
      };
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    // Importante: Não previne default se estiver com zoom 1 (para permitir scroll de thumbnails se necessário, ou gestos do sistema)
    // Mas aqui estamos em modal fixed, então previnir default é seguro para evitar scroll da página de fundo
    e.preventDefault(); 
    
    if (!lastTouchRef.current) return;
    
    if (e.touches.length === 2) {
      const dist = getDistance(e.touches);
      const scaleFactor = dist / lastTouchRef.current.dist;
      const newScale = Math.min(Math.max(initialScaleRef.current * scaleFactor, 1), 3);
      transformRef.current.scale = newScale;
      updateImageTransform();

    } else if (e.touches.length === 1 && transformRef.current.scale > 1) {
      const dx = e.touches[0].pageX - lastTouchRef.current.x;
      const dy = e.touches[0].pageY - lastTouchRef.current.y;
      transformRef.current.x += dx;
      transformRef.current.y += dy;
      
      lastTouchRef.current = { ...lastTouchRef.current, x: e.touches[0].pageX, y: e.touches[0].pageY };
      updateImageTransform();
    }
  };

  const handleTouchEnd = () => {
    lastTouchRef.current = null;
    if (transformRef.current.scale < 1) { 
      transformRef.current = { x: 0, y: 0, scale: 1 };
      if (imgRef.current) {
        imgRef.current.style.transition = "transform 0.3s ease-out";
        updateImageTransform();
        setTimeout(() => { if (imgRef.current) imgRef.current.style.transition = "none"; }, 300);
      }
    }
  };

  const handleDoubleTap = () => {
    if (imgRef.current) {
      imgRef.current.style.transition = "transform 0.3s ease-out";
      if (transformRef.current.scale > 1) { 
        transformRef.current = { x: 0, y: 0, scale: 1 };
      } else { 
        transformRef.current = { x: 0, y: 0, scale: 2.5 }; 
      }
      updateImageTransform();
      setTimeout(() => { if (imgRef.current) imgRef.current.style.transition = "none"; }, 300);
    }
  };

  const openZoom = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveImageIndex(0); // Resetar para primeira imagem ao abrir
    setIsZoomOpen(true);
    transformRef.current = { x: 0, y: 0, scale: 1 };
  };

  const closeZoom = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setIsZoomOpen(false);
    transformRef.current = { x: 0, y: 0, scale: 1 };
  };

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (activeImageIndex < images.length - 1) {
      changeImage(activeImageIndex + 1);
    } else {
      changeImage(0); // Loop
    }
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (activeImageIndex > 0) {
      changeImage(activeImageIndex - 1);
    } else {
      changeImage(images.length - 1); // Loop
    }
  };

  const changeImage = (index: number) => {
    // Reset zoom when changing image
    transformRef.current = { x: 0, y: 0, scale: 1 };
    updateImageTransform();
    setActiveImageIndex(index);
  };

  // Conteúdo do Modal de Zoom (Galeria)
  const ZoomModal = () => (
    <div 
      className="fixed inset-0 z-[60] bg-white flex flex-col animate-in fade-in duration-200"
      onClick={closeZoom}
      style={{ touchAction: 'none' }}
    >
      {/* Header do Modal */}
      <div className="flex justify-between items-center p-4 z-50 bg-white/80 backdrop-blur-sm absolute top-0 left-0 right-0">
         <h2 className="text-lg font-bold text-slate-900 truncate pr-4">{product.name}</h2>
         <button 
          className="text-slate-800 p-2 rounded-full bg-slate-100 hover:bg-slate-200 transition-colors shadow-sm"
          onClick={closeZoom}
        >
          <X size={24} />
        </button>
      </div>
      
      {/* Área da Imagem Principal */}
      <div 
        className="flex-1 flex items-center justify-center relative w-full h-full overflow-hidden bg-white"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onDoubleClick={handleDoubleTap}
        onClick={(e) => e.stopPropagation()}
      >
        <img 
          ref={imgRef}
          src={images[activeImageIndex]} 
          alt={`${product.name} view ${activeImageIndex + 1}`}
          className="max-w-full max-h-full object-contain will-change-transform px-4"
          draggable={false}
        />

        {/* Setas de Navegação (se houver mais de uma imagem) */}
        {images.length > 1 && (
          <>
            <button 
              onClick={prevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 p-3 rounded-full shadow-lg text-slate-800 hover:bg-white active:scale-95 transition-all border border-slate-100 z-40"
            >
              <ChevronLeft size={24} />
            </button>
            <button 
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 p-3 rounded-full shadow-lg text-slate-800 hover:bg-white active:scale-95 transition-all border border-slate-100 z-40"
            >
              <ChevronRight size={24} />
            </button>
          </>
        )}
      </div>
      
      {/* Footer com Miniaturas */}
      <div 
        className="bg-white border-t border-slate-100 p-4 pb-8 z-50 flex flex-col items-center"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="text-xs text-slate-400 mb-3 uppercase font-medium tracking-wider">
          {transformRef.current.scale > 1 ? 'Toque duplo para resetar zoom' : `${activeImageIndex + 1} / ${images.length}`}
        </p>
        
        {images.length > 1 && (
          <div className="flex gap-2 overflow-x-auto max-w-full px-2 no-scrollbar py-1">
            {images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => changeImage(idx)}
                className={`relative w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-all ${
                  activeImageIndex === idx 
                    ? 'border-primary ring-2 ring-primary/20' 
                    : 'border-transparent opacity-60 hover:opacity-100'
                }`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
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
               <ZoomIn className="text-slate-800 opacity-0 group-hover:opacity-100 transition-opacity bg-white/80 p-1 rounded-full" size={18} />
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
          {/* Ícone indicando galeria se houver mais de uma foto */}
          {images.length > 1 && (
            <div className="absolute bottom-2 right-2 bg-black/50 backdrop-blur-sm text-white text-[10px] px-1.5 py-0.5 rounded flex items-center">
              <span className="mr-1 font-bold">{images.length}</span> fotos
            </div>
          )}
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
