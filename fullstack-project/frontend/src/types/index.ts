export interface Product {
  id: string;
  brand: string;
  title: string;
  price: number;
  originalPrice?: number;
  discount?: string;
  rating: number;
  reviewsCount: number;
  image: string;
  tag?: string;
  category: string;
}

export interface Category {
  id: string;
  name: string;
  image: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  size?: string;
  color?: string;
}
