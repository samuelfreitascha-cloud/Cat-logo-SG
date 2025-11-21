
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
    image: 'https://i.ibb.co/8DsSfthQ/image.png',
    externalUrl: 'https://produto.mercadolivre.com.br/MLB-4075779991-cadeira-de-praia-reclinavel-fixa-dura-mais-resistente-jardim-_JM',
    infoImage: 'https://i.ibb.co/svqtpQ6X/Prancheta-4-c-pia-12.png',
    gallery: [
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
    name: 'Cadeira Eames',
    description: 'Polipropileno',
    price: 159.00,
    image: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?q=80&w=2070&auto=format&fit=crop',
    category: 'Casa',
    color: 'Branco',
  },
  {
    id: '4',
    name: 'Cadeira Clássica',
    description: 'Madeira Maciça',
    price: 299.00,
    image: 'https://images.unsplash.com/photo-1503602642458-232111445840?q=80&w=2070&auto=format&fit=crop',
    category: 'Casa',
    color: 'Amarelo',
  }
];

export const CATEGORIES: Category[] = [
  { id: '1', name: 'Praia', icon: 'umbrella' },
  { id: '2', name: 'Jardim', icon: 'armchair' },
  { id: '3', name: 'Casa', icon: 'sofa' },
  { id: '4', name: 'Ofertas', icon: 'tag' },
];