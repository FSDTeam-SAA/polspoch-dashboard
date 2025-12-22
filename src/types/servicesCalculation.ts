export interface RebarMaterialData {
  _id: string;
  diameter: number;
  price: number;
  weight: number;
}

export interface BendingMaterialData {
  _id: string;
  thickness: number;
  rawsteel: number;
  galvanized: number;
  corten: number;
  teardrop: number;
  darkGreen: number;
  red: number;
  white: number;
}

export interface CuttingMaterialData {
  _id: string;
  thickness: number;
  rawsteel: number;
  galvanized: number;
  corten: number;
}

export interface ServiceDetail<T> {
  labour: {
    startingPrice: number;
    [key: string]: number;
  };
  materialData: T[];
  margin: number;
}

export interface ServicesCalculationData {
  rebar: ServiceDetail<RebarMaterialData>;
  bending: ServiceDetail<BendingMaterialData>;
  cutting: ServiceDetail<CuttingMaterialData>;
  _id: string;
  updatedAt: string;
}

export interface ServicesCalculationResponse {
  success: boolean;
  data: ServicesCalculationData;
}
