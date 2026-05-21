const ROUTES = {
  LOGIN: 'Login',
  REGISTER: 'Register',
  HOME: 'Home',
  SHOP: 'Shop',
  CART: 'Cart',
  CHECKOUT: 'Checkout',
  PROFILE: 'Profile',
} as const;

export type RouteName = (typeof ROUTES)[keyof typeof ROUTES];

export default ROUTES;
