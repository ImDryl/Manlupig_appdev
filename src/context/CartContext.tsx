import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import { useSelector } from 'react-redux';
import {
  addToCart as apiAddToCart,
  clearCart as apiClearCart,
  fetchCart,
  removeFromCart as apiRemoveFromCart,
  updateCartItem as apiUpdateCartItem,
} from '../app/api/cart';
import type { RootState } from '../app/reducers';
import type { CartData } from '../types/cart';
import { getAuthToken } from '../utils/authToken';

type CartContextValue = {
  cart: CartData;
  loading: boolean;
  refreshCart: () => Promise<void>;
  addProduct: (productId: number, quantity?: number) => Promise<void>;
  updateQuantity: (productId: number, quantity: number) => Promise<void>;
  removeProduct: (productId: number) => Promise<void>;
  clearAll: () => Promise<void>;
};

const emptyCart: CartData = { items: [], total: 0, totalItems: 0 };

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const token = useSelector((state: RootState) => getAuthToken(state));
  const [cart, setCart] = useState<CartData>(emptyCart);
  const [loading, setLoading] = useState(false);

  const requireToken = useCallback(() => {
    if (!token) {
      throw new Error('Please log in to use the cart.');
    }
    return token;
  }, [token]);

  const refreshCart = useCallback(async () => {
    if (!token) {
      setCart(emptyCart);
      return;
    }
    setLoading(true);
    try {
      const data = await fetchCart(token);
      setCart(data);
    } finally {
      setLoading(false);
    }
  }, [token]);

  const addProduct = useCallback(
    async (productId: number, quantity = 1) => {
      const jwt = requireToken();
      const data = await apiAddToCart(jwt, productId, quantity);
      setCart(data);
    },
    [requireToken],
  );

  const updateQuantity = useCallback(
    async (productId: number, quantity: number) => {
      const jwt = requireToken();
      const data = await apiUpdateCartItem(jwt, productId, quantity);
      setCart(data);
    },
    [requireToken],
  );

  const removeProduct = useCallback(
    async (productId: number) => {
      const jwt = requireToken();
      const data = await apiRemoveFromCart(jwt, productId);
      setCart(data);
    },
    [requireToken],
  );

  const clearAll = useCallback(async () => {
    const jwt = requireToken();
    const data = await apiClearCart(jwt);
    setCart(data);
  }, [requireToken]);

  const value = useMemo(
    () => ({
      cart,
      loading,
      refreshCart,
      addProduct,
      updateQuantity,
      removeProduct,
      clearAll,
    }),
    [
      cart,
      loading,
      refreshCart,
      addProduct,
      updateQuantity,
      removeProduct,
      clearAll,
    ],
  );

  return (
    <CartContext.Provider value={value}>{children}</CartContext.Provider>
  );
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error('useCart must be used within CartProvider');
  }
  return ctx;
}
