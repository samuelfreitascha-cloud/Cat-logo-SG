
import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// Imagens de substituição de alta qualidade (Unsplash) que funcionam garantido.
// Se você tiver os links DIRETOS (terminados em .jpg/.png), pode substituir aqui.
const CAROUSEL_IMAGES = [
  {
    id: 1,
    url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=2158&auto=format&fit=crop',
    title: 'Promoção de Verão',
    subtitle: 'Até 30% OFF em cadeiras de praia!'
  },
  {
    id: 2,
    url: 'https://images.unsplash.com/photo-1594026112284-02bb6f3352fe?q=80&w=2070&auto=format&fit=crop',
    title: 'Conforto Premium',
    subtitle: 'Novas poltronas para sua sala'
  },
  {
    id: 3,
    url: 'https://images.unsplash.com/photo-1519947486511-463999512756?q=80&w=2028&auto=format&fit=crop',
    title: 'Design Moderno',
    subtitle: 'Transforme seu ambiente'
  },
  {
    id: 4,
    url: 'https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?q=80&w=2070&auto=format&fit=crop',
    title: 'Área Externa',
    subtitle: 'Perfeito para seu jardim'
  },
  {
    id: 5,
    url: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?q=80&w=1974&auto=format&fit=crop',
    title: 'Coleção Clássica',
    subtitle: 'Elegância que nunca sai de moda'
  }
];

export const HeroCarousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

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

  return (
    <div className="relative rounded-2xl overflow-hidden mb-8 shadow-xl shadow-slate-200/50 group h-48 md:h-64">
      {/* Imagens */}
      <div className="w-full h-full relative">
        {CAROUSEL_IMAGES.map((image, index) => (
          <div
            key={image.id}
            className={`absolute inset-0 w-full h-full transition-opacity duration-700 ease-in-out ${
              index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          >
            <img
              src={image.url}
              alt={image.title}
              className="w-full h-full object-cover"
            />
            {/* Gradiente e Texto */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-5 flex flex-col justify-end">
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
