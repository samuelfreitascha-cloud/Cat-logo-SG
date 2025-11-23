
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
  
  // Estado para controlar o "Modo Zoom" (2º clique)
  const [zoomMode, setZoomMode] = useState(false);
  
  // Refs para animação direta (High Performance)
  const imgRef = useRef<HTMLImageElement>(null);
  const uiRef = useRef<HTMLDivElement>(null); // Ref para elementos da interface que somem
  const transformRef = useRef({ x: 0, y: 0, scale: 1 });
  const lastTouchRef = useRef<{ x: number; y: number; dist: number } | null>(null);
  const initialScaleRef = useRef(1);
  const rafRef = useRef<number | null>(null); // Request Animation Frame
  
  // Controle de Animação e Segurança
  const isAnimatingRef = useRef(false); // Trava para evitar toques durante animação
  const animationStartTimeRef = useRef(0); // Timestamp para destravar

  // Cache de Layout para evitar reflow (Layout Thrashing)
  const layoutCacheRef = useRef({
    imgWidth: 0,
    imgHeight: 0,
    viewportWidth: 0,
    viewportHeight: 0
  });

  // Refs para detecção de TAP (Clique rápido)
  const touchStartTimeRef = useRef(0);
  const touchStartPosRef = useRef({ x: 0, y: 0 });

  // Determina as imagens a serem usadas (Galeria ou Imagem única)
  const images = product.gallery && product.gallery.length > 0 ? product.gallery : [product.image];

  // URL da imagem atual (pode ser da galeria ou a imagem de informação)
  const currentImageSrc = showInfoImage && product.infoImage ? product.infoImage : images[activeImageIndex];

  // Verifica se é um link de WhatsApp para mudar o ícone e cor
  const isWhatsApp = product.externalUrl && (product.externalUrl.includes('wa.me') || product.externalUrl.includes('whatsapp'));

  const handleActionClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (product.externalUrl) {
      window.open(product.externalUrl, '_blank');
    } else {
      addToCart(product);
    }
  };

  // SEGURANÇA CONTRA TRAVAMENTO:
  // Sempre que a imagem muda, reseta transforms
  useEffect(() => {
    if (isZoomOpen) {
        transformRef.current = { x: 0, y: 0, scale: 1 };
        if (imgRef.current) {
            imgRef.current.style.transition = 'none';
            imgRef.current.style.transform = 'translate3d(0,0,0) scale(1)';
        }
        // Libera a animação (Redundância 1)
        setTimeout(() => { isAnimatingRef.current = false; }, 100);
    }
  }, [activeImageIndex, showInfoImage, isZoomOpen]);

  // --- Lógica de Gestos ---

  const updateImageTransform = () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      if (imgRef.current) {
        const { x, y, scale } = transformRef.current;
        imgRef.current.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${scale})`;
      }
    });
  };

  // Atualiza a UI baseada no MODO (zoomMode) e não na escala
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
    // FAILSAFE: Se estiver "animando" há mais de 300ms, é um bug. Destrava.
    if (isAnimatingRef.current) {
        if (Date.now() - animationStartTimeRef.current > 300) {
            isAnimatingRef.current = false;
        } else {
            return;
        }
    }

    // IMPORTANTE: Mata qualquer transição anterior IMEDIATAMENTE
    if (imgRef.current) {
        imgRef.current.style.transition = 'none';
    }

    // Registra dados para detecção de TAP
    touchStartTimeRef.current = Date.now();
    touchStartPosRef.current = { x: e.touches[0].pageX, y: e.touches[0].pageY };

    // CACHE DE LAYOUT: Mede tudo agora para não medir durante o movimento
    if (imgRef.current) {
        layoutCacheRef.current = {
            imgWidth: imgRef.current.offsetWidth,
            imgHeight: imgRef.current.offsetHeight,
            viewportWidth: window.innerWidth,
            viewportHeight: window.innerHeight
        };
    }

    // Se detectar 2 dedos, ativa o zoomMode automaticamente e inicia o cálculo
    if (e.touches.length === 2) {
      if (!zoomMode) setZoomMode(true); // Ativação automática
      
      const dist = getDistance(e.touches);
      lastTouchRef.current = { x: 0, y: 0, dist };
      initialScaleRef.current = transformRef.current.scale;
    } 
    // Se for 1 dedo
    else if (e.touches.length === 1) {
      lastTouchRef.current = { 
        x: e.touches[0].pageX, 
        y: e.touches[0].pageY, 
        dist: 0 
      };
    }
  };

  const handleSwipeNavigation = (direction: 'next' | 'prev') => {
    // Verifica se já está animando recentemente
    if (isAnimatingRef.current && Date.now() - animationStartTimeRef.current < 300) return;

    // Não faz nada se for imagem única e não for Saber Mais
    if (images.length <= 1 && !showInfoImage) {
        // Reset visual apenas
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

        // useEffect cuidará do reset visual
        setZoomMode(false);

        // Redundância 2: Força destravamento
        setTimeout(() => { isAnimatingRef.current = false; }, 50);
    }, 200);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.cancelable) e.preventDefault();
    if (isAnimatingRef.current) return;
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
      
      // SE A ESCALA FOR > 1.1: MODO PAN (Zoom)
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
          // SE A ESCALA FOR 1: MODO SWIPE (Galeria)
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
    if (isAnimatingRef.current) return;
    
    const timeDiff = Date.now() - touchStartTimeRef.current;
    const touchEndPos = e.changedTouches[0];
    const distDiff = Math.hypot(
        touchEndPos.pageX - touchStartPosRef.current.x,
        touchEndPos.pageY - touchStartPosRef.current.y
    );

    // TAP
    if (timeDiff < 300 && distDiff < 20 && e.changedTouches.length === 1) {
        performToggleZoom();
        lastTouchRef.current = null;
        return;
    }
    
    // PROTEÇÃO CRÍTICA:
    // Se estiver com zoom (> 1.1), NUNCA muda de slide.
    if (transformRef.current.scale > 1.1) {
       lastTouchRef.current = null;
       return;
    }

    // Se estiver com zoom mínimo (entre 1 e 1.1), reseta para 1.0
    if (transformRef.current.scale > 1 && transformRef.current.scale <= 1.1) {
        transformRef.current = { x: 0, y: 0, scale: 1 };
        setZoomMode(false);
        if (imgRef.current) {
            imgRef.current.style.transition = "transform 0.3s ease-out";
            updateImageTransform();
            setTimeout(() => { if (imgRef.current) imgRef.current.style.transition = "none"; }, 300);
        }
        lastTouchRef.current = null;
        return;
    }

    // SWIPE LOGIC
    // Só executa se a escala for 1.0 (ou menor durante bounce)
    const swipeThreshold = 70;
    if (transformRef.current.x < -swipeThreshold) {
        handleSwipeNavigation('next');
    } else if (transformRef.current.x > swipeThreshold) {
        handleSwipeNavigation('prev');
    } else {
        // Reset / Bounce back
        transformRef.current = { x: 0, y: 0, scale: 1 };
        if (imgRef.current) {
            imgRef.current.style.transition = "transform 0.2s ease-out";
            updateImageTransform();
            setTimeout(() => { if (imgRef.current) imgRef.current.style.transition = "none"; }, 200);
        }
    }
    
    lastTouchRef.current = null;
  };

  // 1º Clique: Abre o Modal (List/Grid -> Modal)
  const openZoom = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveImageIndex(0);
    setShowInfoImage(false);
    setIsZoomOpen(true);
    setZoomMode(false); // Começa no modo Galeria (sem zoom habilitado)
    transformRef.current = { x: 0, y: 0, scale: 1 };
    isAnimatingRef.current = false; // Garante destravamento ao abrir
  };

  const closeZoom = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setIsZoomOpen(false);
    setShowInfoImage(false);
    setZoomMode(false);
    transformRef.current = { x: 0, y: 0, scale: 1 };
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    isAnimatingRef.current = false; // Garante destravamento ao fechar
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
    setZoomMode(false); // Reseta o modo ao trocar de tela
  };

  // --- Renderização dos Ícones de Ação ---
  const renderActionButton = (isList: boolean) => {
    const buttonClasses = isList 
      ? `p-2 px-3 rounded-full transition-colors flex items-center justify-center ${
          product.externalUrl && isWhatsApp
            ? 'bg-green-100 text-green-700 hover:bg-green-600 hover:text-white' 
            : 'bg-primary/10 text-primary hover:bg-primary hover:text-white'
        }`
      : `p-2 px-3 rounded-lg text-white transition-colors shadow-md active:scale-95 flex items-center justify-center ${
          product.externalUrl && isWhatsApp
            ? 'bg-green-600 hover:bg-green-700 shadow-green-200' 
            : 'bg-primary hover:bg-primary-dark shadow-cyan-200'
        }`;

    return (
      <button onClick={handleActionClick} className={buttonClasses}>
        {product.externalUrl ? (
          isWhatsApp ? (
            <MessageCircle size={isList ? 20 : 18} />
          ) : (
            <div className="flex items-center gap-1.5">
                <ShoppingBag size={isList ? 18 : 16} strokeWidth={2.5} />
                <Plus 
                    size={isList ? 14 : 12} 
                    strokeWidth={3} 
                />
            </div>
          )
        ) : (
          <Plus size={isList ? 20 : 16} />
        )}
      </button>
    );
  };

  const ZoomModal = () => {
    // Aplicar zoom inicial para produto Veneza (apenas se não for infoImage e for o produto específico)
    const isVenezaInitial = product.id === '1' && !showInfoImage && activeImageIndex === 0;

    useEffect(() => {
        if (uiRef.current) {
            uiRef.current.style.opacity = '1';
            uiRef.current.style.transition = 'opacity 0.3s ease';
        }
    }, []);
    
    return (
      <div 
        className="fixed inset-0 z-[60] bg-white flex flex-col animate-in fade-in duration-200"
        style={{ touchAction: 'none' }}
      >
        {/* Botão Fechar FIXO - Fora do container que some */}
        <button 
            className="absolute top-4 right-4 z-[70] text-slate-800 p-2.5 rounded-full bg-white/90 backdrop-blur-sm shadow-md border border-slate-100 hover:bg-slate-100 transition-colors active:scale-95"
            onClick={closeZoom}
        >
            <X size={24} />
        </button>

        {/* Container de Interface que desaparece no Modo Zoom */}
        <div ref={uiRef} className="absolute inset-0 z-[65] pointer-events-none flex flex-col justify-between p-4 transition-opacity duration-300">
             {/* Título Flutuante */}
             <div className="mt-2 pointer-events-auto self-start">
                 <h2 className="text-xl font-bold text-slate-900 bg-white/90 backdrop-blur-md px-4 py-2 rounded-xl shadow-sm inline-block">
                     {product.name}
                 </h2>
             </div>

             {/* Setas de Navegação */}
             {!showInfoImage && images.length > 1 && (
                 <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 flex justify-between px-4 pointer-events-auto">
                    <button onClick={prevImage} className="bg-white/90 p-3 rounded-full shadow-lg text-slate-800 hover:bg-white active:scale-95 border border-slate-100"><ChevronLeft size={24} /></button>
                    <button onClick={nextImage} className="bg-white/90 p-3 rounded-full shadow-lg text-slate-800 hover:bg-white active:scale-95 border border-slate-100"><ChevronRight size={24} /></button>
                 </div>
             )}

             {/* Rodapé com Galeria e Botão Saber Mais */}
             <div className="pointer-events-auto bg-white/90 backdrop-blur-md rounded-2xl p-4 shadow-lg border border-slate-100 flex flex-col items-center gap-4 mt-auto">
                 
                 {/* Botão Saber Mais / Voltar */}
                  {product.infoImage && (
                    <button 
                      onClick={toggleInfoImage}
                      className={`flex items-center gap-2 px-6 py-2.5 rounded-full font-semibold text-sm shadow-sm transition-all active:scale-95 ${
                        showInfoImage 
                          ? 'bg-slate-100 text-slate-700 hover:bg-slate-200' 
                          : 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-200'
                      }`}
                    >
                      {showInfoImage ? (
                        <>
                          <ImageIcon size={18} />
                          Voltar para fotos
                        </>
                      ) : (
                        <>
                          <Info size={18} />
                          Saber mais
                        </>
                      )}
                    </button>
                  )}

                  {!showInfoImage && (
                    <>
                      <p className="text-xs text-slate-400 uppercase font-medium tracking-wider">
                        {activeImageIndex + 1} / {images.length}
                      </p>
                      {images.length > 1 && (
                        <div className="flex gap-2 overflow-x-auto max-w-full px-2 no-scrollbar py-1 w-full justify-center">
                          {images.map((img, idx) => (
                            <button
                              key={idx}
                              onClick={(e) => { e.stopPropagation(); setActiveImageIndex(idx); }}
                              className={`relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-all ${
                                activeImageIndex === idx ? 'border-primary ring-2 ring-primary/20' : 'border-transparent opacity-60 hover:opacity-100'
                              }`}
                            >
                              <img src={img} alt="" className="w-full h-full object-cover" />
                            </button>
                          ))}
                        </div>
                      )}
                    </>
                  )}
             </div>
        </div>
        
        {/* Área da Imagem */}
        <div 
          className="flex-1 w-full h-full bg-white overflow-hidden"
        >
            <div 
                className="w-full h-full flex items-center justify-center"
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
            >
              <img 
                ref={imgRef}
                src={currentImageSrc} 
                alt={showInfoImage ? "Detalhes Técnicos" : product.name}
                className={`max-w-full max-h-full object-contain will-change-transform px-4 ${isVenezaInitial ? 'scale-150' : ''}`}
                draggable={false}
                style={isVenezaInitial && transformRef.current.scale === 1 ? { transform: 'scale(1.5)' } : undefined}
              />
            </div>
        </div>
      </div>
    );
  };

  if (variant === 'list') {
    return (
      <>
        <div className="flex items-center bg-white p-3 rounded-xl shadow-sm border border-slate-100">
          <div className="relative cursor-pointer group" onClick={openZoom}>
            <div className={`w-20 h-20 overflow-hidden bg-white rounded-lg mr-4 border border-slate-50 ${product.id === '1' ? 'flex items-center justify-center' : ''}`}>
               <img 
                 src={product.image} 
                 alt={product.name} 
                 className={`w-full h-full object-contain bg-white ${product.id === '1' ? 'scale-150' : ''}`} 
               />
            </div>
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors rounded-lg flex items-center justify-center mr-4">
               <ZoomIn className="text-slate-800 opacity-0 group-hover:opacity-100 transition-opacity bg-white/80 p-1 rounded-full" size={18} />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <h4 
              onClick={openZoom}
              className="font-semibold text-slate-800 truncate cursor-pointer hover:text-primary transition-colors"
            >
              {product.name}
            </h4>
            <p className="text-sm text-slate-500 truncate">{product.description}</p>
            <p className="text-md font-bold text-primary mt-1">R$ {product.price.toFixed(2).replace('.', ',')}</p>
          </div>
          {renderActionButton(true)}
        </div>
        {isZoomOpen && <ZoomModal />}
      </>
    );
  }

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden group flex flex-col h-full">
        <div className="relative aspect-square bg-white overflow-hidden cursor-pointer" onClick={openZoom}>
          <img 
            src={product.image} 
            alt={product.name} 
            className={`w-full h-full object-contain p-2 transition-transform duration-500 group-hover:scale-105 ${product.id === '1' ? 'scale-150' : ''}`} 
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/5 transition-colors">
             <ZoomIn className="text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity bg-white/80 p-1.5 rounded-full shadow-sm" size={28} />
          </div>
          {images.length > 1 && (
            <div className="absolute bottom-2 right-2 bg-black/50 backdrop-blur-sm text-white text-[10px] px-1.5 py-0.5 rounded flex items-center">
              <span className="mr-1 font-bold">{images.length}</span> fotos
            </div>
          )}
        </div>
        <div className="p-3 flex flex-col flex-grow">
          <h3 
            onClick={openZoom}
            className="font-semibold text-slate-800 truncate cursor-pointer hover:text-primary transition-colors"
          >
            {product.name}
          </h3>
          <p className="text-xs text-slate-500 mb-2 truncate">{product.description}</p>
          <div className="mt-auto flex justify-between items-center">
            <span className="font-bold text-base text-slate-900">R$ {product.price.toFixed(2).replace('.', ',')}</span>
            {renderActionButton(false)}
          </div>
        </div>
      </div>
      {isZoomOpen && <ZoomModal />}
    </>
  );
};
