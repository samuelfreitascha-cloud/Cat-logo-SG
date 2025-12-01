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
  const [zoomMode, setZoomMode] = useState(false); 

  const imgRef = useRef<HTMLImageElement>(null);
  const uiRef = useRef<HTMLDivElement>(null); 
  const transformRef = useRef({ x: 0, y: 0, scale: 1 });
  const lastTouchRef = useRef<{ x: number; y: number; dist: number } | null>(null);
  const initialScaleRef = useRef(1);
  const rafRef = useRef<number | null>(null); 
  const lastTapTimeRef = useRef(0); // Para detectar duplo toque
  
  const isAnimatingRef = useRef(false); 

  const layoutCacheRef = useRef({
    imgWidth: 0,
    imgHeight: 0,
    viewportWidth: 0,
    viewportHeight: 0
  });

  const touchStartTimeRef = useRef(0);
  const touchStartPosRef = useRef({ x: 0, y: 0 });

  // --- RESET FORÇADO AO MUDAR SLIDE ---
  useEffect(() => {
    transformRef.current = { x: 0, y: 0, scale: 1 };
    setZoomMode(false);
    isAnimatingRef.current = false;
    
    if (imgRef.current) {
        imgRef.current.style.transition = 'none';
        imgRef.current.style.transform = 'translate3d(0,0,0) scale(1)';
    }
  }, [currentIndex, isZoomOpen]);

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
  };

  const closeZoom = () => {
    setIsZoomOpen(false);
  };

  const handleManualNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    nextSlide();
  };

  const handleManualPrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    prevSlide();
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

  const handleSwipeNavigation = (direction: 'next' | 'prev') => {
    if (isAnimatingRef.current) return;
    isAnimatingRef.current = true;
    
    const screenWidth = window.innerWidth;
    const exitX = direction === 'next' ? -screenWidth : screenWidth;

    if (imgRef.current) {
        imgRef.current.style.transition = "transform 0.2s ease-out";
        imgRef.current.style.transform = `translate3d(${exitX}px, 0, 0) scale(1)`;
    }

    setTimeout(() => {
        if (direction === 'next') {
            nextSlide();
        } else {
            prevSlide();
        }
    }, 200);
  };

  const getDistance = (touches: React.TouchList) => {
    return Math.hypot(
      touches[0].pageX - touches[1].pageX,
      touches[0].pageY - touches[1].pageY
    );
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (imgRef.current) {
        imgRef.current.style.transition = 'none';
    }
    isAnimatingRef.current = false;

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
    if (!lastTouchRef.current) return;
    
    if (e.touches.length === 2) {
      if (!zoomMode) setZoomMode(true);
      const dist = getDistance(e.touches);
      const scaleFactor = dist / lastTouchRef.current.dist;
      const newScale = Math.min(Math.max(initialScaleRef.current * scaleFactor, 1), 3);
      
      transformRef.current.scale = newScale;
      updateImageTransform();
    } 
    else if (e.touches.length === 1) {
      const dx = e.touches[0].pageX - lastTouchRef.current.x;
      const dy = e.touches[0].pageY - lastTouchRef.current.y;
      
      if (transformRef.current.scale > 1.05) {
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
          transformRef.current.y = 0; 
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
    const now = Date.now();
    const timeSinceLastTap = now - lastTapTimeRef.current;
    
    // --- LÓGICA DE DUPLO TOQUE (DOUBLE TAP) ---
    if (timeSinceLastTap < 300 && timeSinceLastTap > 0) {
        if (transformRef.current.scale > 1.1) {
            // Se tiver zoom, reseta
            transformRef.current = { x: 0, y: 0, scale: 1 };
            setZoomMode(false);
        } else {
            // Se não tiver, dá zoom de 2.5x
            transformRef.current = { x: 0, y: 0, scale: 2.5 };
            setZoomMode(true);
        }
        if (imgRef.current) {
            imgRef.current.style.transition = "transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)";
            updateImageTransform();
        }
        lastTapTimeRef.current = 0;
        return;
    }
    
    lastTapTimeRef.current = now;

    // --- LÓGICA DE TOQUE SIMPLES E SWIPE ---
    const touchEndPos = e.changedTouches[0];
    const distDiff = Math.hypot(
        touchEndPos.pageX - touchStartPosRef.current.x,
        touchEndPos.pageY - touchStartPosRef.current.y
    );

    const timeDiff = now - touchStartTimeRef.current;

    // Tap simples (Alternar UI se não for double tap - handled by delay usually, but here simplified)
    if (timeDiff < 300 && distDiff < 20 && e.changedTouches.length === 1) {
        // Se já passou o tempo do double tap no próximo frame, toggla UI
        // Aqui apenas verificamos se não estamos em zoom mode para ativar
        if (!zoomMode && transformRef.current.scale === 1) {
             setZoomMode(true);
        } else if (zoomMode) {
            // Opcional: tocar uma vez no zoom mode pode esconder/mostrar UI sem resetar zoom
            // setZoomMode(!zoomMode); 
        }
        lastTouchRef.current = null;
        return;
    }

    // Saída do Swipe ou Reset de Zoom Pequeno
    if (transformRef.current.scale < 1.1) {
       transformRef.current.scale = 1;
       transformRef.current.y = 0;
       setZoomMode(false);
       
       const swipeThreshold = 70;
       const currentX = transformRef.current.x;

       if (currentX < -swipeThreshold) {
           handleSwipeNavigation('next');
       } else if (currentX > swipeThreshold) {
           handleSwipeNavigation('prev');
       } else {
           transformRef.current.x = 0;
           if (imgRef.current) {
               imgRef.current.style.transition = "transform 0.2s ease-out";
               updateImageTransform();
           }
       }
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
            <button onClick={(e) => { e.stopPropagation(); prevSlide(); }} className="absolute left-2 top-1/2 -translate-y-1/2 z-20 bg-black/20 hover:bg-black/40 backdrop-blur-md text-white p-2 rounded-full"><ChevronLeft size={24} /></button>
            <button onClick={(e) => { e.stopPropagation(); nextSlide(); }} className="absolute right-2 top-1/2 -translate-y-1/2 z-20 bg-black/20 hover:bg-black/40 backdrop-blur-md text-white p-2 rounded-full"><ChevronRight size={24} /></button>
            <div className="absolute bottom-4 right-4 flex space-x-2 z-20">
              {CAROUSEL_IMAGES.map((_, index) => (
                <button key={index} onClick={(e) => { e.stopPropagation(); goToSlide(index); }} className={`transition-all duration-300 rounded-full h-1.5 shadow-sm ${index === currentIndex ? 'w-6 bg-white' : 'w-2 bg-white/50 hover:bg-white/80'}`} />
              ))}
            </div>
          </>
        )}
      </div>

      {isZoomOpen && (
        <div className="fixed inset-0 z-[100] bg-white flex items-center justify-center animate-in fade-in duration-200 overflow-hidden" style={{ touchAction: 'none' }}>
          
          <button 
              className="absolute left-4 top-1/2 -translate-y-1/2 z-[110] p-3 rounded-full bg-black/10 text-white/70 hover:bg-black/30 hover:text-white backdrop-blur-[2px] border border-white/5 active:scale-95 transition-all duration-300"
              style={{ opacity: zoomMode ? 0 : 1, pointerEvents: zoomMode ? 'none' : 'auto' }}
              onClick={handleManualPrev}
          >
              <ChevronLeft size={32} strokeWidth={1.5} />
          </button>
          
          <button 
              className="absolute right-4 top-1/2 -translate-y-1/2 z-[110] p-3 rounded-full bg-black/10 text-white/70 hover:bg-black/30 hover:text-white backdrop-blur-[2px] border border-white/5 active:scale-95 transition-all duration-300"
              style={{ opacity: zoomMode ? 0 : 1, pointerEvents: zoomMode ? 'none' : 'auto' }}
              onClick={handleManualNext}
          >
              <ChevronRight size={32} strokeWidth={1.5} />
          </button>

          <button className="absolute top-4 right-4 text-slate-800 p-2.5 rounded-full bg-white/90 shadow-md backdrop-blur-sm z-[110] hover:bg-slate-100 active:scale-95 transition-all" onClick={closeZoom}><X size={24} /></button>
          
          <div className="w-full h-full flex items-center justify-center" onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd}>
            <img ref={imgRef} src={CAROUSEL_IMAGES[currentIndex].url} alt={CAROUSEL_IMAGES[currentIndex].title} className="max-w-full max-h-full object-contain will-change-transform" draggable={false} />
          </div>
          
          <div ref={uiRef} className="absolute inset-0 pointer-events-none flex flex-col justify-between py-8 transition-opacity duration-200 z-[105]">
             <div></div>
             <div className="text-center text-slate-500 pointer-events-auto bg-white/90 backdrop-blur-md mx-6 p-4 rounded-2xl shadow-sm border border-slate-100">
                <h2 className="text-xl font-bold mb-1 text-slate-900">{CAROUSEL_IMAGES[currentIndex].title}</h2>
                <p className="text-sm mb-3">{CAROUSEL_IMAGES[currentIndex].subtitle}</p>
                <div className="flex justify-center gap-2">
                   {CAROUSEL_IMAGES.map((_, idx) => (
                       <div key={idx} className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentIndex ? 'w-6 bg-primary' : 'w-2 bg-slate-300'}`} />
                   ))}
                </div>
             </div>
          </div>
        </div>
      )}
    </>
  );
};