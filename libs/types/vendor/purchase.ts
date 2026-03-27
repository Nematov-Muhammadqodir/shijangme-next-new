import { ProductCollection } from "../../enums/product.enum";

export interface Purchase {
  _id: string;
  memberId: string;
  purchaseDate: string;
  productName: string;
  productCollection?: ProductCollection;
  quantity: number;
  unit: string;
  unitCost: number;
  totalCost: number;
  memo?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PurchaseInput {
  purchaseDate: string;
  productName: string;
  productCollection?: ProductCollection | string;
  quantity: number;
  unit: string;
  unitCost: number;
  memo?: string;
  productPrice?: number;
  productOriginPrice?: number;
  productImages?: string[];
  productDesc?: string;
  productOrigin?: string;
}

export interface PurchaseSummaryItem {
  productName: string;
  totalQuantity: number;
  unit: string;
  totalCost: number;
}

export interface PurchaseSummary {
  items: PurchaseSummaryItem[];
  grandTotal: number;
}

export interface PurchasesInquiry {
  page: number;
  limit: number;
  sort?: string;
  direction?: string;
  search?: {
    startDate?: string;
    endDate?: string;
    text?: string;
  };
}

export interface PurchaseSummaryInput {
  startDate: string;
  endDate: string;
}
