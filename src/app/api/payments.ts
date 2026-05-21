import { getJson } from './http';
import type { PaymentMethod, PaymentMethodsApiResponse } from '../../types/payment';

export async function fetchPaymentMethods(): Promise<PaymentMethod[]> {
  const response = await getJson<PaymentMethodsApiResponse>('/payment-methods');
  return response.data.items;
}
