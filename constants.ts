
import { Product, Category } from './types';

export const PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Cadeira Veneza',
    description: 'Madeira Tauari',
    price: 189.90,
    // Imagem corrigida para link direto funcional
    image: 'https://images.unsplash.com/photo-1594026112284-02bb6f3352fe?q=80&w=2070&auto=format&fit=crop',
    category: 'Praia',
    color: 'Azul Náutico'
  },
  {
    id: '2',
    name: 'Cadeira Reclinável DuraPlus',
    description: 'Alumínio e Tela sling',
    price: 249.90,
    // Imagem corrigida para link direto funcional
    image: 'https://images.unsplash.com/photo-1506326426992-32bfbf694963?q=80&w=1974&auto=format&fit=crop',
    category: 'Praia',
    color: 'Preto'
  },
  {
    id: '3',
    name: 'Cadeira Eames',
    description: 'Polipropileno',
    price: 159.00,
    // Imagem corrigida para link direto funcional
    image: 'https://images.unsplash.com/photo-1519947486511-463999512756?q=80&w=2028&auto=format&fit=crop',
    category: 'Casa',
    color: 'Branco'
  },
  {
    id: '4',
    name: 'Cadeira Clássica',
    description: 'Madeira Maciça',
    price: 299.00,
    // Imagem corrigida para link direto funcional
    image: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?q=80&w=1974&auto=format&fit=crop',
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
