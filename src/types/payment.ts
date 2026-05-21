export type PaymentMethod = {
  id: string;
  label: string;
  description: string;
};

export type PaymentMethodsApiResponse = {
  success: boolean;
  message: string;
  data: { items: PaymentMethod[] };
};
