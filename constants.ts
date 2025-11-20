import { Product, Category } from './types';

export const PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Cadeira Veneza',
    description: 'Madeira Tauari',
    price: 189.90,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBB-eJC3W80aeBag3VFAO36rdQG_B91nWpHXvYCDbV-jnz11WJ1urLjzON-5BcUOVXotRqAGMUwQ6Bs0PzL7FBZgK09TqUSnHC77deQG9_ay--8oXMfYIm5nQehqTbwbmZJXMZK-gXFrGutEznpHz6oalumSzgfm7DMzi9Tw8tTDYykMUpZi8sApjHDPahSgeelbdPn0qNr5oFKPHnlrF5QyXBM7tYN0FUJA6pO4997md4cQL3RJtjAXhgFhVvr2ZnlxCnpOR7HRCE',
    category: 'Praia',
    color: 'Azul Náutico'
  },
  {
    id: '2',
    name: 'Cadeira Reclinável DuraPlus',
    description: 'Alumínio e Tela sling',
    price: 249.90,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAZPuvrT42r6EPMcFwrVX_53-D9Zux_AuoHlCfg5BbpShhT5JF6sg-XbU11H2BlsuCv2pGuPdrs7b21pxZ8fwnwpYiJDfEdza7IXg2y82uERw9a7G2Y2M0pNXM2NKycHKl5-INfqA0d_1dEzBnpzpVmw1_r7IkswhpAgKQtdD6NoSeWrTC2OG90YpOfPJhwfcMVKYJQwvmd2X2lZeZ36EBD7PHk0zdcIr5k1cos-8UpLM1H41PbSx6x0LL7b2jGuCXvAbhb38hU4qc',
    category: 'Praia',
    color: 'Preto'
  },
  {
    id: '3',
    name: 'Cadeira Eames',
    description: 'Polipropileno',
    price: 159.00,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCT85FjUfUjVz0gcEEyxwj2T9Cb1YE5qd7bR2g7CkBnWPTNMB2OqsrF3RsqwnpiPcVmEMqaa6ZAMqJ5D-tqOyTnUzNV0h3R3AL5Rgfsyy-i8AAt3SKNy4GchrWuM-_7Pj4UzwnLn66zY_AGfTDz4ouxdyxLMOMasOcQjKArFvtqA4qpHwBGEKWuYGVjIHyvTFKohQ39Pqrk5_HJEifHjk7naltNwbpKhaVA35_ulhvTscFYmS10hY2mUqs0tf8P8dTBdZKnoUZkGiA',
    category: 'Casa',
    color: 'Branco'
  },
  {
    id: '4',
    name: 'Cadeira Clássica',
    description: 'Madeira Maciça',
    price: 299.00,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB_mg5EBTlZbROYZVz3OH6q5vLCznB7leNA2ucdkiQIdT86ykNEb4DdRZYh2r8wY61x1zbT2yl41zyWiee1XGDJXrCRUaT4QTL2kpf_FbiwfCmmo7zZOhOyXA5gdFbnhXDThEFFORBCWuf9C5nbCw1OoUow_4sS68uHjsjHiGczI-N9JIeb5bco_GLB6L6SjmKbJ7zQfFN4voP4U4t6bozKMuaalV4Gvl2YCeEiDTEocmZCJr9ZG4bcKNZ2xwKhBJ9RkbHBodUtt5M',
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