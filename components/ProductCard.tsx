import React, { useState, useRef, useEffect } from 'react';
import { Plus, X, ChevronLeft, ChevronRight, ShoppingBag, MessageCircle, Info, Image as ImageIcon } from 'lucide-react';
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
  const [showInfoImage, setShowInfoImage] = useState(false);
  
  const imgRef = useRef<HTMLImageElement>(null);
  const transformRef = useRef({ x: 0, y: 0, scale: 1 });
  const lastTouchRef = useRef<{ x: number; y: number; dist: number } | null>(null);
  const initialScaleRef = useRef(1);
  const lastTapTimeRef = useRef(0);
  const touchStartPosRef = useRef({ x: 0, y: 0 });
  const isPanningOrZooming = useRef(false);

  const images = product.gallery && product.gallery.length > 0 ? product.gallery : [product.image];
  const currentImageSrc = showInfoImage && product.infoImage ? product.infoImage : images[activeImageIndex];
  const isWhatsApp = product.externalUrl && (product.externalUrl.includes('wa.me') || product.externalUrl.includes('whatsapp'));

  const handleActionClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (product.externalUrl) {
      window.open(product.externalUrl, '_blank');
    } else {
      addToCart(product);
    }
  };
  
  const resetTransformations = (withAnimation = false) => {
    transformRef.current = { x: 0, y: 0, scale: 1 };
    if (imgRef.current) {
      imgRef.current.style.transition = withAnimation ? "transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)" : 'none';
      imgRef.current.style.transform = 'translate3d(0px, 0px, 0) scale(1)';
    }
  };

  useEffect(() => {
    if (isZoomOpen) {
      resetTransformations();
    }
  }, [activeImageIndex, showInfoImage, isZoomOpen]);

  const handleNavigation = (direction: 'next' | 'prev') => {
    resetTransformations();
    if (showInfoImage) return;

    const newIndex = direction === 'next'
      ? (activeImageIndex + 1) % images.length
      : (activeImageIndex - 1 + images.length) % images.length;
    setActiveImageIndex(newIndex);
  };
  
  const handleManualNav = (e: React.MouseEvent, direction: 'next' | 'prev') => {
      e.stopPropagation();
      handleNavigation(direction);
  };

  const getDistance = (touches: React.TouchList) => {
    return Math.hypot(touches[0].pageX - touches[1].pageX, touches[0].pageY - touches[1].pageY);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (imgRef.current) imgRef.current.style.transition = 'none';
    isPanningOrZooming.current = false;
    touchStartPosRef.current = { x: e.touches[0].pageX, y: e.touches[0].pageY };
    
    if (e.touches.length === 2) {
      const dist = getDistance(e.touches);
      lastTouchRef.current = { x: 0, y: 0, dist };
      initialScaleRef.current = transformRef.current.scale;
    } else if (e.touches.length === 1) {
      lastTouchRef.current = { x: e.touches[0].pageX, y: e.touches[0].pageY, dist: 0 };
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.cancelable) e.preventDefault();
    if (!lastTouchRef.current) return;
    isPanningOrZooming.current = true;

    const { scale } = transformRef.current;

    if (e.touches.length === 2) {
      const dist = getDistance(e.touches);
      const scaleFactor = dist / lastTouchRef.current.dist;
      const newScale = Math.min(Math.max(initialScaleRef.current * scaleFactor, 1), 3);
      transformRef.current.scale = newScale;
    } else if (e.touches.length === 1) {
      const dx = e.touches[0].pageX - lastTouchRef.current.x;
      const dy = e.touches[0].pageY - lastTouchRef.current.y;

      if (scale > 1) {
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        const scaledWidth = imgRef.current ? imgRef.current.offsetWidth * scale : 0;
        const scaledHeight = imgRef.current ? imgRef.current.offsetHeight * scale : 0;
        const maxOffsetX = Math.max(0, (scaledWidth - viewportWidth) / 2);
        const maxOffsetY = Math.max(0, (scaledHeight - viewportHeight) / 2);
        
        transformRef.current.x = Math.max(-maxOffsetX, Math.min(maxOffsetX, transformRef.current.x + dx));
        transformRef.current.y = Math.max(-maxOffsetY, Math.min(maxOffsetY, transformRef.current.y + dy));
      } else {
        if (!showInfoImage) transformRef.current.x += dx;
      }
      lastTouchRef.current.x = e.touches[0].pageX;
      lastTouchRef.current.y = e.touches[0].pageY;
    }

    if (imgRef.current) {
      const { x, y, scale: newScale } = transformRef.current;
      imgRef.current.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${newScale})`;
    }
  };
  
  const handleTouchEnd = () => {
    const now = Date.now();
    const timeSinceLastTap = now - lastTapTimeRef.current;
    lastTapTimeRef.current = now;

    if (!isPanningOrZooming.current) {
      if (timeSinceLastTap < 300) {
        if (transformRef.current.scale > 1) {
          resetTransformations(true);
        } else {
          transformRef.current.scale = 2.5;
           if (imgRef.current) {
              imgRef.current.style.transition = "transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)";
              imgRef.current.style.transform = `translate3d(0px, 0px, 0) scale(2.5)`;
           }
        }
        lastTapTimeRef.current = 0;
        return;
      }
    }

    if (transformRef.current.scale <= 1.05) {
      const swipeThreshold = 70;
      if (!showInfoImage && transformRef.current.x < -swipeThreshold) {
        handleNavigation('next');
      } else if (!showInfoImage && transformRef.current.x > swipeThreshold) {
        handleNavigation('prev');
      } else {
        resetTransformations(true);
      }
    }
    isPanningOrZooming.current = false;
  };
  
  const openZoom = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveImageIndex(0);
    setShowInfoImage(false);
    setIsZoomOpen(true);
  };
  
  const renderActionButton = (isList: boolean) => {
    const iconSize = isList ? 18 : 20;
    if (isWhatsApp) {
      return (
        <button 
          onClick={handleActionClick}
          className="p-2.5 rounded-full bg-green-500/10 text-green-600 hover:bg-green-500/20 active:scale-90 transition-all shadow-sm"
        >
          <MessageCircle size={iconSize} fill="currentColor" className="opacity-20" strokeWidth={2} />
        </button>
      );
    }
    if (product.externalUrl) {
      return (
        <button 
          onClick={handleActionClick}
          className="p-2.5 rounded-full bg-primary/10 text-primary hover:bg-primary/20 active:scale-90 transition-all shadow-sm flex items-center justify-center gap-0.5"
        >
          <ShoppingBag size={iconSize} strokeWidth={2} />
          <Plus size={iconSize - 4} strokeWidth={3} className="-ml-1" />
        </button>
      );
    }
    return (
      <button 
        onClick={handleActionClick}
        className="p-2.5 rounded-full bg-primary/10 text-primary hover:bg-primary/20 active:scale-90 transition-all shadow-sm"
      >
        <ShoppingBag size={iconSize + 2} />
      </button>
    );
  };

  const renderZoomModal = () => {
    const scale = transformRef.current.scale;
    const isZoomActive = scale > 1;

    return (
      <div 
          className="fixed inset-0 z-[100] bg-white flex items-center justify-center overflow-hidden"
          style={{ touchAction: 'none' }}
      >
          <button 
              className="absolute top-4 right-4 text-slate-800 p-2.5 rounded-full bg-white/90 shadow-md backdrop-blur-sm z-50 hover:bg-slate-100 active:scale-95 transition-all"
              onClick={() => setIsZoomOpen(false)}
          >
              <X size={24} />
          </button>
          
          <div 
              className="w-full h-full flex items-center justify-center bg-white"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
          >
              <img 
                  ref={imgRef}
                  src={currentImageSrc} 
                  alt={product.name}
                  className="max-w-full max-h-full object-contain will-change-transform"
                  draggable={false}
              />
          </div>

          <div 
            className="absolute top-0 left-0 right-0 p-4 transition-opacity duration-300"
            style={{ opacity: isZoomActive ? 0 : 1, pointerEvents: isZoomActive ? 'none' : 'auto' }}
          >
             <div className="text-center text-slate-500 bg-white/90 backdrop-blur-md mx-auto max-w-xs p-3 rounded-2xl shadow-sm border border-slate-100">
                <h2 className="text-lg font-bold text-slate-900">{product.name}</h2>
             </div>
          </div>
          
          <button 
              className="absolute left-4 top-1/2 -translate-y-1/2 z-[110] p-3 rounded-full bg-black/10 text-white/70 hover:bg-black/30 backdrop-blur-[2px] border border-white/5 active:scale-95 transition-all duration-300"
              style={{ opacity: isZoomActive || showInfoImage ? 0 : 1, pointerEvents: isZoomActive || showInfoImage ? 'none' : 'auto' }}
              onClick={(e) => handleManualNav(e, 'prev')}
          >
              <ChevronLeft size={32} strokeWidth={1.5} />
          </button>
          
          <button 
              className="absolute right-4 top-1/2 -translate-y-1/2 z-[110] p-3 rounded-full bg-black/10 text-white/70 hover:bg-black/30 backdrop-blur-[2px] border border-white/5 active:scale-95 transition-all duration-300"
              style={{ opacity: isZoomActive || showInfoImage ? 0 : 1, pointerEvents: isZoomActive || showInfoImage ? 'none' : 'auto' }}
              onClick={(e) => handleManualNav(e, 'next')}
          >
              <ChevronRight size={32} strokeWidth={1.5} />
          </button>
          
          <div 
            className="absolute bottom-0 left-0 right-0 p-4 flex flex-col items-center gap-4 transition-opacity duration-300"
            style={{ opacity: isZoomActive ? 0 : 1, pointerEvents: isZoomActive ? 'none' : 'auto' }}
          >
               {product.infoImage && (
                   <button 
                       onClick={(e) => {e.stopPropagation(); setShowInfoImage(!showInfoImage)}}
                       className={`px-5 py-2.5 rounded-full flex items-center gap-2 font-medium shadow-md transition-all active:scale-95 ${showInfoImage ? 'bg-primary text-white' : 'bg-white text-slate-700 hover:bg-slate-50'}`}
                   >
                       {showInfoImage ? <ImageIcon size={18} /> : <Info size={18} />}
                       {showInfoImage ? 'Ver Fotos' : 'Saber mais'}
                   </button>
               )}
               {!showInfoImage && images.length > 1 && (
                   <div className="flex gap-2 overflow-x-auto max-w-[90vw] p-2 no-scrollbar bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-100 shadow-sm">
                       {images.map((img, idx) => (
                           <button 
                               key={idx}
                               onClick={(e) => { e.stopPropagation(); setActiveImageIndex(idx); }}
                               className={`w-12 h-12 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 ${idx === activeImageIndex ? 'border-primary scale-105' : 'border-transparent opacity-70'}`}
                           >
                               <img src={img} className="w-full h-full object-cover" alt="" />
                           </button>
                       ))}
                   </div>
               )}
          </div>
      </div>
    );
  };

  if (variant === 'grid') {
    return (
      <>
        <div 
          onClick={openZoom}
          className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden group active:scale-[0.98] transition-all cursor-pointer"
        >
          <div className="relative aspect-square bg-slate-100 overflow-hidden">
            <img 
              src={product.image} 
              alt={product.name} 
              className={`w-full h-full object-cover transition-transform duration-500 ${product.id === '1' ? 'scale-[1.5]' : ''}`}
            />
          </div>
          <div className="p-3" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-semibold text-sm text-slate-800 truncate mb-1 cursor-pointer" onClick={openZoom}>{product.name}</h3>
            <p className="text-xs text-slate-500 mb-2 truncate">{product.description}</p>
            <div className="flex justify-between items-center">
              <span className="font-bold text-sm text-slate-900">
                R$ {product.price.toFixed(2).replace('.', ',')}
              </span>
              {renderActionButton(false)}
            </div>
          </div>
        </div>
        {isZoomOpen && renderZoomModal()}
      </>
    );
  }

  return (
    <>
      <div 
        onClick={openZoom}
        className="flex items-center bg-white p-3 rounded-2xl shadow-sm border border-slate-100 active:bg-slate-50 transition-colors cursor-pointer"
      >
        <div className="relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 mr-4 bg-slate-100">
           <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-slate-800 truncate cursor-pointer" onClick={openZoom}>{product.name}</h4>
          <p className="text-xs text-slate-500 mb-1">{product.description}</p>
          <p className="text-sm font-bold text-primary">
            R$ {product.price.toFixed(2).replace('.', ',')}
          </p>
        </div>
        <div onClick={(e) => e.stopPropagation()}>
          {renderActionButton(true)}
        </div>
      </div>
      {isZoomOpen && renderZoomModal()}
    </>
  );
};
