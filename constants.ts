
import { Product, Category } from './types';

export const PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Cadeira Veneza',
    description: 'Madeira Tauari',
    price: 189.90,
    // Imagem atualizada
    image: 'https://ibb.co/kgJzWxML',
    category: 'Praia',
    color: 'Azul Náutico'
  },
  {
    id: '2',
    name: 'Cadeira Reclinável DuraPlus',
    description: 'Alumínio e Tela sling',
    price: 249.90,
    // Imagem atualizada
    image: 'https://ibb.co/4wbJw5SZ',
    category: 'Praia',
    color: 'Preto'
  },
  {
    id: '3',
    name: 'Cadeira Eames',
    description: 'Polipropileno',
    price: 159.00,
    // Imagem atualizada
    image: 'https://ibb.co/3yyr081G',
    category: 'Casa',
    color: 'Branco'
  },
  {
    id: '4',
    name: 'Cadeira Clássica',
    description: 'Madeira Maciça',
    price: 299.00,
    // Imagem atualizada
    image: 'https://ibb.co/zWqj6mVH',
    category: 'Jardim',
    color: 'Amarelo'
  }
];

export const CATEGORIES: Category[] = [
  { id: '1', name: 'Praia', icon: 'deck', route: '/products' },
  { id: '2', name: 'Jardim', icon: 'chair', route: '/products' },
  { id: '3', name: 'Casa', icon: 'weekend', route: '/products' },
  { id: '4', name: 'Ofertas', icon: 'local_offer', route: '/products' },
];
