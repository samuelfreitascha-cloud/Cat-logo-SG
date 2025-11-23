

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
    image: 'https://res.cloudinary.com/drdktfy8u/image/upload/v1763929574/D_NQ_NP_2X_668726-MLA87198772051_072025-F_fgowfi.webp',
    category: 'Praia',
    color: 'Azul Royal',
    externalUrl: 'https://api.whatsapp.com/send?1=pt_BR&phone=551140620224&text=Ol%C3%A1%20Sungap%20-%20Gostaria%20de%20um%20orçamento%20para%20o%20Guarda-Sol%20Bagum%201,60m',
    infoImage: 'https://i.ibb.co/WNYMRjN2/Prancheta-4-c-pia-11-4x.png', // Placeholder (pode substituir depois)
  },
  {
    id: '4',
    name: 'Ombrelone Madeira 2,40m',
    description: 'Cobertura Premium para Jardim',
    price: 589.00,
    image: 'https://res.cloudinary.com/drdktfy8u/image/upload/v1763930490/D_NQ_NP_2X_873469-MLB89343195215_082025-F-ombrelone-240-mts-solasol-redondo-varias-cores-disponiveis_wqexkt.webp',
    gallery: [
      'https://res.cloudinary.com/drdktfy8u/image/upload/v1763930490/D_NQ_NP_2X_873469-MLB89343195215_082025-F-ombrelone-240-mts-solasol-redondo-varias-cores-disponiveis_wqexkt.webp',
      'https://res.cloudinary.com/drdktfy8u/image/upload/v1763930490/D_Q_NP_940911-MLB89005079466_082025-F-ombrelone-central-redondo-240-metros-solasol-sungap_txi1fy.webp'
    ],
    infoImage: 'https://res.cloudinary.com/drdktfy8u/image/upload/v1763930490/D_NQ_NP_2X_668962-MLB89005285036_082025-F-ombrelone-central-redondo-240-metros-solasol-sungap_iw1q1z.webp',
    category: 'Praia',
    color: 'Natural',
    externalUrl: 'https://api.whatsapp.com/send?1=pt_BR&phone=551140620224&text=Ol%C3%A1%20Sungap%20-%20Gostaria%20de%20um%20orçamento%20para%20o%20Ombrelone%20Madeira%202,40m',
  },
  {
    id: '5',
    name: 'Guarda-Sol Articulado',
    description: 'Alumínio com inclinação',
    price: 210.00,
    image: 'https://images.unsplash.com/photo-1535262412227-85541e910204?q=80&w=2069&auto=format&fit=crop',
    category: 'Praia',
    color: 'Listrado',
    externalUrl: 'https://api.whatsapp.com/send?1=pt_BR&phone=551140620224&text=Ol%C3%A1%20Sungap%20-%20Gostaria%20de%20um%20orçamento%20para%20o%20Guarda-Sol%20Articulado',
    infoImage: 'https://i.ibb.co/WNYMRjN2/Prancheta-4-c-pia-11-4x.png', // Placeholder
  },
  {
    id: '6',
    name: 'Ombrelone com abas',
    description: 'Design moderno e rotação 360°',
    price: 1290.00,
    image: 'https://res.cloudinary.com/drdktfy8u/image/upload/v1763931626/Generated-Image-October-01_-2025-4_29PM_a2gucu.png',
    category: 'Praia',
    color: 'Beige',
    externalUrl: 'https://api.whatsapp.com/send?1=pt_BR&phone=551140620224&text=Ol%C3%A1%20Sungap%20-%20Gostaria%20de%20um%20orçamento%20para%20o%20Ombrelone%20com%20abas',
    infoImage: 'https://i.ibb.co/WNYMRjN2/Prancheta-4-c-pia-11-4x.png', // Placeholder
  },
  {
    id: '7',
    name: 'Kit 2 Potes Porcelana',
    description: 'Cães e Gatos - Azul Raço/Água',
    price: 55.00,
    image: 'https://res.cloudinary.com/drdktfy8u/image/upload/v1763923130/D_NQ_NP_2X_877694-MLB95732925474_102025-F-kit-2-potes-porcelana-ces-e-gatos-azul-raco-agua-tam-medio_lzan3n.webp',
    gallery: [
      'https://res.cloudinary.com/drdktfy8u/image/upload/v1763923130/D_NQ_NP_2X_877694-MLB95732925474_102025-F-kit-2-potes-porcelana-ces-e-gatos-azul-raco-agua-tam-medio_lzan3n.webp',
      'https://res.cloudinary.com/drdktfy8u/image/upload/v1763928436/D_NQ_NP_2X_892214-MLB95621550098_102025-F-kit-2-potes-porcelana-ces-e-gatos-azul-raco-agua-tam-medio_cpuzfe.webp'
    ],
    infoImage: 'https://res.cloudinary.com/drdktfy8u/image/upload/v1763928453/D_NQ_NP_2X_753594-MLB96062967047_102025-F-kit-2-potes-porcelana-ces-e-gatos-azul-raco-agua-tam-medio_slv4fm.webp',
    category: 'Pet Shop',
    color: 'Azul',
    externalUrl: 'https://produto.mercadolivre.com.br/MLB-5321526770-kit-2-potes-porcelana-ces-e-gatos-azul-raco-agua-tam-medio-_JM?searchVariation=183155531950&pdp_filters=seller_id%3A306201244#polycard_client=search-nordic&searchVariation=183155531950&search_layout=grid&position=1&type=item&tracking_id=43876292-b0b2-4516-bd74-8a65f6372991',
  },
  {
    id: '8',
    name: 'Ombrelone Central Redondo 2,40m',
    description: 'Solasol Sungap',
    price: 389.00, // Preço estimado, ajuste conforme necessário
    image: 'https://images.unsplash.com/photo-1590494544778-9e564c70d44b?q=80&w=2070&auto=format&fit=crop', // Imagem ilustrativa de alta qualidade
    category: 'Praia',
    color: 'Variadas',
    externalUrl: 'https://produto.mercadolivre.com.br/MLB-1858201258-ombrelone-central-redondo-240-metros-solasol-sungap-_JM?searchVariation=82040363153&pdp_filters=seller_id%3A306201244#polycard_client=search-nordic&searchVariation=82040363153&search_layout=grid&position=13&type=item&tracking_id=7f7afc9a-9ed6-4321-8766-e6e0e64aba08',
    infoImage: 'https://i.ibb.co/WNYMRjN2/Prancheta-4-c-pia-11-4x.png',
  }
];

export const CATEGORIES: Category[] = [
  { id: '1', name: 'Praia', icon: 'deck' },
  { id: '2', name: 'Pet Shop', icon: 'paw' }, // Ícone atualizado
  { id: '3', name: 'Casa', icon: 'weekend' },
  { id: '4', name: 'Ofertas', icon: 'local_offer' },
];