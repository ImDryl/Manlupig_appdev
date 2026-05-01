const IMG = {
  LOGO:
    'https://i.pinimg.com/736x/92/fe/dd/92feddb44ed44b8df618f1d63e00c9d6.jpg',
} as const;

export type ImageKey = keyof typeof IMG;

export default IMG;
