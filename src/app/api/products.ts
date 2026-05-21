import { getJson, resolveAssetUrl } from './http';
import type { ProductItem, ProductsApiResponse } from '../../types/product';

export type FetchProductsParams = {
  q?: string;
  page?: number;
  limit?: number;
};

export async function fetchProducts(
  params: FetchProductsParams = {},
): Promise<ProductsApiResponse> {
  const response = await getJson<ProductsApiResponse>('/products', {
    q: params.q ?? '',
    page: params.page ?? 1,
    limit: params.limit ?? 9,
  });

  const items = response.data.items.map((item: ProductItem) => ({
    ...item,
    imageUrl: resolveAssetUrl(item.imageUrl),
  }));

  return {
    ...response,
    data: {
      ...response.data,
      items,
    },
  };
}
