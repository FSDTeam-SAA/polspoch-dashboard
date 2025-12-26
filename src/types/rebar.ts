
export interface RebarDimension {
  _id: string;
  key: string;
  label: string;
  minRange: number;
  maxRange: number;
  unit: string;
  isCalculated: boolean;
  formula?: string;
}

export interface RebarTemplate {
  _id: string;
  type: string;
  templateId: string;
  shapeName: string;
  imageUrl: string;
  availableDiameters: number[];
  dimensions: RebarDimension[];
}

export interface RebarServiceResponse {
  success: boolean;
  data: RebarTemplate[];
}

export interface RebarTemplateDetailsResponse {
  success: boolean;
  data: RebarTemplate;
}
