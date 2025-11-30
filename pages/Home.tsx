

import React, { useState } from 'react';
import { Bell, Search, Umbrella, Armchair, PawPrint, Tag, ArrowLeft, CheckCheck, House } from 'lucide-react';
import { PRODUCTS } from '../constants';
import { ProductCard } from '../components/ProductCard';
import { useNavigate } from 'react-router-dom';
import { HeroCarousel } from '../components/HeroCarousel';
import { LogoMarquee } from '../components/LogoMarquee'; // Importa o novo componente

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const [imgError, setImgError] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Estados para o sistema de Notificação/SMS
  const [showNotifications, setShowNotifications] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<number | null>(null);

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchTerm.trim()) {
      navigate(`/products?q=${encodeURIComponent(searchTerm)}`);
    }
  };

  // Componente interno de Notificações
  const NotificationModal = () => {
    return (
      <div className="fixed inset-0 z-[80] bg-slate-50 flex flex-col animate-in slide-in-from-right duration-300">
        {/* Header da Notificação */}
        <div className="bg-white p-4 shadow-sm border-b border-slate-100 flex items-center gap-3 pt-safe-top">
          <button 
            onClick={() => selectedMessage ? setSelectedMessage(null) : setShowNotifications(false)}
            className="p-2 -ml-2 rounded-full text-slate-600 hover:bg-slate-100"
          >
            <ArrowLeft size={24} />
          </button>
          
          {selectedMessage ? (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                 <img src="https://res.cloudinary.com/drdktfy8u/image/upload/v1764526830/Prancheta_1_apeutg.svg" className="w-6 h-6" />
              </div>
              <div>
                <h2 className="font-bold text-slate-900 text-sm leading-tight">Equipe Grupo Oplin</h2>
                <p className="text-xs text-green-600 flex items-center gap-1">● Online</p>
              </div>
            </div>
          ) : (
            <h2 className="font-bold text-lg text-slate-900">Mensagens</h2>
          )}
        </div>

        {/* Conteúdo */}
        <div className="flex-1 overflow-y-auto p-4">
          {!selectedMessage ? (
            // Lista de Mensagens (Inbox)
            <div className="space-y-2">
              <button 
                onClick={() => setSelectedMessage(1)}
                className="w-full bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex gap-4 active:bg-slate-50 transition-colors text-left"
              >
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary to-cyan-600 rounded-full flex items-center justify-center text-white shadow-md">
                    <img src="https://res.cloudinary.com/drdktfy8u/image/upload/v1764526830/Prancheta_1_apeutg.svg" className="w-7 h-7" />
                  </div>
                  <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></span>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className="font-bold text-slate-900">Equipe Grupo Oplin</h3>
                    <span className="text-xs text-primary font-semibold">10:00</span>
                  </div>
                  <p className="text-sm text-slate-500 truncate font-medium">
                    Teremos novidades em breve! 🚀
                  </p>
                </div>
              </button>
            </div>
          ) : (
            // Detalhe da Mensagem (Chat View)
            <div className="space-y-6">
              <div className="flex justify-center">
                <span className="bg-slate-200 text-slate-600 text-[10px] px-3 py-1 rounded-full font-medium">
                  Hoje
                </span>
              </div>

              {/* Balão da Mensagem */}
              <div className="flex gap-3 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 self-end mb-1">
                   <img src="https://res.cloudinary.com/drdktfy8u/image/upload/v1764526830/Prancheta_1_apeutg.svg" className="w-4 h-4" />
                </div>
                <div className="bg-white p-4 rounded-2xl rounded-bl-none shadow-sm border border-slate-100 max-w-[85%]">
                  <p className="text-slate-800 text-sm leading-relaxed">
                    Olá! Obrigado por acessar nosso catálogo. 
                    <br/><br/>
                    <strong>Teremos novidades em breve!</strong> Fique de olho para não perder os lançamentos da coleção 2026. 🏖️✨
                  </p>
                  <div className="flex justify-end items-center gap-1 mt-2">
                    <span className="text-[10px] text-slate-400">10:00</span>
                  </div>
                </div>
              </div>

              {/* Exemplo de resposta do usuário (visual apenas) */}
              <div className="flex justify-end gap-3 opacity-60">
                 <div className="bg-primary/10 p-3 rounded-2xl rounded-br-none max-w-[80%]">
                    <p className="text-primary-dark text-sm">Combinado! Aguardando.</p>
                    <div className="flex justify-end items-center gap-1 mt-1">
                        <span className="text-[10px] text-primary/60">10:05</span>
                        <CheckCheck size={12} className="text-primary" />
                    </div>
                 </div>
              </div>
            </div>
          )}
        </div>

        {/* Input Falso (Apenas visual para parecer chat) */}
        {selectedMessage && (
            <div className="p-3 bg-white border-t border-slate-100 pb-safe-bottom">
                <div className="bg-slate-100 rounded-full h-12 flex items-center px-4 text-slate-400 text-sm">
                    Responder...
                </div>
            </div>
        )}
      </div>
    );
  };

  return (
    <div className="p-6 pb-24">
      {showNotifications && <NotificationModal />}
      
      {/* Header */}
      <header className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-3">
          <div className="relative w-12 h-12 flex items-center justify-center">
            {!imgError ? (
              <>
                <img 
                  src="https://res.cloudinary.com/drdktfy8u/image/upload/v1764526830/Prancheta_1_apeutg.svg" 
                  alt="Logo Catálogo Grupo Oplin" 
                  className="relative z-10 w-full h-full object-contain"
                  onError={() => setImgError(true)}
                  referrerPolicy="no-referrer"
                />
              </>
            ) : (
              <div className="relative z-10 w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <Umbrella className="text-primary relative z-10" size={28} />
              </div>
            )}
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-800 leading-tight">Catálogo Grupo Oplin</h1>
            <p className="text-xs text-slate-500">Encontre a sombra perfeita</p>
          </div>
        </div>
        
        {/* Botão de Notificação Atualizado */}
        <button 
            onClick={() => setShowNotifications(true)}
            className="relative p-2 rounded-full hover:bg-slate-100 transition-colors active:scale-95"
        >
          <Bell className="text-slate-600" size={24} />
          <span className="absolute top-2 right-2 flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary"></span>
          </span>
        </button>
      </header>
      
      {/* Carrossel de Logos */}
      <LogoMarquee />

      {/* Search */}
      <div className="relative mb-8 group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={20} />
        <input 
          type="text" 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleSearch}
          placeholder="Procurar cadeiras, espreguiçadeiras..." 
          className="w-full pl-12 pr-4 py-3 bg-slate-100 border-transparent focus:bg-white focus:border-primary focus:ring-primary rounded-xl text-slate-700 placeholder-slate-400 transition-all outline-none border-2"
        />
      </div>

      {/* Novo Carrossel Interativo */}
      <HeroCarousel />

      {/* Categories */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4 text-slate-800">Categorias</h3>
        {/* Layout alterado de Grid para Flex Row (Linha única com scroll) */}
        <div className="flex overflow-x-auto gap-4 pb-2 no-scrollbar">
          {[
            { name: 'Praia', icon: Umbrella, color: 'text-primary', bg: 'bg-primary/10' },
            { name: 'Pet Shop', icon: PawPrint, color: 'text-slate-500', bg: 'bg-slate-100' },
            { name: 'Casa', icon: House, color: 'text-slate-500', bg: 'bg-slate-100' },
            { name: 'Ofertas', icon: Tag, color: 'text-slate-500', bg: 'bg-slate-100' },
          ].map((cat, idx) => (
            <button 
              key={idx} 
              onClick={() => navigate(`/products?q=${encodeURIComponent(cat.name)}`)}
              // Adicionado min-w para garantir que os ícones não encolham demais
              className="flex flex-col items-center space-y-2 group min-w-[72px]"
            >
              <div className={`w-16 h-16 ${cat.bg} rounded-2xl flex items-center justify-center transition-all group-hover:scale-95 group-active:scale-90`}>
                <cat.icon className={`${cat.color} text-3xl`} size={28} strokeWidth={1.5} />
              </div>
              <p className="text-xs font-medium text-slate-600">{cat.name}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Popular Products */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-slate-800">Mais Populares</h3>
          <button onClick={() => navigate('/products')} className="text-sm font-medium text-primary hover:text-primary-dark">
            Ver todos
          </button>
        </div>
        <div className="space-y-4">
          {PRODUCTS.slice(0, 2).map(product => (
            <ProductCard key={product.id} product={product} variant="list" />
          ))}
        </div>
      </div>
    </div>
  );
};