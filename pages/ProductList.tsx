
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Search, Filter, ArrowUpDown, Grid as GridIcon, List, X } from 'lucide-react';
import { PRODUCTS } from '../constants';
import { ProductCard } from '../components/ProductCard';

export const ProductList: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Estado para controlar se a busca está aberta no header
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  
  // Pega o termo da URL ou usa vazio
  const initialQuery = searchParams.get('q') || '';
  const [searchTerm, setSearchTerm] = useState(initialQuery);

  // Atualiza o termo local quando a URL muda (ex: vindo da Home)
  useEffect(() => {
    setSearchTerm(searchParams.get('q') || '');
    if (searchParams.get('q')) {
      setIsSearchOpen(true);
    }
  }, [searchParams]);

  // Filtra os produtos
  const filteredProducts = PRODUCTS.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    // Atualiza a URL sem recarregar a página
    setSearchParams(value ? { q: value } : {});
  };

  const clearSearch = () => {
    setSearchTerm('');
    setSearchParams({});
    setIsSearchOpen(false);
  };

  return (
    <div className="min-h-screen bg-background-light pb-20">
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md p-4 border-b border-slate-100 transition-all">
        <div className="flex justify-between items-center h-10">
          {isSearchOpen ? (
            <div className="flex items-center w-full gap-2 animate-in fade-in slide-in-from-right-5 duration-200">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  autoFocus
                  type="text"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  placeholder="Buscar..."
                  className="w-full bg-slate-100 rounded-full pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
              <button onClick={clearSearch} className="p-2 text-slate-500 hover:text-slate-800">
                <span className="text-sm font-medium">Cancelar</span>
              </button>
            </div>
          ) : (
            <>
              <button onClick={() => navigate('/')} className="p-2 -ml-2 text-slate-800 hover:bg-slate-100 rounded-full">
                <ArrowLeft size={24} />
              </button>
              <h1 className="text-xl font-bold text-slate-900">Cadeiras</h1>
              <button 
                onClick={() => setIsSearchOpen(true)}
                className="p-2 -mr-2 text-slate-800 hover:bg-slate-100 rounded-full"
              >
                <Search size={24} />
              </button>
            </>
          )}
        </div>
      </header>

      <main className="p-4">
        {/* Controls */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-3">
            <button className="flex items-center space-x-1.5 px-4 py-2 bg-white text-slate-700 rounded-full shadow-sm border border-slate-200 active:scale-95 transition-transform">
              <Filter size={18} />
              <span className="text-sm font-medium">Filtros</span>
            </button>
            <button className="flex items-center space-x-1.5 px-4 py-2 bg-white text-slate-700 rounded-full shadow-sm border border-slate-200 active:scale-95 transition-transform">
              <ArrowUpDown size={18} />
              <span className="text-sm font-medium">Ordenar</span>
            </button>
          </div>
          <div className="flex items-center bg-slate-100 rounded-lg p-1">
            <button className="p-1.5 bg-white rounded text-slate-800 shadow-sm">
              <GridIcon size={20} />
            </button>
            <button className="p-1.5 text-slate-400 hover:text-slate-600">
              <List size={20} />
            </button>
          </div>
        </div>

        {/* Feedback de busca */}
        {searchTerm && (
          <p className="mb-4 text-slate-500 text-sm">
            Exibindo resultados para <span className="font-bold text-primary">"{searchTerm}"</span>
          </p>
        )}

        {/* Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 gap-4">
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} variant="grid" />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-slate-400">
            <Search size={48} className="mb-4 opacity-20" />
            <p className="text-lg font-medium">Nenhum produto encontrado</p>
            <p className="text-sm">Tente buscar por outro nome</p>
            <button 
              onClick={clearSearch}
              className="mt-4 text-primary font-medium hover:underline"
            >
              Ver todos os produtos
            </button>
          </div>
        )}
      </main>
    </div>
  );
};
