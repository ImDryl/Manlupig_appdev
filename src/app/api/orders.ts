import { authGetJson, resolveAssetUrl } from './http';
import type { OrderApiResponse, OrderDetail, OrdersApiResponse } from '../../types/order';

function normalizeOrderDetail(order: OrderDetail): OrderDetail {
  return {
    ...order,
    items: order.items.map(item => ({
      ...item,
      imageUrl: resolveAssetUrl(item.imageUrl),
    })),
  };
}

export async function fetchOrders(token: string) {
  const response = await authGetJson<OrdersApiResponse>('/orders', token);
  return response.data.items;
}

export async function fetchOrder(token: string, orderId: number) {
  const response = await authGetJson<OrderApiResponse>(`/orders/${orderId}`, token);
  return normalizeOrderDetail(response.data);
}
