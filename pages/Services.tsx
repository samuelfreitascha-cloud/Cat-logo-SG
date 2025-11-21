
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MoreVertical, Brush, Headset, Briefcase, PlusCircle, MessageSquare, BadgeCheck } from 'lucide-react';

export const Services: React.FC = () => {
  const navigate = useNavigate();
  const whatsappLink = "https://api.whatsapp.com/send?1=pt_BR&phone=551140620224&text=Ol%C3%A1%20Sungap";

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      <header className="sticky top-0 z-10 bg-slate-50/90 backdrop-blur-sm p-4 flex items-center justify-between border-b border-slate-200">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full text-slate-800 hover:bg-slate-200">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-semibold text-slate-900">Nossos Serviços</h1>
        <button className="p-2 -mr-2 rounded-full text-slate-800 hover:bg-slate-200">
          <MoreVertical size={24} />
        </button>
      </header>

      <main className="p-4 space-y-6">
        <p className="text-slate-600 text-center px-4">
          Descubra como podemos transformar seus produtos e impulsionar suas vendas com nossos serviços exclusivos.
        </p>

        {/* Card 1 */}
        <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow border border-slate-100">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-blue-100 p-3 rounded-full">
              <Brush className="text-blue-700" size={24} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Personalização de Produtos</h2>
              <p className="text-sm text-slate-500">Sua marca em destaque.</p>
            </div>
          </div>
          <p className="text-slate-700 text-sm leading-relaxed mb-6">
            Personalize cadeiras com sua logomarca ou arte exclusiva. Ideal para eventos, brindes corporativos ou para deixar seu espaço com uma identidade única.
          </p>
          <a 
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-blue-700 text-white font-semibold py-3.5 rounded-xl flex items-center justify-center gap-2 active:scale-[0.98] transition-transform shadow-lg shadow-blue-700/20"
          >
            <PlusCircle size={20} />
            Solicitar Orçamento
          </a>
        </div>

        {/* Card 2 */}
        <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow border border-slate-100">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-green-100 p-3 rounded-full">
              <Headset className="text-green-700" size={24} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Consultoria Especializada</h2>
              <p className="text-sm text-slate-500">A escolha certa para seu negócio.</p>
            </div>
          </div>
          <p className="text-slate-700 text-sm leading-relaxed mb-6">
            Nossa equipe de especialistas está pronta para ajudar você a escolher os melhores produtos para seu ambiente, seja ele interno ou externo.
          </p>
          <a 
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-slate-200 text-slate-800 font-semibold py-3.5 rounded-xl flex items-center justify-center gap-2 active:scale-[0.98] transition-transform hover:bg-slate-300"
          >
            <MessageSquare size={20} />
            Falar com um Consultor
          </a>
        </div>

        {/* Card 3 */}
        <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow border border-slate-100">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-purple-100 p-3 rounded-full">
              <Briefcase className="text-purple-700" size={24} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Vendas Corporativas</h2>
              <p className="text-sm text-slate-500">Condições especiais para empresas.</p>
            </div>
          </div>
          <p className="text-slate-700 text-sm leading-relaxed mb-6">
            Oferecemos condições exclusivas para compras em grande volume. Se você é um revendedor ou hoteleiro, temos o plano perfeito.
          </p>
          <a 
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-slate-200 text-slate-800 font-semibold py-3.5 rounded-xl flex items-center justify-center gap-2 active:scale-[0.98] transition-transform hover:bg-slate-300"
          >
            <BadgeCheck size={20} />
            Ver Condições
          </a>
        </div>
      </main>
    </div>
  );
};
