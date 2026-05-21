export type OrderSummary = {
  id: number;
  orderNumber: string;
  status: string;
  paymentMethod: string;
  total: number;
  orderDate: string | null;
  itemCount: number;
};

export type OrderLineItem = {
  productId: number | null;
  name: string;
  quantity: number;
  price: number;
  subtotal: number;
  imageUrl: string | null;
};

export type OrderDetail = OrderSummary & {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: OrderLineItem[];
};

export type OrdersApiResponse = {
  success: boolean;
  message: string;
  data: { items: OrderSummary[] };
};

export type OrderApiResponse = {
  success: boolean;
  message: string;
  data: OrderDetail;
};
