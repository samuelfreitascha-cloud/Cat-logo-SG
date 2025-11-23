
import React, { useState, useRef, useEffect } from 'react';
import { Plus, X, ZoomIn, ChevronLeft, ChevronRight, ShoppingBag, MessageCircle, Info, Image as ImageIcon } from 'lucide-react';
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
  
  const [zoomMode, setZoomMode] = useState(false);
  
  // Refs para animação direta
  const imgRef = useRef<HTMLImageElement>(null);
  const uiRef = useRef<HTMLDivElement>(null); 
  const transformRef = useRef({ x: 0, y: 0, scale: 1 });
  const lastTouchRef = useRef<{ x: number; y: number; dist: number } | null>(null);
  const initialScaleRef = useRef(1);
  const rafRef = useRef<number | null>(null); 
  
  const isAnimatingRef = useRef(false); 
  const animationStartTimeRef = useRef(0);

  const layoutCacheRef = useRef({
    imgWidth: 0,
    imgHeight: 0,
    viewportWidth: 0,
    viewportHeight: 0
  });

  const touchStartTimeRef = useRef(0);
  const touchStartPosRef = useRef({ x: 0, y: 0 });

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

  useEffect(() => {
    if (isZoomOpen) {
        transformRef.current = { x: 0, y: 0, scale: 1 };
        if (imgRef.current) {
            imgRef.current.style.transition = 'none';
            imgRef.current.style.transform = 'translate3d(0,0,0) scale(1)';
        }
        isAnimatingRef.current = false;
        setZoomMode(false);
    }
  }, [activeImageIndex, showInfoImage, isZoomOpen]);

  const updateImageTransform = () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      if (imgRef.current) {
        const { x, y, scale } = transformRef.current;
        imgRef.current.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${scale})`;
      }
    });
  };

  useEffect(() => {
    if (uiRef.current) {
        const opacity = zoomMode ? '0' : '1';
        const pointerEvents = zoomMode ? 'none' : 'auto';
        if (uiRef.current.style.opacity !== opacity) {
            uiRef.current.style.opacity = opacity;
            uiRef.current.style.pointerEvents = pointerEvents;
        }
    }
  }, [zoomMode]);

  const getDistance = (touches: React.TouchList) => {
    return Math.hypot(
      touches[0].pageX - touches[1].pageX,
      touches[0].pageY - touches[1].pageY
    );
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (isAnimatingRef.current) {
        isAnimatingRef.current = false;
    }

    if (imgRef.current) {
        imgRef.current.style.transition = 'none';
    }

    touchStartTimeRef.current = Date.now();
    touchStartPosRef.current = { x: e.touches[0].pageX, y: e.touches[0].pageY };

    if (imgRef.current) {
        layoutCacheRef.current = {
            imgWidth: imgRef.current.offsetWidth,
            imgHeight: imgRef.current.offsetHeight,
            viewportWidth: window.innerWidth,
            viewportHeight: window.innerHeight
        };
    }

    if (e.touches.length === 2) {
      if (!zoomMode) setZoomMode(true);
      const dist = getDistance(e.touches);
      lastTouchRef.current = { x: 0, y: 0, dist };
      initialScaleRef.current = transformRef.current.scale;
    } else if (e.touches.length === 1) {
      lastTouchRef.current = { 
        x: e.touches[0].pageX, 
        y: e.touches[0].pageY, 
        dist: 0 
      };
    }
  };

  const handleSwipeNavigation = (direction: 'next' | 'prev') => {
    if (isAnimatingRef.current && Date.now() - animationStartTimeRef.current < 150) return;

    if (images.length <= 1 && !showInfoImage) {
        transformRef.current = { x: 0, y: 0, scale: 1 };
        if (imgRef.current) {
            imgRef.current.style.transition = "transform 0.2s ease-out";
            updateImageTransform();
            setTimeout(() => { if (imgRef.current) imgRef.current.style.transition = "none"; }, 200);
        }
        return;
    }
    
    isAnimatingRef.current = true;
    animationStartTimeRef.current = Date.now();

    const screenWidth = window.innerWidth;
    const exitX = direction === 'next' ? -screenWidth : screenWidth;

    if (imgRef.current) {
        imgRef.current.style.transition = "transform 0.2s ease-out";
        imgRef.current.style.transform = `translate3d(${exitX}px, 0, 0) scale(1)`;
    }

    setTimeout(() => {
        if (direction === 'next') {
            if (activeImageIndex < images.length - 1) setActiveImageIndex(prev => prev + 1);
            else setActiveImageIndex(0);
        } else {
            if (activeImageIndex > 0) setActiveImageIndex(prev => prev - 1);
            else setActiveImageIndex(images.length - 1);
        }
        
        // Force reset states after swipe
        transformRef.current = { x: 0, y: 0, scale: 1 };
        setZoomMode(false);
        if (imgRef.current) {
             imgRef.current.style.transition = "none";
             imgRef.current.style.transform = "translate3d(0,0,0) scale(1)";
        }
    }, 200);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.cancelable) e.preventDefault();
    isAnimatingRef.current = false;
    
    if (!lastTouchRef.current) return;
    
    if (e.touches.length === 2) {
      if (!zoomMode) setZoomMode(true);
      const dist = getDistance(e.touches);
      const scaleFactor = dist / lastTouchRef.current.dist;
      const newScale = Math.min(Math.max(initialScaleRef.current * scaleFactor, 1), 3);
      transformRef.current.scale = newScale;
      updateImageTransform();

    } else if (e.touches.length === 1) {
      const dx = e.touches[0].pageX - lastTouchRef.current.x;
      const dy = e.touches[0].pageY - lastTouchRef.current.y;
      
      if (transformRef.current.scale > 1.1) {
          const { imgWidth, imgHeight, viewportWidth, viewportHeight } = layoutCacheRef.current;
          
          const currentScale = transformRef.current.scale;
          const scaledWidth = imgWidth * currentScale;
          const scaledHeight = imgHeight * currentScale;
          
          const maxOffsetX = Math.max(0, (scaledWidth - viewportWidth) / 2);
          const maxOffsetY = Math.max(0, (scaledHeight - viewportHeight) / 2);

          let nextX = transformRef.current.x + dx;
          let nextY = transformRef.current.y + dy;

          nextX = Math.max(-maxOffsetX, Math.min(maxOffsetX, nextX));
          nextY = Math.max(-maxOffsetY, Math.min(maxOffsetY, nextY));

          transformRef.current.x = nextX;
          transformRef.current.y = nextY;
      } else {
          transformRef.current.x += dx;
      }
      
      lastTouchRef.current = { ...lastTouchRef.current, x: e.touches[0].pageX, y: e.touches[0].pageY };
      updateImageTransform();
    }
  };

  const performToggleZoom = () => {
      if (zoomMode) {
          setZoomMode(false);
          transformRef.current = { x: 0, y: 0, scale: 1 };
          if (imgRef.current) {
              imgRef.current.style.transition = "transform 0.3s ease-out";
              updateImageTransform();
              setTimeout(() => { if (imgRef.current) imgRef.current.style.transition = "none"; }, 300);
          }
      } else {
          setZoomMode(true);
      }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const timeDiff = Date.now() - touchStartTimeRef.current;
    const touchEndPos = e.changedTouches[0];
    const distDiff = Math.hypot(
        touchEndPos.pageX - touchStartPosRef.current.x,
        touchEndPos.pageY - touchStartPosRef.current.y
    );

    if (timeDiff < 300 && distDiff < 20 && e.changedTouches.length === 1) {
        performToggleZoom();
        lastTouchRef.current = null;
        return;
    }
    
    if (transformRef.current.scale > 1.1) {
       lastTouchRef.current = null;
       return;
    }

    // Critical fix: If scale is close to 1, force reset to 1 and decide on swipe
    const wasZoomed = transformRef.current.scale !== 1;
    transformRef.current.scale = 1;
    transformRef.current.y = 0;
    setZoomMode(false);

    const swipeThreshold = 70;

    // Only swipe if we weren't just zooming out
    if (!wasZoomed) {
        if (transformRef.current.x < -swipeThreshold) {
            handleSwipeNavigation('next');
            lastTouchRef.current = null;
            return;
        } else if (transformRef.current.x > swipeThreshold) {
            handleSwipeNavigation('prev');
            lastTouchRef.current = null;
            return;
        }
    }

    transformRef.current = { x: 0, y: 0, scale: 1 };
    if (imgRef.current) {
        imgRef.current.style.transition = "transform 0.2s ease-out";
        updateImageTransform();
        setTimeout(() => { if (imgRef.current) imgRef.current.style.transition = "none"; }, 200);
    }
    
    lastTouchRef.current = null;
  };

  const openZoom = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveImageIndex(0);
    setShowInfoImage(false);
    setIsZoomOpen(true);
    setZoomMode(false);
    transformRef.current = { x: 0, y: 0, scale: 1 };
    isAnimatingRef.current = false;
  };

  const closeZoom = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setIsZoomOpen(false);
    setShowInfoImage(false);
    setZoomMode(false);
    transformRef.current = { x: 0, y: 0, scale: 1 };
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    isAnimatingRef.current = false;
  };

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (showInfoImage) return; 
    if (activeImageIndex < images.length - 1) {
      setActiveImageIndex(activeImageIndex + 1);
    } else {
      setActiveImageIndex(0);
    }
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (showInfoImage) return; 
    if (activeImageIndex > 0) {
      setActiveImageIndex(activeImageIndex - 1);
    } else {
      setActiveImageIndex(images.length - 1);
    }
  };

  const toggleInfoImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    transformRef.current = { x: 0, y: 0, scale: 1 };
    updateImageTransform();
    setShowInfoImage(!showInfoImage);
    setZoomMode(false);
  };

  const renderActionButton = (isList: boolean) => {
    if (isWhatsApp) {
      return (
        <button 
          onClick={handleActionClick}
          className={`${isList ? 'p-2' : 'p-2.5'} rounded-full bg-green-500/10 text-green-600 hover:bg-green-500/20 active:scale-90 transition-all shadow-sm`}
        >
          <MessageCircle size={isList ? 20 : 22} fill="currentColor" className="opacity-20" strokeWidth={2} />
        </button>
      );
    }

    if (product.externalUrl) {
      // Ícones lado a lado para compra externa
      return (
        <button 
          onClick={handleActionClick}
          className={`${isList ? 'p-2' : 'p-2.5'} rounded-full bg-primary/10 text-primary hover:bg-primary/20 active:scale-90 transition-all shadow-sm flex items-center justify-center gap-0.5`}
        >
          <ShoppingBag size={isList ? 18 : 20} strokeWidth={2} />
          <Plus size={isList ? 12 : 14} strokeWidth={3} className="-ml-0.5" />
        </button>
      );
    }

    // Botão Padrão (Adicionar ao Carrinho interno)
    return (
      <button 
        onClick={handleActionClick}
        className={`${isList ? 'p-2' : 'p-2.5'} rounded-full bg-primary/10 text-primary hover:bg-primary/20 active:scale-90 transition-all shadow-sm`}
      >
        <ShoppingBag size={isList ? 20 : 22} />
      </button>
    );
  };

  // Renderização principal do componente
  if (variant === 'list') {
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
            <h4 
                className="font-semibold text-slate-800 truncate"
            >
                {product.name}
            </h4>
            <p className="text-xs text-slate-500 mb-1">{product.description}</p>
            <p className="text-sm font-bold text-primary">
              R$ {product.price.toFixed(2).replace('.', ',')}
            </p>
          </div>
          {renderActionButton(true)}
        </div>
        
        {isZoomOpen && (
            <div 
                className="fixed inset-0 z-[100] bg-white flex items-center justify-center animate-in fade-in duration-200 overflow-hidden"
                style={{ touchAction: 'none' }}
            >
                <button 
                    className="absolute top-4 right-4 text-slate-800 p-2.5 rounded-full bg-white/90 shadow-md backdrop-blur-sm z-50 hover:bg-slate-100 active:scale-95 transition-all"
                    onClick={closeZoom}
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
                
                <div ref={uiRef} className="absolute inset-0 pointer-events-none flex flex-col justify-between py-8 transition-opacity duration-200">
                    
                    {/* TÍTULO NO TOPO (Apenas se não estiver no modo Saber Mais) */}
                    {!showInfoImage ? (
                      <div className="w-full flex justify-center mt-6 pointer-events-auto z-40">
                           <div className="bg-white/90 backdrop-blur-md px-6 py-3 rounded-2xl shadow-sm border border-slate-100 text-center mx-12">
                               <h2 className="text-lg font-bold text-slate-900 leading-tight">{product.name}</h2>
                               <p className="text-xs text-slate-500">{activeImageIndex + 1} / {images.length}</p>
                           </div>
                      </div>
                    ) : (
                      /* Espaçador para manter layout */
                      <div className="mt-6 h-12"></div>
                    )}

                    {/* SETAS CENTRALIZADAS */}
                    {!showInfoImage && images.length > 1 && (
                        <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 flex justify-between px-4 pointer-events-auto z-30">
                            <button onClick={prevImage} className="p-3 bg-white/90 shadow-md backdrop-blur rounded-full text-slate-700 hover:bg-slate-100">
                                <ChevronLeft size={24} />
                            </button>
                            <button onClick={nextImage} className="p-3 bg-white/90 shadow-md backdrop-blur rounded-full text-slate-700 hover:bg-slate-100">
                                <ChevronRight size={24} />
                            </button>
                        </div>
                    )}
                    
                    <div className="flex flex-col gap-4 items-center mb-6 pointer-events-auto z-40">
                         
                         {/* BOTÃO SABER MAIS (ACIMA DAS THUMBS) */}
                         {product.infoImage && (
                             <button 
                                 onClick={toggleInfoImage}
                                 className={`px-5 py-2.5 rounded-full flex items-center gap-2 font-medium shadow-md transition-all active:scale-95 ${showInfoImage ? 'bg-primary text-white' : 'bg-white text-slate-700 hover:bg-slate-50'}`}
                             >
                                 {showInfoImage ? (
                                     <>
                                         <ImageIcon size={18} />
                                         Ver Fotos
                                     </>
                                 ) : (
                                     <>
                                         <Info size={18} />
                                         Saber mais
                                     </>
                                 )}
                             </button>
                         )}

                         {/* THUMBNAILS (EM BAIXO) */}
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
            </div>
        )}
      </>
    );
  }

  // Grid Variant
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
          <div className="absolute top-2 right-2">
            <button className="p-2 bg-white/90 backdrop-blur-sm rounded-full text-slate-400 hover:text-red-500 transition-colors shadow-sm">
               <div className="w-4 h-4 rounded-full border-2 border-current opacity-50"></div>
            </button>
          </div>
        </div>
        <div className="p-3">
          <h3 
            className="font-semibold text-sm text-slate-800 truncate mb-1"
          >
            {product.name}
          </h3>
          <p className="text-xs text-slate-500 mb-2 truncate">{product.description}</p>
          <div className="flex justify-between items-center">
            <span className="font-bold text-sm text-slate-900">
              R$ {product.price.toFixed(2).replace('.', ',')}
            </span>
            {renderActionButton(false)}
          </div>
        </div>
      </div>
      
      {/* Reutiliza o mesmo modal de zoom para Grid */}
      {isZoomOpen && (
            <div 
                className="fixed inset-0 z-[100] bg-white flex items-center justify-center animate-in fade-in duration-200 overflow-hidden"
                style={{ touchAction: 'none' }}
            >
                <button 
                    className="absolute top-4 right-4 text-slate-800 p-2.5 rounded-full bg-white/90 shadow-md backdrop-blur-sm z-50 hover:bg-slate-100 active:scale-95 transition-all"
                    onClick={closeZoom}
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
                
                <div ref={uiRef} className="absolute inset-0 pointer-events-none flex flex-col justify-between py-8 transition-opacity duration-200">
                    
                    {/* TÍTULO NO TOPO (Apenas se não estiver no modo Saber Mais) */}
                    {!showInfoImage ? (
                      <div className="w-full flex justify-center mt-6 pointer-events-auto z-40">
                           <div className="bg-white/90 backdrop-blur-md px-6 py-3 rounded-2xl shadow-sm border border-slate-100 text-center mx-12">
                               <h2 className="text-lg font-bold text-slate-900 leading-tight">{product.name}</h2>
                               <p className="text-xs text-slate-500">{activeImageIndex + 1} / {images.length}</p>
                           </div>
                      </div>
                    ) : (
                      /* Espaçador para manter layout */
                      <div className="mt-6 h-12"></div>
                    )}

                    {/* SETAS CENTRALIZADAS */}
                    {!showInfoImage && images.length > 1 && (
                        <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 flex justify-between px-4 pointer-events-auto z-30">
                            <button onClick={prevImage} className="p-3 bg-white/90 shadow-md backdrop-blur rounded-full text-slate-700 hover:bg-slate-100">
                                <ChevronLeft size={24} />
                            </button>
                            <button onClick={nextImage} className="p-3 bg-white/90 shadow-md backdrop-blur rounded-full text-slate-700 hover:bg-slate-100">
                                <ChevronRight size={24} />
                            </button>
                        </div>
                    )}
                    
                    <div className="flex flex-col gap-4 items-center mb-6 pointer-events-auto z-40">
                         
                         {/* BOTÃO SABER MAIS (ACIMA DAS THUMBS) */}
                         {product.infoImage && (
                             <button 
                                 onClick={toggleInfoImage}
                                 className={`px-5 py-2.5 rounded-full flex items-center gap-2 font-medium shadow-md transition-all active:scale-95 ${showInfoImage ? 'bg-primary text-white' : 'bg-white text-slate-700 hover:bg-slate-50'}`}
                             >
                                 {showInfoImage ? (
                                     <>
                                         <ImageIcon size={18} />
                                         Ver Fotos
                                     </>
                                 ) : (
                                     <>
                                         <Info size={18} />
                                         Saber mais
                                     </>
                                 )}
                             </button>
                         )}

                         {/* THUMBNAILS (EM BAIXO) */}
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
            </div>
      )}
    </>
  );
};
