
import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ImageOff, ExternalLink, AlertTriangle } from 'lucide-react';

// Configuração das imagens do Carrossel
// Agora todas as imagens possuem links diretos corretos
const CAROUSEL_IMAGES = [
  {
    id: 1,
    url: 'https://i.ibb.co/XxMPPLzh/3.png', 
    title: 'Coleção Verão 2024',
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
  }
];

export const HeroCarousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({});

  // Auto-play apenas se houver mais de uma imagem
  useEffect(() => {
    if (CAROUSEL_IMAGES.length <= 1) return;
    
    // Pausa o carrossel se estiver mostrando erro, para dar tempo de ler
    if (imageErrors[currentIndex]) return;

    const interval = setInterval(() => {
      nextSlide();
    }, 5000); // 5 segundos por slide
    return () => clearInterval(interval);
  }, [currentIndex, imageErrors]);

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
    return url.includes('i.ibb.co') || url.match(/\.(jpeg|jpg|gif|png)$/) != null;
  };

  return (
    <div className="relative rounded-2xl overflow-hidden mb-8 shadow-xl shadow-slate-200/50 group h-64 md:h-80 bg-slate-200">
      {/* Imagens */}
      <div className="w-full h-full relative">
        {CAROUSEL_IMAGES.map((image, index) => {
          // Verifica se parece um link errado antes mesmo de carregar
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
                // Tela de ajuda caso o link esteja errado ou imagem falhe
                <div className="w-full h-full flex flex-col items-center justify-center bg-slate-800 text-white p-4 text-center font-sans">
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
              
              {/* Texto sobre a imagem (só aparece se estiver tudo certo) */}
              {!imageErrors[index] && !looksWrong && (
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent p-6 flex flex-col justify-end pointer-events-none">
                  <h2 className="text-white text-2xl font-bold mb-1 drop-shadow-md">
                    {image.title}
                  </h2>
                  <p className="text-slate-200 text-sm drop-shadow-sm font-medium">
                    {image.subtitle}
                  </p>
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
                onClick={() => goToSlide(index)}
                className={`transition-all duration-300 rounded-full h-1.5 shadow-sm ${
                  index === currentIndex ? 'w-6 bg-white' : 'w-2 bg-white/50 hover:bg-white/80'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};
