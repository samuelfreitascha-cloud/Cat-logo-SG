
import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, ExternalLink, AlertTriangle, ZoomIn, X } from 'lucide-react';

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

  // Refs para animação direta (Performance Ultra Rápida)
  // Não usamos useState aqui para evitar re-renderizar a cada movimento de pixel
  const imgRef = useRef<HTMLImageElement>(null);
  const transformRef = useRef({ x: 0, y: 0, scale: 1 });
  const lastTouchRef = useRef<{ x: number; y: number; dist: number } | null>(null);
  const initialScaleRef = useRef(1);

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

  const handleZoomOpen = (index: number) => {
    const currentImage = CAROUSEL_IMAGES[index];
    if (imageErrors[index] || (!isDirectLink(currentImage.url) && currentImage.url.includes('ibb.co'))) {
        return;
    }
    setIsZoomOpen(true);
    // Resetar transforms ao abrir
    transformRef.current = { x: 0, y: 0, scale: 1 };
  };

  const closeZoom = () => {
    setIsZoomOpen(false);
    transformRef.current = { x: 0, y: 0, scale: 1 };
  };

  // --- Lógica de Gestos (High Performance) ---

  const updateImageTransform = () => {
    if (imgRef.current) {
      const { x, y, scale } = transformRef.current;
      // Usando translate3d para forçar aceleração de GPU
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
    e.preventDefault(); // Prevenir scroll nativo
    if (!lastTouchRef.current) return;
    
    if (e.touches.length === 2) {
      // Zoom
      const dist = getDistance(e.touches);
      const scaleFactor = dist / lastTouchRef.current.dist;
      // Limite máximo reduzido para 3x para manter qualidade
      const newScale = Math.min(Math.max(initialScaleRef.current * scaleFactor, 1), 3);
      
      transformRef.current.scale = newScale;
      updateImageTransform();

    } else if (e.touches.length === 1 && transformRef.current.scale > 1) {
      // Pan (Arrastar)
      const dx = e.touches[0].pageX - lastTouchRef.current.x;
      const dy = e.touches[0].pageY - lastTouchRef.current.y;
      
      transformRef.current.x += dx;
      transformRef.current.y += dy;

      lastTouchRef.current = {
        ...lastTouchRef.current,
        x: e.touches[0].pageX,
        y: e.touches[0].pageY
      };
      
      updateImageTransform();
    }
  };

  const handleTouchEnd = () => {
    lastTouchRef.current = null;
    // Se escala for menor que 1, reseta suavemente
    if (transformRef.current.scale < 1) {
      transformRef.current = { x: 0, y: 0, scale: 1 };
      if (imgRef.current) {
        imgRef.current.style.transition = "transform 0.3s ease-out";
        updateImageTransform();
        // Remove transição após terminar para voltar a ser responsivo
        setTimeout(() => {
            if (imgRef.current) imgRef.current.style.transition = "none";
        }, 300);
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
      
      setTimeout(() => {
        if (imgRef.current) imgRef.current.style.transition = "none";
      }, 300);
    }
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

        {/* Navegação */}
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
          onClick={closeZoom}
          style={{ touchAction: 'none' }}
        >
          <button 
            className="absolute top-4 right-4 text-slate-800 p-2 rounded-full bg-slate-100 transition-colors z-50 shadow-md"
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
              ref={imgRef}
              src={CAROUSEL_IMAGES[currentIndex].url} 
              alt={CAROUSEL_IMAGES[currentIndex].title}
              className="max-w-full max-h-full object-contain will-change-transform"
              draggable={false}
            />
          </div>
          
          <div className="absolute bottom-8 left-0 right-0 text-center text-slate-500 pointer-events-none">
            <h2 className="text-xl font-bold mb-1 text-slate-900">{CAROUSEL_IMAGES[currentIndex].title}</h2>
            <p className="text-sm">
               Toque duplo para resetar | Pinça para zoom (máx 3x)
            </p>
          </div>
        </div>
      )}
    </>
  );
};
