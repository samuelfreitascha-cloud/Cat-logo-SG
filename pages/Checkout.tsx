import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CreditCard, FileText, QrCode, CheckCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { PaymentMethod } from '../types';

export const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const { items, subtotal, shipping, total, clearCart } = useCart();
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('credit_card');

  const handleConfirm = () => {
    alert('Pedido confirmado com sucesso!');
    clearCart();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-32">
      <header className="flex items-center justify-between p-4 sticky top-0 bg-slate-50/90 backdrop-blur-sm z-10 border-b border-slate-200">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full text-slate-700 hover:bg-slate-200">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-lg font-semibold text-slate-900">Checkout</h1>
        <div className="w-10"></div> 
      </header>

      <main className="p-4 space-y-6">
        {/* Address */}
        <section className="bg-white p-5 rounded-xl shadow-sm border border-slate-100">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-sm font-medium text-slate-500 mb-1">Endereço de Entrega</h2>
              <p className="font-semibold text-slate-900 text-base">Rua das Flores, 123</p>
              <p className="text-sm text-slate-500">Centro, São Paulo - SP, 01000-000</p>
            </div>
            <button className="text-teal-600 font-semibold text-sm hover:text-teal-700">Alterar</button>
          </div>
        </section>

        {/* Payment Methods */}
        <section className="space-y-4">
          <h2 className="text-base font-semibold text-slate-900">Método de Pagamento</h2>
          <div className="space-y-3">
            {/* Credit Card */}
            <button 
              onClick={() => setPaymentMethod('credit_card')}
              className={`w-full flex items-center p-4 rounded-xl border transition-all ${
                paymentMethod === 'credit_card' 
                ? 'border-teal-500 bg-teal-50 ring-1 ring-teal-500' 
                : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <CreditCard className={paymentMethod === 'credit_card' ? 'text-teal-600' : 'text-slate-400'} size={24} />
              <div className="ml-4 flex-grow text-left">
                <p className={`font-semibold ${paymentMethod === 'credit_card' ? 'text-teal-900' : 'text-slate-700'}`}>Cartão de Crédito</p>
                <p className="text-xs text-slate-500">**** **** **** 1234</p>
              </div>
              {paymentMethod === 'credit_card' && (
                <CheckCircle className="text-teal-600" size={24} fill="currentColor" stroke="white" />
              )}
            </button>

            {/* Boleto */}
            <button 
              onClick={() => setPaymentMethod('boleto')}
              className={`w-full flex items-center p-4 rounded-xl border transition-all ${
                paymentMethod === 'boleto' 
                ? 'border-teal-500 bg-teal-50 ring-1 ring-teal-500' 
                : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <FileText className={paymentMethod === 'boleto' ? 'text-teal-600' : 'text-slate-400'} size={24} />
              <div className="ml-4 flex-grow text-left">
                <p className={`font-semibold ${paymentMethod === 'boleto' ? 'text-teal-900' : 'text-slate-700'}`}>Boleto Bancário</p>
              </div>
              {paymentMethod === 'boleto' ? (
                 <CheckCircle className="text-teal-600" size={24} fill="currentColor" stroke="white" />
              ) : (
                <div className="w-6 h-6 rounded-full border-2 border-slate-200"></div>
              )}
            </button>

            {/* PIX */}
            <button 
              onClick={() => setPaymentMethod('pix')}
              className={`w-full flex items-center p-4 rounded-xl border transition-all ${
                paymentMethod === 'pix' 
                ? 'border-teal-500 bg-teal-50 ring-1 ring-teal-500' 
                : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <QrCode className={paymentMethod === 'pix' ? 'text-teal-600' : 'text-slate-400'} size={24} />
              <div className="ml-4 flex-grow text-left">
                <p className={`font-semibold ${paymentMethod === 'pix' ? 'text-teal-900' : 'text-slate-700'}`}>PIX</p>
              </div>
              {paymentMethod === 'pix' ? (
                 <CheckCircle className="text-teal-600" size={24} fill="currentColor" stroke="white" />
              ) : (
                <div className="w-6 h-6 rounded-full border-2 border-slate-200"></div>
              )}
            </button>
          </div>
        </section>

        {/* Order Summary */}
        <section className="space-y-4">
          <h2 className="text-base font-semibold text-slate-900">Resumo do Pedido</h2>
          <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 space-y-4">
            {items.map(item => (
              <div key={item.id} className="flex items-start space-x-4">
                <div className="w-16 h-16 rounded-lg bg-slate-100 overflow-hidden flex-shrink-0">
                   <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-grow min-w-0">
                  <p className="font-semibold text-slate-800 text-sm truncate">{item.name}</p>
                  <p className="text-xs text-slate-500">Qtd: {item.quantity}</p>
                </div>
                <p className="font-semibold text-slate-900 text-sm">
                  R$ {(item.price * item.quantity).toFixed(2).replace('.', ',')}
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t border-slate-200 p-4 rounded-t-2xl shadow-2xl">
        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-slate-500 text-sm">
            <span>Subtotal</span>
            <span>R$ {subtotal.toFixed(2).replace('.', ',')}</span>
          </div>
          <div className="flex justify-between text-slate-500 text-sm">
            <span>Frete</span>
            <span>R$ {shipping.toFixed(2).replace('.', ',')}</span>
          </div>
          <div className="flex justify-between text-lg font-bold text-slate-900 pt-2">
            <span>Total</span>
            <span>R$ {total.toFixed(2).replace('.', ',')}</span>
          </div>
        </div>
        <button 
          onClick={handleConfirm}
          className="w-full bg-teal-500 text-white font-bold py-4 px-4 rounded-xl shadow-lg shadow-teal-500/30 hover:bg-teal-600 active:scale-[0.98] transition-all"
        >
          Confirmar Pedido
        </button>
      </footer>
    </div>
  );
};