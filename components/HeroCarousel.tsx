import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, AlertTriangle, ZoomIn, X } from 'lucide-react';

const CAROUSEL_IMAGES = [
  {
    id: 1,
    url: 'https://i.ibb.co/XxMPPLzh/3.png', 
    title: 'Coleção Verão 2026',
    subtitle: 'Conforto e estilo para seus dias de sol'
  },
  {
    id: 2,
    url: 'https://i.ibb.co/KjDB3Xmt/4.png',
    title: 'Design Exclusivo',
    subtitle: 'Peças únicas que transformam ambientes'
  },
  {
    id: 3,
    url: 'https://i.ibb.co/rKBvK1pG/5.png',
    title: 'Área Externa',
    subtitle: 'Durabilidade e beleza para seu jardim'
  },
  {
    id: 4,
    url: 'https://i.ibb.co/fVjBDXdG/7.png',
    title: 'Novidades',
    subtitle: 'Confira os últimos lançamentos'
  },
  {
    id: 5,
    url: 'https://i.ibb.co/N66VLkxQ/6.png',
    title: 'Mais Opções',
    subtitle: 'Explore nossa variedade'
  }
];

export const HeroCarousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({});
  const [isZoomOpen, setIsZoomOpen] = useState(false);
  
  const imgRef = useRef<HTMLImageElement>(null);
  const transformRef = useRef({ x: 0, y: 0, scale: 1 });
  const lastTouchRef = useRef<{ x: number; y: number; dist: number } | null>(null);
  const initialScaleRef = useRef(1);
  const lastTapTimeRef = useRef(0);
  const touchStartPosRef = useRef({ x: 0, y: 0 });
  const isPanningOrZooming = useRef(false);

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
  }, [currentIndex, isZoomOpen]);

  useEffect(() => {
    if (CAROUSEL_IMAGES.length <= 1 || isZoomOpen || imageErrors[currentIndex]) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % CAROUSEL_IMAGES.length);
    }, 5000); 
    return () => clearInterval(interval);
  }, [currentIndex, imageErrors, isZoomOpen]);
  
  const handleNavigation = (direction: 'next' | 'prev') => {
    resetTransformations(); // Força o reset antes de trocar
    const newIndex = direction === 'next'
      ? (currentIndex + 1) % CAROUSEL_IMAGES.length
      : (currentIndex - 1 + CAROUSEL_IMAGES.length) % CAROUSEL_IMAGES.length;
    setCurrentIndex(newIndex);
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
        // Pan mode (arrastar com zoom)
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        const scaledWidth = imgRef.current ? imgRef.current.offsetWidth * scale : 0;
        const scaledHeight = imgRef.current ? imgRef.current.offsetHeight * scale : 0;
        const maxOffsetX = Math.max(0, (scaledWidth - viewportWidth) / 2);
        const maxOffsetY = Math.max(0, (scaledHeight - viewportHeight) / 2);
        
        transformRef.current.x = Math.max(-maxOffsetX, Math.min(maxOffsetX, transformRef.current.x + dx));
        transformRef.current.y = Math.max(-maxOffsetY, Math.min(maxOffsetY, transformRef.current.y + dy));
      } else {
        // Swipe mode (trocar de slide)
        transformRef.current.x += dx;
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

    if (!isPanningOrZooming.current) { // Detecta TAP
      if (timeSinceLastTap < 300) { // Detecta DOUBLE TAP
        if (transformRef.current.scale > 1) {
          resetTransformations(true);
        } else {
          transformRef.current.scale = 2.5;
           if (imgRef.current) {
              imgRef.current.style.transition = "transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)";
              imgRef.current.style.transform = `translate3d(0px, 0px, 0) scale(2.5)`;
           }
        }
        lastTapTimeRef.current = 0; // Previne triplo toque
        return;
      }
    }

    if (transformRef.current.scale <= 1.05) {
      const swipeThreshold = 70;
      if (transformRef.current.x < -swipeThreshold) {
        handleNavigation('next');
      } else if (transformRef.current.x > swipeThreshold) {
        handleNavigation('prev');
      } else {
        resetTransformations(true);
      }
    }
    isPanningOrZooming.current = false;
  };
  
  return (
    <>
      <div className="relative rounded-2xl overflow-hidden mb-8 shadow-xl shadow-slate-200/50 group h-64 md:h-80 bg-slate-200 cursor-pointer"
           onClick={() => setIsZoomOpen(true)}
      >
        <div className="w-full h-full relative">
          {CAROUSEL_IMAGES.map((image, index) => (
            <div
              key={image.id}
              className={`absolute inset-0 w-full h-full transition-opacity duration-700 ease-in-out ${index === currentIndex ? 'opacity-100' : 'opacity-0'}`}
            >
              {!imageErrors[index] ? (
                <img src={image.url} alt={image.title} className="w-full h-full object-cover" onError={() => setImageErrors(prev => ({ ...prev, [index]: true }))} />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-slate-800 text-white p-4 text-center font-sans">
                  <AlertTriangle size={32} className="mb-2 text-yellow-400" />
                  <h3 className="font-bold text-base">Erro ao carregar imagem</h3>
                </div>
              )}
              
              {!imageErrors[index] && (
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent p-6 flex flex-col justify-end pointer-events-none">
                  <h2 className="text-white text-2xl font-bold mb-1 drop-shadow-md">{image.title}</h2>
                  <p className="text-slate-200 text-sm drop-shadow-sm font-medium">{image.subtitle}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {isZoomOpen && (
        <div className="fixed inset-0 z-[100] bg-white flex items-center justify-center overflow-hidden" style={{ touchAction: 'none' }}>
          <button 
            className="absolute top-4 right-4 text-slate-800 p-2.5 rounded-full bg-white/90 shadow-md backdrop-blur-sm z-[110] hover:bg-slate-100 active:scale-95 transition-all" 
            onClick={() => setIsZoomOpen(false)}>
              <X size={24} />
          </button>
          
          <div className="w-full h-full flex items-center justify-center" onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd}>
            <img ref={imgRef} src={CAROUSEL_IMAGES[currentIndex].url} alt={CAROUSEL_IMAGES[currentIndex].title} className="max-w-full max-h-full object-contain will-change-transform" draggable={false} />
          </div>

          <div 
            className="absolute top-0 left-0 right-0 p-4 transition-opacity duration-300"
            style={{ opacity: transformRef.current.scale > 1 ? 0 : 1, pointerEvents: transformRef.current.scale > 1 ? 'none' : 'auto' }}
          >
             <div className="text-center text-slate-500 bg-white/90 backdrop-blur-md mx-auto max-w-xs p-3 rounded-2xl shadow-sm border border-slate-100">
                <h2 className="text-lg font-bold text-slate-900">{CAROUSEL_IMAGES[currentIndex].title}</h2>
             </div>
          </div>
          
          <button 
            className="absolute left-4 top-1/2 -translate-y-1/2 z-[110] p-3 rounded-full bg-black/10 text-white/70 hover:bg-black/30 backdrop-blur-[2px] border border-white/5 active:scale-95 transition-all duration-300"
            style={{ opacity: transformRef.current.scale > 1 ? 0 : 1, pointerEvents: transformRef.current.scale > 1 ? 'none' : 'auto' }}
            onClick={(e) => handleManualNav(e, 'prev')}
          >
              <ChevronLeft size={32} strokeWidth={1.5} />
          </button>
          
          <button 
            className="absolute right-4 top-1/2 -translate-y-1/2 z-[110] p-3 rounded-full bg-black/10 text-white/70 hover:bg-black/30 backdrop-blur-[2px] border border-white/5 active:scale-95 transition-all duration-300"
            style={{ opacity: transformRef.current.scale > 1 ? 0 : 1, pointerEvents: transformRef.current.scale > 1 ? 'none' : 'auto' }}
            onClick={(e) => handleManualNav(e, 'next')}
          >
              <ChevronRight size={32} strokeWidth={1.5} />
          </button>
        </div>
      )}
    </>
  );
};
