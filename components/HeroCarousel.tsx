
import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, AlertTriangle, ZoomIn, X } from 'lucide-react';

// Configuração das imagens do Carrossel
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
  const [zoomMode, setZoomMode] = useState(false); 

  // Refs para animação direta
  const imgRef = useRef<HTMLImageElement>(null);
  const uiRef = useRef<HTMLDivElement>(null); 
  const transformRef = useRef({ x: 0, y: 0, scale: 1 });
  const lastTouchRef = useRef<{ x: number; y: number; dist: number } | null>(null);
  const initialScaleRef = useRef(1);
  const rafRef = useRef<number | null>(null); 
  
  // Controle de Animação e Segurança
  const isAnimatingRef = useRef(false); 
  const animationStartTimeRef = useRef(0);

  // Cache de Layout
  const layoutCacheRef = useRef({
    imgWidth: 0,
    imgHeight: 0,
    viewportWidth: 0,
    viewportHeight: 0
  });

  const touchStartTimeRef = useRef(0);
  const touchStartPosRef = useRef({ x: 0, y: 0 });

  // Auto-play do Carrossel (só funciona se zoom fechado)
  useEffect(() => {
    if (CAROUSEL_IMAGES.length <= 1) return;
    if (isZoomOpen) return;
    if (imageErrors[currentIndex]) return;

    const currentImage = CAROUSEL_IMAGES[currentIndex];
    const looksWrong = !currentImage.url.includes('i.ibb.co') && currentImage.url.includes('ibb.co');
    if (looksWrong) return;

    const interval = setInterval(() => {
      nextSlide();
    }, 5000); 
    return () => clearInterval(interval);
  }, [currentIndex, imageErrors, isZoomOpen]);

  // Reset e Segurança ao mudar slide ou abrir/fechar
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
  }, [currentIndex, isZoomOpen]);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % CAROUSEL_IMAGES.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + CAROUSEL_IMAGES.length) % CAROUSEL_IMAGES.length);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const handleImageError = (index: number) => {
    setImageErrors(prev => ({ ...prev, [index]: true }));
  };

  const handleZoomOpen = (index: number) => {
    const currentImage = CAROUSEL_IMAGES[index];
    if (imageErrors[index]) return;
    setIsZoomOpen(true);
    setZoomMode(false);
    transformRef.current = { x: 0, y: 0, scale: 1 };
    isAnimatingRef.current = false;
  };

  const closeZoom = () => {
    setIsZoomOpen(false);
    setZoomMode(false);
    transformRef.current = { x: 0, y: 0, scale: 1 };
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    isAnimatingRef.current = false;
  };

  const handleSwipeNavigation = (direction: 'next' | 'prev') => {
    if (isAnimatingRef.current && Date.now() - animationStartTimeRef.current < 150) return;
    
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
            setCurrentIndex((prev) => (prev + 1) % CAROUSEL_IMAGES.length);
        } else {
            setCurrentIndex((prev) => (prev - 1 + CAROUSEL_IMAGES.length) % CAROUSEL_IMAGES.length);
        }
        // Force reset
        transformRef.current = { x: 0, y: 0, scale: 1 };
        setZoomMode(false);
        if (imgRef.current) {
            imgRef.current.style.transition = "none";
            imgRef.current.style.transform = "translate3d(0,0,0) scale(1)";
        }
    }, 200);
  };

  const performToggleZoom = () => {
      if (zoomMode) {
          // Desativar Zoom (Reset manual)
          setZoomMode(false);
          transformRef.current = { x: 0, y: 0, scale: 1 };
          if (imgRef.current) {
              imgRef.current.style.transition = "transform 0.3s ease-out";
              updateImageTransform();
              setTimeout(() => { if (imgRef.current) imgRef.current.style.transition = "none"; }, 300);
          }
      } else {
          // Ativar Zoom
          setZoomMode(true);
      }
  };

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
            uiRef.current.style.transition = 'opacity 0.2s ease-out';
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
          // If not zoomed significantly, just move X for potential swipe
          transformRef.current.x += dx;
      }

      lastTouchRef.current = {
        ...lastTouchRef.current,
        x: e.touches[0].pageX,
        y: e.touches[0].pageY
      };
      
      updateImageTransform();
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const timeDiff = Date.now() - touchStartTimeRef.current;
    const touchEndPos = e.changedTouches[0];
    const distDiff = Math.hypot(
        touchEndPos.pageX - touchStartPosRef.current.x,
        touchEndPos.pageY - touchStartPosRef.current.y
    );

    // Click/Tap detection
    if (timeDiff < 300 && distDiff < 20 && e.changedTouches.length === 1) {
        performToggleZoom();
        lastTouchRef.current = null;
        return;
    }

    // Significant Zoom Active
    if (transformRef.current.scale > 1.1) {
       lastTouchRef.current = null;
       return; 
    }

    // Slight Zoom or Normal State - Reset to 1.0 to enable Swipe next time
    // This is the critical fix: If we are close to 1, snap to 1 and decide on swipe
    const wasZoomed = transformRef.current.scale !== 1;
    transformRef.current.scale = 1;
    transformRef.current.y = 0; // Reset Y always if we are snapping back
    setZoomMode(false); // Ensure react state knows we are not zoomed

    // Logic for Swipe vs Reset
    const swipeThreshold = 70; 
    
    // Only swipe if we weren't just zooming out (prevents accidental swipe when pinch-closing)
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

    // If no swipe, snap back to center
    transformRef.current = { x: 0, y: 0, scale: 1 };
    if (imgRef.current) {
        imgRef.current.style.transition = "transform 0.2s ease-out";
        updateImageTransform();
        setTimeout(() => { if (imgRef.current) imgRef.current.style.transition = "none"; }, 200);
    }

    lastTouchRef.current = null;
  };

  return (
    <>
      <div className="relative rounded-2xl overflow-hidden mb-8 shadow-xl shadow-slate-200/50 group h-64 md:h-80 bg-slate-200 cursor-pointer"
           onClick={() => handleZoomOpen(currentIndex)}
      >
        <div className="w-full h-full relative">
          {CAROUSEL_IMAGES.map((image, index) => {
            const looksWrong = !image.url.includes('i.ibb.co') && image.url.includes('ibb.co');
            
            return (
              <div
                key={image.id}
                className={`absolute inset-0 w-full h-full transition-opacity duration-700 ease-in-out ${
                  index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
                }`}
              >
                {!imageErrors[index] && !looksWrong ? (
                  <img
                    src={image.url}
                    alt={image.title}
                    className="w-full h-full object-cover"
                    onError={() => handleImageError(index)}
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-slate-800 text-white p-4 text-center font-sans" onClick={(e) => e.stopPropagation()}>
                    <AlertTriangle size={32} className="mb-2 text-yellow-400" />
                    <h3 className="font-bold text-base mb-1">Link incorreto</h3>
                    <a href={image.url} target="_blank" rel="noreferrer" className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-full mt-4 text-xs font-bold">Abrir Link Original</a>
                  </div>
                )}
                
                {!imageErrors[index] && !looksWrong && (
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent p-6 flex flex-col justify-end pointer-events-none">
                    <h2 className="text-white text-2xl font-bold mb-1 drop-shadow-md">{image.title}</h2>
                    <p className="text-slate-200 text-sm drop-shadow-sm font-medium">{image.subtitle}</p>
                    <div className="absolute top-4 right-4 bg-black/30 backdrop-blur-sm p-2 rounded-full text-white/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <ZoomIn size={20} />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {CAROUSEL_IMAGES.length > 1 && (
          <>
            <button
              onClick={(e) => { e.stopPropagation(); prevSlide(); }}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-20 bg-black/20 hover:bg-black/40 backdrop-blur-md text-white p-2 rounded-full transition-all"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); nextSlide(); }}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-20 bg-black/20 hover:bg-black/40 backdrop-blur-md text-white p-2 rounded-full transition-all"
            >
              <ChevronRight size={24} />
            </button>
            <div className="absolute bottom-4 right-4 flex space-x-2 z-20">
              {CAROUSEL_IMAGES.map((_, index) => (
                <button
                  key={index}
                  onClick={(e) => { e.stopPropagation(); goToSlide(index); }}
                  className={`transition-all duration-300 rounded-full h-1.5 shadow-sm ${
                    index === currentIndex ? 'w-6 bg-white' : 'w-2 bg-white/50 hover:bg-white/80'
                  }`}
                />
              ))}
            </div>
          </>
        )}
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
            className="w-full h-full flex items-center justify-center"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <img 
              ref={imgRef}
              src={CAROUSEL_IMAGES[currentIndex].url} 
              alt={CAROUSEL_IMAGES[currentIndex].title}
              className="max-w-full max-h-full object-contain will-change-transform"
              draggable={false}
            />
          </div>
          
          <div ref={uiRef} className="absolute inset-0 pointer-events-none flex flex-col justify-between py-8 transition-opacity duration-200">
             <div></div>
             <div className="text-center text-slate-500 pointer-events-auto bg-white/90 backdrop-blur-md mx-6 p-4 rounded-2xl shadow-sm border border-slate-100">
                <h2 className="text-xl font-bold mb-1 text-slate-900">{CAROUSEL_IMAGES[currentIndex].title}</h2>
                <p className="text-sm mb-3">{CAROUSEL_IMAGES[currentIndex].subtitle}</p>
                <div className="flex justify-center gap-2">
                   {CAROUSEL_IMAGES.map((_, idx) => (
                       <div 
                          key={idx}
                          className={`h-1.5 rounded-full transition-all duration-300 ${
                              idx === currentIndex ? 'w-6 bg-primary' : 'w-2 bg-slate-300'
                          }`}
                       />
                   ))}
                </div>
             </div>
          </div>
        </div>
      )}
    </>
  );
};
