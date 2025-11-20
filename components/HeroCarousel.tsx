
import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ImageOff } from 'lucide-react';

// Links fornecidos pelo usuário
const CAROUSEL_IMAGES = [
  {
    id: 1,
    url: 'https://ibb.co/m5gKKTHL', 
    title: 'Promoção de Verão',
    subtitle: 'Até 30% OFF em cadeiras de praia!'
  },
  {
    id: 2,
    url: 'https://ibb.co/kgJzWxML',
    title: 'Novos Modelos',
    subtitle: 'Conforto e estilo'
  },
  {
    id: 3,
    url: 'https://ibb.co/4wbJw5SZ',
    title: 'Design Exclusivo',
    subtitle: 'Para sua casa'
  },
  {
    id: 4,
    url: 'https://ibb.co/3yyr081G',
    title: 'Área Externa',
    subtitle: 'Perfeito para seu jardim'
  },
  {
    id: 5,
    url: 'https://ibb.co/zWqj6mVH',
    title: 'Coleção Premium',
    subtitle: 'Qualidade garantida'
  }
];

export const HeroCarousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({});

  // Auto-play: Muda a imagem a cada 4 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 4000);
    return () => clearInterval(interval);
  }, [currentIndex]);

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

  return (
    <div className="relative rounded-2xl overflow-hidden mb-8 shadow-xl shadow-slate-200/50 group h-48 md:h-64 bg-slate-200">
      {/* Imagens */}
      <div className="w-full h-full relative">
        {CAROUSEL_IMAGES.map((image, index) => (
          <div
            key={image.id}
            className={`absolute inset-0 w-full h-full transition-opacity duration-700 ease-in-out ${
              index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          >
            {!imageErrors[index] ? (
              <img
                src={image.url}
                alt={image.title}
                className="w-full h-full object-cover"
                onError={() => handleImageError(index)}
              />
            ) : (
              // Fallback caso a imagem do ibb.co não carregue diretamente
              <div className="w-full h-full flex flex-col items-center justify-center bg-slate-800 text-white p-4 text-center">
                <ImageOff size={48} className="mb-2 opacity-50" />
                <p className="font-bold text-sm">Não foi possível carregar a imagem</p>
                <p className="text-xs text-slate-400 mt-1">O link precisa ser direto (.jpg/.png)</p>
                <a href={image.url} target="_blank" rel="noreferrer" className="text-xs text-blue-400 underline mt-2">
                  Ver Imagem Original
                </a>
              </div>
            )}
            
            {/* Gradiente e Texto (apenas se não deu erro ou se quiser mostrar sobre o erro) */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-5 flex flex-col justify-end pointer-events-none">
              <h2 className="text-white text-xl font-bold transform translate-y-0 transition-transform duration-500">
                {image.title}
              </h2>
              <p className="text-slate-200 text-sm transform translate-y-0 transition-transform duration-500 delay-100">
                {image.subtitle}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Botões de Navegação (Setas) */}
      <button
        onClick={(e) => { e.stopPropagation(); prevSlide(); }}
        className="absolute left-2 top-1/2 -translate-y-1/2 z-20 bg-white/30 hover:bg-white/50 backdrop-blur-sm text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <ChevronLeft size={24} />
      </button>
      <button
        onClick={(e) => { e.stopPropagation(); nextSlide(); }}
        className="absolute right-2 top-1/2 -translate-y-1/2 z-20 bg-white/30 hover:bg-white/50 backdrop-blur-sm text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <ChevronRight size={24} />
      </button>

      {/* Indicadores (Bolinhas) */}
      <div className="absolute bottom-4 right-4 flex space-x-1.5 z-20">
        {CAROUSEL_IMAGES.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`transition-all duration-300 rounded-full h-1 ${
              index === currentIndex ? 'w-6 bg-white' : 'w-2 bg-white/40 hover:bg-white/60'
            }`}
          />
        ))}
      </div>
    </div>
  );
};
