export type ProfileData = {
  id: number;
  email: string;
  roles: string[];
  roleLabel: string;
  verified: boolean;
  isActive: boolean;
};

export type ProfileApiResponse = {
  success: boolean;
  message: string;
  data: ProfileData;
};
