
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  gallery?: string[]; // Array opcional de URLs para galeria
  rating?: number;
  category?: string;
  color?: string;
  externalUrl?: string; // Link externo para compra (ex: Mercado Livre)
  infoImage?: string; // URL para imagem de detalhes técnicos ("Saber mais")
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  route?: string;
}

export type PaymentMethod = 'credit_card' | 'boleto' | 'pix';