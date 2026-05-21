export type CartLineItem = {
  productId: number;
  name: string;
  description: string | null;
  price: number;
  quantity: number;
  subtotal: number;
  availableStock: number;
  category: string | null;
  imageUrl: string | null;
};

export type CartData = {
  items: CartLineItem[];
  total: number;
  totalItems: number;
};

export type CartApiResponse = {
  success: boolean;
  message: string;
  data: CartData;
  errors?: string[];
};

export type CheckoutPayload = {
  customer_name: string;
  customer_email: string;
  customer_phone: string;
};

export type CheckoutApiResponse = {
  success: boolean;
  message: string;
  data?: {
    orderId: number;
    orderNumber: string;
    total: number;
  };
  errors?: string[];
};
