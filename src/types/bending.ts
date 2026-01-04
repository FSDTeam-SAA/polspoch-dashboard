export interface BendingDimension {
  _id: string;
  key: string;
  label: string;
  minRange: number;
  maxRange: number;
  unit: string;
}

export interface BendingDimensionInput {
  key: string;
  label: string;
  minRange: number;
  maxRange: number;
  unit: string;
}

export interface BendingTemplate {
  _id: string;
  type: string;
  templateId: string;
  shapeName: string;
  imageUrl: string;
  cuts: number;
  thicknesses: number[];
  materials: string[];
  dimensions: BendingDimension[];
  updatedAt: string;
}

export interface BendingServiceResponse {
  success: boolean;
  data: BendingTemplate[];
}

export interface SingleBendingServiceResponse {
  success: boolean;
  data: BendingTemplate;
}
