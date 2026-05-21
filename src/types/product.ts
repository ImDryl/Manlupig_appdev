export type ProductItem = {
  id: number;
  name: string;
  description: string | null;
  price: number | null;
  quantity: number;
  category: string | null;
  imageUrl: string | null;
};

export type ProductsPagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type ProductsApiData = {
  items: ProductItem[];
  pagination: ProductsPagination;
  filters: { q: string };
};

export type ProductsApiResponse = {
  success: boolean;
  message: string;
  data: ProductsApiData;
  errors: string[];
};
