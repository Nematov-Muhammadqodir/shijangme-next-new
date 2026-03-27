import { LoanStatus, BorrowRequestStatus } from "../../enums/vendor.enum";

export interface LoanItem {
  productName: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  totalPrice: number;
  approvedAt?: Date;
}

export interface Loan {
  _id: string;
  lenderId: string;
  borrowerId: string;
  loanDate: string;
  status: LoanStatus;
  items: LoanItem[];
  totalAmount: number;
  paidAt?: Date;
  memo?: string;
  createdAt: Date;
  lenderData?: {
    _id: string;
    memberNick: string;
    memberImage: string;
    memberAddress: string;
  };
  borrowerData?: {
    _id: string;
    memberNick: string;
    memberImage: string;
    memberAddress: string;
  };
}

export interface BorrowRequest {
  _id: string;
  requesterId: string;
  targetVendorId: string;
  productName: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  status: BorrowRequestStatus;
  loanId?: string;
  message?: string;
  createdAt: Date;
  requesterData?: {
    _id: string;
    memberNick: string;
    memberImage: string;
    memberAddress: string;
  };
  targetVendorData?: {
    _id: string;
    memberNick: string;
    memberImage: string;
  };
}

export interface BorrowRequestInput {
  targetVendorId: string;
  productName: string;
  quantity: number;
  unit: string;
  unitPrice?: number;
  message?: string;
}

export interface LoansInquiry {
  page: number;
  limit: number;
  sort?: string;
  direction?: string;
  search?: {
    status?: LoanStatus;
  };
}

export interface BorrowRequestsInquiry {
  page: number;
  limit: number;
  sort?: string;
  direction?: string;
  search?: {
    status?: BorrowRequestStatus;
  };
}
