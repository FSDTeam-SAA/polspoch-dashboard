export interface FamilyImage {
  url: string;
  publickey: string;
}

export interface Family {
  _id: string;
  familyName: string;
  img: FamilyImage;
  createdAt: string;
  updatedAt: string;
}

export interface FamilyServiceResponse {
  success: boolean;
  message: string;
  statusCode: number;
  data: Family[];
}

export interface CreateFamilyResponse {
  success: boolean;
  message: string;
  data: Family;
}

export interface UpdateFamilyResponse {
  success: boolean;
  message: string;
  data: Family;
}

export interface DeleteFamilyResponse {
  success: boolean;
  message: string;
}
