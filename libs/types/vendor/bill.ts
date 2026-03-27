export interface BillItem {
  productName: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  totalPrice: number;
}

export interface Bill {
  _id: string;
  memberId: string;
  vendorName: string;
  customerName: string;
  items: BillItem[];
  totalAmount: number;
  billStatus?: string;
  memo?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface BillInput {
  customerName: string;
  items: BillItem[];
  totalAmount: number;
  memo?: string;
}

export interface BillsInquiry {
  page: number;
  limit: number;
  sort?: string;
  direction?: string;
  search?: {
    text?: string;
    startDate?: string;
    endDate?: string;
  };
}
