export interface CuttingDimension {
  _id: string;
  key: string;
  label: string;
  minRange: number;
  maxRange: number;
  unit: string;
}

export interface CuttingTemplate {
  _id: string;
  templateId: string;
  shapeName: string;
  type: string;
  imageUrl: string;
  cuts: number;
  thicknesses: number[];
  materials: string[];
  dimensions: CuttingDimension[];
  isActive: boolean;
  updatedAt: string;
}

export interface CuttingServiceResponse {
  success: boolean;
  data: CuttingTemplate[];
}

export interface SingleCuttingServiceResponse {
  success: boolean;
  data: CuttingTemplate;
}
