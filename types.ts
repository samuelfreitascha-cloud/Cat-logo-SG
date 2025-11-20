export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  rating?: number;
  category?: string;
  color?: string;
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