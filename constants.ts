
import { Product, Category } from './types';

export const PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Cadeira Veneza',
    description: 'Madeira Tauari',
    price: 247.89,
    image: 'https://i.ibb.co/35ps9KSY/cadeira-veneza.png',
    category: 'Praia',
    color: 'Azul Náutico',
    externalUrl: 'https://produto.mercadolivre.com.br/MLB-3279509619-cadeira-espreguicadeira-veneza-lona-madeira-macica-4-niveis-_JM',
    infoImage: 'https://i.ibb.co/WNYMRjN2/Prancheta-4-c-pia-11-4x.png',
  },
  {
    id: '2',
    name: 'Cadeira Reclinável DuraPlus',
    description: 'Alumínio e Tela sling',
    price: 260.00,
    image: 'https://res.cloudinary.com/drdktfy8u/image/upload/v1763734024/Cadeira-Reclin%C3%A1vel-duraplus_ts4q7m.png',
    externalUrl: 'https://produto.mercadolivre.com.br/MLB-4075779991-cadeira-de-praia-reclinavel-fixa-dura-mais-resistente-jardim-_JM',
    infoImage: 'https://i.ibb.co/svqtpQ6X/Prancheta-4-c-pia-12.png',
    gallery: [
      'https://res.cloudinary.com/drdktfy8u/image/upload/v1763734024/Cadeira-Reclin%C3%A1vel-duraplus_ts4q7m.png',
      'https://i.ibb.co/8DsSfthQ/image.png',
      'https://i.ibb.co/ZzThrWG0/1.png',
      'https://i.ibb.co/TxbtzrzR/2.png',
      'https://i.ibb.co/vx8shnGs/3.png',
      'https://i.ibb.co/zVfw9BWH/4.png',
      'https://i.ibb.co/twQ8DpR2/cadeira-2-1.png'
    ],
    category: 'Jardim',
    color: 'Preto',
  },
  {
    id: '3',
    name: 'Guarda-Sol Bagum 1,60m',
    description: 'Proteção UV e Haste Alumínio',
    price: 159.90,
    image: 'https://images.unsplash.com/photo-1527610267748-75286c579ea5?q=80&w=1935&auto=format&fit=crop',
    category: 'Praia',
    color: 'Azul Royal',
    externalUrl: 'https://wa.me/5511930364088?text=Olá, gostaria de um orçamento para o Guarda-Sol Bagum 1,60m',
    infoImage: 'https://i.ibb.co/WNYMRjN2/Prancheta-4-c-pia-11-4x.png', // Placeholder (pode substituir depois)
  },
  {
    id: '4',
    name: 'Ombrelone Madeira 2,40m',
    description: 'Cobertura Premium para Jardim',
    price: 589.00,
    image: 'https://images.unsplash.com/photo-1597423244036-ef5020e83f3c?q=80&w=1974&auto=format&fit=crop',
    category: 'Praia',
    color: 'Natural',
    externalUrl: 'https://wa.me/5511930364088?text=Olá, gostaria de um orçamento para o Ombrelone de Madeira 2,40m',
    infoImage: 'https://i.ibb.co/WNYMRjN2/Prancheta-4-c-pia-11-4x.png', // Placeholder
  },
  {
    id: '5',
    name: 'Guarda-Sol Articulado',
    description: 'Alumínio com inclinação',
    price: 210.00,
    image: 'https://images.unsplash.com/photo-1535262412227-85541e910204?q=80&w=2069&auto=format&fit=crop',
    category: 'Praia',
    color: 'Listrado',
    externalUrl: 'https://wa.me/5511930364088?text=Olá, gostaria de um orçamento para o Guarda-Sol Articulado',
    infoImage: 'https://i.ibb.co/WNYMRjN2/Prancheta-4-c-pia-11-4x.png', // Placeholder
  },
  {
    id: '6',
    name: 'Base para Guarda-Sol',
    description: 'Suporte resistente de concreto/PVC',
    price: 89.90,
    image: 'https://images.unsplash.com/photo-1622396090075-ab49e6223992?q=80&w=2071&auto=format&fit=crop',
    category: 'Praia',
    color: 'Branco',
    externalUrl: 'https://wa.me/5511930364088?text=Olá, gostaria de um orçamento para a Base de Guarda-Sol',
    infoImage: 'https://i.ibb.co/WNYMRjN2/Prancheta-4-c-pia-11-4x.png', // Placeholder
  }
];

export const CATEGORIES: Category[] = [
  { id: '1', name: 'Praia', icon: 'umbrella' },
  { id: '2', name: 'Jardim', icon: 'armchair' },
  { id: '3', name: 'Casa', icon: 'sofa' },
  { id: '4', name: 'Ofertas', icon: 'tag' },
];
