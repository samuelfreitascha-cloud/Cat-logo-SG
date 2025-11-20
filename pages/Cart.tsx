import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Trash2, Minus, Plus } from 'lucide-react';
import { useCart } from '../context/CartContext';

export const Cart: React.FC = () => {
  const navigate = useNavigate();
  const { items, updateQuantity, removeFromCart, subtotal, shipping, total } = useCart();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="p-4 flex items-center justify-between sticky top-0 bg-slate-50/90 backdrop-blur-sm z-10">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full text-slate-800 hover:bg-slate-200">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-semibold text-slate-900">Meu Carrinho</h1>
        <div className="w-10"></div> 
      </header>

      <main className="flex-grow px-4 pb-4 space-y-4">
        {items.length === 0 ? (
          <div className="text-center py-20 text-slate-500">
            <p>Seu carrinho está vazio.</p>
            <button onClick={() => navigate('/products')} className="mt-4 text-primary font-semibold">Ir às compras</button>
          </div>
        ) : (
          items.map(item => (
            <div key={item.id} className="bg-white rounded-xl p-4 flex items-center shadow-sm border border-slate-100">
              <div className="w-24 h-24 bg-slate-100 rounded-lg flex-shrink-0 mr-4 overflow-hidden">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-grow min-w-0">
                <div className="flex justify-between items-start">
                  <h2 className="font-semibold text-slate-800 pr-2 truncate">{item.name}</h2>
                  <button 
                    onClick={() => removeFromCart(item.id)}
                    className="text-slate-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={20} strokeWidth={1.5} />
                  </button>
                </div>
                <p className="text-sm text-slate-500 mt-0.5">Cor: {item.color || 'Padrão'}</p>
                <div className="flex items-center justify-between mt-3">
                  <p className="text-lg font-bold text-cyan-700">R$ {item.price.toFixed(2).replace('.', ',')}</p>
                  <div className="flex items-center gap-3 bg-slate-100 rounded-full px-2 py-1">
                    <button 
                      onClick={() => updateQuantity(item.id, -1)}
                      className="w-6 h-6 flex items-center justify-center text-cyan-700 font-bold rounded-full hover:bg-white transition-colors"
                    >
                      <Minus size={14} strokeWidth={3} />
                    </button>
                    <span className="font-medium text-slate-800 w-4 text-center text-sm">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.id, 1)}
                      className="w-6 h-6 flex items-center justify-center text-cyan-700 font-bold rounded-full hover:bg-white transition-colors"
                    >
                      <Plus size={14} strokeWidth={3} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </main>

      {items.length > 0 && (
        <footer className="p-6 bg-white sticky bottom-0 border-t border-slate-100 rounded-t-2xl shadow-[-10px_0_30px_-10px_rgba(0,0,0,0.1)] z-20">
          <div className="space-y-3 mb-6">
            <div className="flex justify-between items-center text-slate-600 text-sm">
              <p>Subtotal</p>
              <p className="font-medium">R$ {subtotal.toFixed(2).replace('.', ',')}</p>
            </div>
            <div className="flex justify-between items-center text-slate-600 text-sm">
              <p>Frete</p>
              <p className="font-medium">R$ {shipping.toFixed(2).replace('.', ',')}</p>
            </div>
            <div className="border-t border-slate-100 my-2"></div>
            <div className="flex justify-between items-center text-xl font-bold text-slate-900">
              <p>Total</p>
              <p>R$ {total.toFixed(2).replace('.', ',')}</p>
            </div>
          </div>
          <button 
            onClick={() => navigate('/checkout')}
            className="w-full bg-cyan-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-cyan-700/30 hover:bg-cyan-800 transition-all duration-300 active:scale-[0.98]"
          >
            Continuar para o Checkout
          </button>
        </footer>
      )}
    </div>
  );
};