import { authGetJson, authPostJson, resolveAssetUrl } from './http';
import type {
  CartApiResponse,
  CartData,
  CartLineItem,
  CheckoutApiResponse,
  CheckoutPayload,
} from '../../types/cart';

function normalizeCart(data: Partial<CartData> & { cartTotalItems?: number }): CartData {
  const items = (data.items ?? []).map((item: CartLineItem) => ({
    ...item,
    imageUrl: resolveAssetUrl(item.imageUrl),
  }));
  const totalItems =
    data.totalItems ??
    data.cartTotalItems ??
    items.reduce((sum, item) => sum + item.quantity, 0);

  return {
    items,
    total: data.total ?? 0,
    totalItems,
  };
}

export async function fetchCart(token: string): Promise<CartData> {
  const response = await authGetJson<CartApiResponse>('/cart', token);
  return normalizeCart(response.data);
}

export async function addToCart(
  token: string,
  productId: number,
  quantity = 1,
): Promise<CartData> {
  const response = await authPostJson<CartApiResponse>('/cart/add', token, {
    productId,
    quantity,
  });
  return normalizeCart(response.data);
}

export async function updateCartItem(
  token: string,
  productId: number,
  quantity: number,
): Promise<CartData> {
  const response = await authPostJson<CartApiResponse>('/cart/update', token, {
    productId,
    quantity,
  });
  return normalizeCart(response.data);
}

export async function removeFromCart(
  token: string,
  productId: number,
): Promise<CartData> {
  const response = await authPostJson<CartApiResponse>('/cart/remove', token, {
    productId,
  });
  return normalizeCart(response.data);
}

export async function clearCart(token: string): Promise<CartData> {
  const response = await authPostJson<CartApiResponse>('/cart/clear', token, {});
  return normalizeCart(response.data);
}

export async function checkoutCart(
  token: string,
  payload: CheckoutPayload,
): Promise<CheckoutApiResponse> {
  return authPostJson<CheckoutApiResponse>('/cart/checkout', token, payload);
}
