import { ProductCollection } from "../../enums/product.enum";

export interface PresetProduct {
  _id: string;
  memberId: string;
  productName: string;
  productCollection?: ProductCollection;
  unit: string;
  defaultUnitCost?: number;
  defaultQuantity?: number;
  productImages?: string[];
  productPrice?: number;
  productOriginPrice?: number;
  productDesc?: string;
  productOrigin?: string;
  sortOrder?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface PresetProductInput {
  productName: string;
  productCollection?: ProductCollection | string;
  unit: string;
  defaultUnitCost?: number;
  defaultQuantity?: number;
  productImages?: string[];
  productPrice?: number;
  productOriginPrice?: number;
  productDesc?: string;
  productOrigin?: string;
}
