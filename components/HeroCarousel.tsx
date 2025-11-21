
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
  const [zoomMode, setZoomMode] = useState(false); // Estado para controlar 2º clique

  // Refs para animação direta (Performance Ultra Rápida)
  const imgRef = useRef<HTMLImageElement>(null);
  const uiRef = useRef<HTMLDivElement>(null); // Controle de UI
  const transformRef = useRef({ x: 0, y: 0, scale: 1 });
  const lastTouchRef = useRef<{ x: number; y: number; dist: number } | null>(null);
  const initialScaleRef = useRef(1);

  // Refs para detecção de TAP (Clique rápido)
  const touchStartTimeRef = useRef(0);
  const touchStartPosRef = useRef({ x: 0, y: 0 });

  // Auto-play
  useEffect(() => {
    if (CAROUSEL_IMAGES.length <= 1) return;
    if (isZoomOpen) return;
    if (imageErrors[currentIndex]) return;

    const currentImage = CAROUSEL_IMAGES[currentIndex];
    if (!isDirectLink(currentImage.url) && currentImage.url.includes('ibb.co')) return;

    const interval = setInterval(() => {
      nextSlide();
    }, 5000); 
    return () => clearInterval(interval);
  }, [currentIndex, imageErrors, isZoomOpen]);

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

  const isDirectLink = (url: string) => {
    return url.includes('i.ibb.co') || url.match(/\.(jpeg|jpg|gif|png)$/i) != null;
  };

  // 1º Clique: Abre o modal (Modo Galeria)
  const handleZoomOpen = (index: number) => {
    const currentImage = CAROUSEL_IMAGES[index];
    if (imageErrors[index] || (!isDirectLink(currentImage.url) && currentImage.url.includes('ibb.co'))) {
        return;
    }
    setIsZoomOpen(true);
    setZoomMode(false);
    transformRef.current = { x: 0, y: 0, scale: 1 };
  };

  const closeZoom = () => {
    setIsZoomOpen(false);
    setZoomMode(false);
    transformRef.current = { x: 0, y: 0, scale: 1 };
  };

  // Funções de navegação dentro do Modal (Agora acionadas por GESTOS)
  const handleSwipeNavigation = (direction: 'next' | 'prev') => {
    const screenWidth = window.innerWidth;
    const exitX = direction === 'next' ? -screenWidth : screenWidth;

    // 1. Anima a imagem atual saindo da tela
    if (imgRef.current) {
        imgRef.current.style.transition = "transform 0.2s ease-out";
        imgRef.current.style.transform = `translate3d(${exitX}px, 0, 0) scale(1)`;
    }

    // 2. Troca o índice e reseta posição após a animação
    setTimeout(() => {
        if (direction === 'next') {
            setCurrentIndex((prev) => (prev + 1) % CAROUSEL_IMAGES.length);
        } else {
            setCurrentIndex((prev) => (prev - 1 + CAROUSEL_IMAGES.length) % CAROUSEL_IMAGES.length);
        }

        // Reset físico
        transformRef.current = { x: 0, y: 0, scale: 1 };
        setZoomMode(false); 

        // 3. Remove transição para reposicionar instantaneamente no centro (nova imagem)
        if (imgRef.current) {
           imgRef.current.style.transition = "none";
           updateImageTransform();
           
           // Opcional: Pequeno fade-in ou slide-in vindo do outro lado poderia ser feito aqui
           // mas o reset instantâneo é padrão em galerias performáticas
        }
    }, 200);
  };

  // Alterna modo zoom
  const performToggleZoom = () => {
      if (zoomMode) {
          // Reset
          setZoomMode(false);
          transformRef.current = { x: 0, y: 0, scale: 1 };
          if (imgRef.current) {
              imgRef.current.style.transition = "transform 0.3s ease-out";
              updateImageTransform();
              setTimeout(() => { if (imgRef.current) imgRef.current.style.transition = "none"; }, 300);
          }
      } else {
          // Habilita Zoom
          setZoomMode(true);
      }
  };

  // --- Lógica de Gestos (High Performance) ---

  const updateImageTransform = () => {
    if (imgRef.current) {
      const { x, y, scale } = transformRef.current;
      imgRef.current.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${scale})`;
    }
  };

  // Atualiza UI baseado no modo
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
    // Registra dados para detecção de TAP
    touchStartTimeRef.current = Date.now();
    touchStartPosRef.current = { x: e.touches[0].pageX, y: e.touches[0].pageY };

    // Detecção de Pinça (2 dedos) ativa automaticamente o modo zoom
    if (e.touches.length === 2) {
      if (!zoomMode) setZoomMode(true);

      const dist = getDistance(e.touches);
      lastTouchRef.current = { x: 0, y: 0, dist };
      initialScaleRef.current = transformRef.current.scale;
    } 
    // 1 dedo
    else if (e.touches.length === 1) {
      // Permite arrastar se estiver com Zoom OU se estiver em escala 1 (Swipe)
      lastTouchRef.current = { 
        x: e.touches[0].pageX, 
        y: e.touches[0].pageY, 
        dist: 0 
      };
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    // Se não for modo zoom E não for swipe (escala 1), ignora
    // Mas agora queremos swipe em escala 1, então permitimos se tiver touch
    
    if (e.cancelable) e.preventDefault();
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
      
      if (transformRef.current.scale > 1) {
          // --- MODO ZOOM: PAN COM LIMITES (Clamping) ---
          if (imgRef.current) {
            const currentScale = transformRef.current.scale;
            const imgWidth = imgRef.current.offsetWidth * currentScale;
            const imgHeight = imgRef.current.offsetHeight * currentScale;
            
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;

            const maxOffsetX = Math.max(0, (imgWidth - viewportWidth) / 2);
            const maxOffsetY = Math.max(0, (imgHeight - viewportHeight) / 2);

            let nextX = transformRef.current.x + dx;
            let nextY = transformRef.current.y + dy;

            nextX = Math.max(-maxOffsetX, Math.min(maxOffsetX, nextX));
            nextY = Math.max(-maxOffsetY, Math.min(maxOffsetY, nextY));
            
            transformRef.current.x = nextX;
            transformRef.current.y = nextY;
          }
      } else {
          // --- MODO NORMAL: SWIPE LIVRE (Sem Clamping Horizontal) ---
          // Permite arrastar para os lados livremente para indicar navegação
          transformRef.current.x += dx;
          // Ignora Y no swipe de galeria
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

    // Lógica de TAP (Clique rápido)
    if (timeDiff < 300 && distDiff < 20 && e.changedTouches.length === 1) {
        performToggleZoom();
        lastTouchRef.current = null;
        return;
    }

    // Lógica de SWIPE (Troca de Slide) se escala for 1
    if (transformRef.current.scale === 1) {
        const swipeThreshold = 70; // Distância mínima para trocar
        
        if (transformRef.current.x < -swipeThreshold) {
            // Arrastou para esquerda -> PRÓXIMO
            handleSwipeNavigation('next');
        } else if (transformRef.current.x > swipeThreshold) {
            // Arrastou para direita -> ANTERIOR
            handleSwipeNavigation('prev');
        } else {
            // Não arrastou o suficiente -> BOUNCE BACK (Volta pro meio)
            if (transformRef.current.x !== 0) {
                transformRef.current.x = 0;
                if (imgRef.current) {
                    imgRef.current.style.transition = "transform 0.2s ease-out";
                    updateImageTransform();
                    setTimeout(() => { if (imgRef.current) imgRef.current.style.transition = "none"; }, 200);
                }
            }
        }
    } 
    // Lógica de REBOTE do Zoom (se diminuir menos que 1)
    else if (transformRef.current.scale < 1) {
      transformRef.current = { x: 0, y: 0, scale: 1 };
      if (imgRef.current) {
        imgRef.current.style.transition = "transform 0.3s ease-out";
        updateImageTransform();
        setTimeout(() => {
            if (imgRef.current) imgRef.current.style.transition = "none";
        }, 300);
      }
    }

    lastTouchRef.current = null;
  };

  return (
    <>
      <div className="relative rounded-2xl overflow-hidden mb-8 shadow-xl shadow-slate-200/50 group h-64 md:h-80 bg-slate-200 cursor-pointer"
           onClick={() => handleZoomOpen(currentIndex)}
      >
        {/* Imagens */}
        <div className="w-full h-full relative">
          {CAROUSEL_IMAGES.map((image, index) => {
            const looksWrong = !isDirectLink(image.url) && image.url.includes('ibb.co');
            
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
                    <a 
                      href={image.url} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-full mt-4 text-xs font-bold"
                    >
                      Abrir Link Original
                    </a>
                  </div>
                )}
                
                {!imageErrors[index] && !looksWrong && (
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent p-6 flex flex-col justify-end pointer-events-none">
                    <h2 className="text-white text-2xl font-bold mb-1 drop-shadow-md">
                      {image.title}
                    </h2>
                    <p className="text-slate-200 text-sm drop-shadow-sm font-medium">
                      {image.subtitle}
                    </p>
                    <div className="absolute top-4 right-4 bg-black/30 backdrop-blur-sm p-2 rounded-full text-white/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <ZoomIn size={20} />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Navegação Principal */}
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

      {/* Modal de Zoom Interativo Otimizado */}
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
          
          {/* UI Control: Apenas Título e Pontinhos (Botões de navegação removidos para usar Swipe) */}
          <div ref={uiRef} className="absolute inset-0 pointer-events-none flex flex-col justify-between py-8 transition-opacity duration-200">
             {/* Área Superior */}
             <div></div>

             {/* Rodapé com Título e Dots */}
             <div className="text-center text-slate-500 pointer-events-auto bg-white/90 backdrop-blur-md mx-6 p-4 rounded-2xl shadow-sm border border-slate-100">
                <h2 className="text-xl font-bold mb-1 text-slate-900">{CAROUSEL_IMAGES[currentIndex].title}</h2>
                <p className="text-sm mb-3">
                   {CAROUSEL_IMAGES[currentIndex].subtitle}
                </p>
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
