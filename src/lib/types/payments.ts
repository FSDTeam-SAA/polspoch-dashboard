// Types
export interface Payment {
  id: string;
  customer: {
    name: string;
    email: string;
    image: string;
  };
  productName: string;
  date: string;
  amount: string;
  status: string;
  description: string;
  productImages: string[];
  specifications: {
    longestSide: number;
    shortestSide: number;
    thickness: number;
    long: number;
    finish: string;
    quality: string;
    manufacturingProcess: string;
  };
}
