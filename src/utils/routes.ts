const ROUTES = {
  LOGIN: 'Login',
  REGISTER: 'Register',
  HOME: 'Home',
  SHOP: 'Shop',
  CART: 'Cart',
  CHECKOUT: 'Checkout',
  PROFILE: 'Profile',
  ORDERS: 'Orders',
  ORDER_DETAIL: 'OrderDetail',
  PRODUCT_DETAIL: 'ProductDetail',
} as const;

export type RouteName = (typeof ROUTES)[keyof typeof ROUTES];

export default ROUTES;
