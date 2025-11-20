
import { Product, Category } from './types';

export const PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Cadeira Veneza',
    description: 'Madeira Tauari',
    price: 189.90,
    image: 'https://images.unsplash.com/photo-1594026112284-02bb6f3352fe?q=80&w=2070&auto=format&fit=crop',
    category: 'Praia',
    color: 'Azul Náutico',
    // COLE O LINK ABAIXO (Se for WhatsApp use: https://wa.me/5511999999999)
    // externalUrl: 'https://...',
  },
  {
    id: '2',
    name: 'Cadeira Reclinável DuraPlus',
    description: 'Alumínio e Tela sling',
    price: 249.90,
    image: 'https://i.ibb.co/8DsSfthQ/image.png',
    // Link externo (Mercado Livre) - Já configurado
    externalUrl: 'https://produto.mercadolivre.com.br/MLB-4075779991-cadeira-de-praia-reclinavel-fixa-dura-mais-resistente-jardim-_JM',
    // Galeria de imagens
    gallery: [
      'https://i.ibb.co/8DsSfthQ/image.png',
      'https://i.ibb.co/ZzThrWG0/1.png',
      'https://i.ibb.co/TxbtzrzR/2.png',
      'https://i.ibb.co/vx8shnGs/3.png',
      'https://i.ibb.co/zVfw9BWH/4.png',
      'https://i.ibb.co/twQ8DpR2/cadeira-2-1.png'
    ],
    category: 'Praia',
    color: 'Preto'
  },
  {
    id: '3',
    name: 'Cadeira Eames',
    description: 'Polipropileno',
    price: 159.00,
    image: 'https://images.unsplash.com/photo-1519947486511-463999512756?q=80&w=2028&auto=format&fit=crop',
    category: 'Casa',
    color: 'Branco',
    // COLE O LINK ABAIXO
    // externalUrl: 'https://...',
  },
  {
    id: '4',
    name: 'Cadeira Clássica',
    description: 'Madeira Maciça',
    price: 299.00,
    image: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?q=80&w=1974&auto=format&fit=crop',
    category: 'Jardim',
    color: 'Amarelo',
    // COLE O LINK ABAIXO
    // externalUrl: 'https://...',
  }
];

export const CATEGORIES: Category[] = [
  { id: '1', name: 'Praia', icon: 'deck', route: '/products' },
  { id: '2', name: 'Jardim', icon: 'chair', route: '/products' },
  { id: '3', name: 'Casa', icon: 'weekend', route: '/products' },
  { id: '4', name: 'Ofertas', icon: 'local_offer', route: '/products' },
];
