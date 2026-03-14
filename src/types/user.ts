export interface TUser {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  isVerified: boolean;
  createdAt: string;
  image?: {
    public_id?: string;
    url: string;
  };
}
