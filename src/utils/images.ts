const IMG = {
  LOGO: require('../assets/images/mainlogo.png'),
} as const;

export type ImageKey = keyof typeof IMG;

export default IMG;
