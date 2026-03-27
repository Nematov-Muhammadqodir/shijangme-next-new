import { FridgeItemStatus } from "../../enums/vendor.enum";
import { ProductCollection } from "../../enums/product.enum";

export interface FridgeItem {
  _id: string;
  memberId: string;
  productName: string;
  productCollection: ProductCollection;
  itemStatus: FridgeItemStatus;
  currentStock: number;
  unit: string;
  memo?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface FridgeItemInput {
  productName: string;
  productCollection: ProductCollection | string;
  currentStock: number;
  unit: string;
  memo?: string;
}

export interface FridgeRestockInput {
  productName: string;
  productCollection: ProductCollection | string;
  amount: number;
  unit: string;
}

export interface FridgeItemUpdate {
  _id: string;
  currentStock?: number;
  itemStatus?: FridgeItemStatus;
  memo?: string;
}

export interface FridgeItemsInquiry {
  page: number;
  limit: number;
  sort?: string;
  direction?: string;
  search?: {
    itemStatus?: FridgeItemStatus;
    text?: string;
  };
}
