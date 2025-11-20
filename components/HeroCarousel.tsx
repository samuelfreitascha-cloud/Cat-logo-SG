
import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, ImageOff, ExternalLink, AlertTriangle, ZoomIn, X } from 'lucide-react';

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

  // Estados para o Zoom e Pan (Gestos)
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  
  // Refs para cálculos de gestos sem re-renderizar desnecessariamente
  const imageRef = useRef<HTMLImageElement>(null);
  const lastTouchRef = useRef<{ x: number; y: number; dist: number } | null>(null);
  const initialScaleRef = useRef(1);

  // Auto-play apenas se houver mais de uma imagem
  useEffect(() => {
    if (CAROUSEL_IMAGES.length <= 1) return;
    
    // Pausa se o modal de zoom estiver aberto
    if (isZoomOpen) return;

    // Pausa o carrossel se estiver mostrando erro
    if (imageErrors[currentIndex]) return;

    // Pausa se o link não for direto (modo ajuda)
    const currentImage = CAROUSEL_IMAGES[currentIndex];
    if (!isDirectLink(currentImage.url) && currentImage.url.includes('ibb.co')) return;

    const interval = setInterval(() => {
      nextSlide();
    }, 5000); // 5 segundos por slide
    return () => clearInterval(interval);
  }, [currentIndex, imageErrors, isZoomOpen]);

  // Resetar zoom ao abrir/fechar modal ou mudar slide
  useEffect(() => {
    if (!isZoomOpen) {
      setScale(1);
      setPosition({ x: 0, y: 0 });
    }
  }, [isZoomOpen, currentIndex]);

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
  };

  // --- Lógica de Gestos (Touch) ---

  const getDistance = (touches: React.TouchList) => {
    return Math.hypot(
      touches[0].pageX - touches[1].pageX,
      touches[0].pageY - touches[1].pageY
    );
  };

  const getMidpoint = (touches: React.TouchList) => {
    return {
      x: (touches[0].pageX + touches[1].pageX) / 2,
      y: (touches[0].pageY + touches[1].pageY) / 2,
    };
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      // Início do Zoom (Pinça)
      const dist = getDistance(e.touches);
      lastTouchRef.current = { x: 0, y: 0, dist };
      initialScaleRef.current = scale;
    } else if (e.touches.length === 1 && scale > 1) {
      // Início do Pan (Arrastar) - só se estiver com zoom
      lastTouchRef.current = { 
        x: e.touches[0].pageX, 
        y: e.touches[0].pageY, 
        dist: 0 
      };
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    e.preventDefault(); // Evita scroll da página no mobile
    
    if (e.touches.length === 2 && lastTouchRef.current) {
      // Calculando Zoom
      const dist = getDistance(e.touches);
      const scaleFactor = dist / lastTouchRef.current.dist;
      // Limita o zoom entre 1x e 4x
      const newScale = Math.min(Math.max(initialScaleRef.current * scaleFactor, 1), 4);
      setScale(newScale);
    } else if (e.touches.length === 1 && scale > 1 && lastTouchRef.current) {
      // Calculando Pan
      const dx = e.touches[0].pageX - lastTouchRef.current.x;
      const dy = e.touches[0].pageY - lastTouchRef.current.y;
      
      setPosition(prev => ({
        x: prev.x + dx,
        y: prev.y + dy
      }));

      lastTouchRef.current = {
        ...lastTouchRef.current,
        x: e.touches[0].pageX,
        y: e.touches[0].pageY
      };
    }
  };

  const handleTouchEnd = () => {
    lastTouchRef.current = null;
    // Snap back se escala for menor que 1 (opcional, já limitado no move)
    if (scale < 1) {
      setScale(1);
      setPosition({ x: 0, y: 0 });
    }
  };

  const handleDoubleTap = () => {
    if (scale > 1) {
      setScale(1);
      setPosition({ x: 0, y: 0 });
    } else {
      setScale(2.5); // Zoom rápido
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
                    <h3 className="font-bold text-base mb-1">Link da Imagem {index + 1} Incorreto</h3>
                    
                    <div className="bg-slate-700/50 p-3 rounded-lg text-left text-xs text-slate-200 w-full max-w-xs border border-slate-600">
                      <p className="mb-2">O link atual abre o <b>site</b>, não a <b>foto</b>.</p>
                      <p className="font-bold text-yellow-400 mb-1">Como corrigir:</p>
                      <ol className="list-decimal list-inside space-y-1 opacity-90">
                        <li>Clique em "Abrir Link" abaixo</li>
                        <li>No site, clique com <b>botão direito</b> na foto</li>
                        <li>Selecione <b>"Copiar endereço da imagem"</b></li>
                        <li>Me envie o link copiado!</li>
                      </ol>
                      <p className="mt-2 text-[10px] text-slate-400">Dica: O link certo começa com <b>i.ibb.co</b></p>
                    </div>

                    <a 
                      href={image.url} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-full mt-4 text-xs font-bold transition-colors"
                    >
                      Abrir Link da Imagem {index + 1} <ExternalLink size={14} />
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

        {/* Setas de Navegação */}
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

      {/* Modal de Zoom Interativo */}
      {isZoomOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black flex items-center justify-center animate-in fade-in duration-200 overflow-hidden"
          onClick={() => setIsZoomOpen(false)}
          style={{ touchAction: 'none' }} // Importante para previnir scroll do body
        >
          <button 
            className="absolute top-4 right-4 text-white/70 hover:text-white p-2 rounded-full bg-white/10 backdrop-blur-md transition-colors z-50"
            onClick={() => setIsZoomOpen(false)}
          >
            <X size={32} />
          </button>
          
          {/* Container da Imagem com Eventos de Touch */}
          <div 
            className="w-full h-full flex items-center justify-center"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onDoubleClick={handleDoubleTap}
            onClick={(e) => e.stopPropagation()}
          >
            <img 
              ref={imageRef}
              src={CAROUSEL_IMAGES[currentIndex].url} 
              alt={CAROUSEL_IMAGES[currentIndex].title}
              className="max-w-full max-h-full object-contain transition-transform duration-75 ease-out"
              style={{
                transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
                cursor: scale > 1 ? 'grab' : 'zoom-in'
              }}
              draggable={false}
            />
          </div>
          
          <div className="absolute bottom-8 left-0 right-0 text-center text-white pointer-events-none">
            <h2 className="text-xl font-bold mb-1 drop-shadow-md">{CAROUSEL_IMAGES[currentIndex].title}</h2>
            <p className="text-white/80 text-sm drop-shadow-md">
               {scale > 1 ? 'Toque duplo para resetar' : 'Faça o gesto de pinça para zoom'}
            </p>
          </div>
        </div>
      )}
    </>
  );
};
