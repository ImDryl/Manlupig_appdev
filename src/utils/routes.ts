const ROUTES = {
  LOGIN: 'Login',
  REGISTER: 'Register',
  HOME: 'Home',
  PROFILE: 'Profile',
} as const;

export type RouteName = (typeof ROUTES)[keyof typeof ROUTES];

export default ROUTES;
