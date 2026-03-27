import { gql } from "@apollo/client";

/**************************
 *         FRIDGE         *
 *************************/

export const ADD_FRIDGE_ITEM = gql`
  mutation AddFridgeItem($input: FridgeItemInput!) {
    addFridgeItem(input: $input) {
      _id
      memberId
      productName
      productCollection
      itemStatus
      currentStock
      unit
      memo
      createdAt
      updatedAt
    }
  }
`;

export const RESTOCK_FRIDGE_ITEM = gql`
  mutation RestockFridgeItem($input: FridgeRestockInput!) {
    restockFridgeItem(input: $input) {
      _id
      memberId
      productName
      productCollection
      itemStatus
      currentStock
      unit
      memo
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_FRIDGE_ITEM = gql`
  mutation UpdateFridgeItem($input: FridgeItemUpdate!) {
    updateFridgeItem(input: $input) {
      _id
      memberId
      productName
      productCollection
      itemStatus
      currentStock
      unit
      memo
      createdAt
      updatedAt
    }
  }
`;

export const DELETE_FRIDGE_ITEM = gql`
  mutation DeleteFridgeItem($input: String!) {
    deleteFridgeItem(fridgeItemId: $input) {
      _id
      itemStatus
    }
  }
`;

/**************************
 *         BILLS          *
 *************************/

export const CREATE_BILL = gql`
  mutation CreateBill($input: BillInput!) {
    createBill(input: $input) {
      _id
      memberId
      vendorName
      customerName
      items {
        productName
        quantity
        unit
        unitPrice
        totalPrice
      }
      totalAmount
      billStatus
      memo
      createdAt
      updatedAt
    }
  }
`;

export const DELETE_BILL = gql`
  mutation DeleteBill($billId: String!) {
    deleteBill(billId: $billId) {
      _id
      billStatus
    }
  }
`;

/**************************
 *         LOANS          *
 *************************/

export const CREATE_BORROW_REQUEST = gql`
  mutation CreateBorrowRequest($input: BorrowRequestInput!) {
    createBorrowRequest(input: $input) {
      _id
      requesterId
      targetVendorId
      productName
      quantity
      unit
      unitPrice
      status
      message
      createdAt
    }
  }
`;

export const APPROVE_BORROW_REQUEST = gql`
  mutation ApproveBorrowRequest($requestId: String!) {
    approveBorrowRequest(requestId: $requestId) {
      _id
      status
      loanId
    }
  }
`;

export const REJECT_BORROW_REQUEST = gql`
  mutation RejectBorrowRequest($requestId: String!) {
    rejectBorrowRequest(requestId: $requestId) {
      _id
      status
    }
  }
`;

export const MARK_LOAN_PAID = gql`
  mutation MarkLoanPaid($loanId: String!) {
    markLoanPaid(loanId: $loanId) {
      _id
      status
      paidAt
    }
  }
`;

/**************************
 *       PURCHASES        *
 *************************/

export const CREATE_PURCHASE = gql`
  mutation CreatePurchase($input: PurchaseInput!) {
    createPurchase(input: $input) {
      _id
      memberId
      purchaseDate
      productName
      productCollection
      quantity
      unit
      unitCost
      totalCost
      memo
      createdAt
      updatedAt
    }
  }
`;

/**************************
 *        PRESETS         *
 *************************/

export const CREATE_PRESET_PRODUCT = gql`
  mutation CreatePresetProduct($input: PresetProductInput!) {
    createPresetProduct(input: $input) {
      _id
      productName
      productCollection
      unit
      defaultUnitCost
      defaultQuantity
      productImages
      productPrice
      productOriginPrice
      productDesc
      productOrigin
      sortOrder
    }
  }
`;

export const UPDATE_PRESET_PRODUCT = gql`
  mutation UpdatePresetProduct($input: PresetProductUpdate!) {
    updatePresetProduct(input: $input) {
      _id
      productName
      productCollection
      unit
      defaultUnitCost
      defaultQuantity
      productImages
      productPrice
      productOriginPrice
      productDesc
      productOrigin
      sortOrder
    }
  }
`;

export const DELETE_PRESET_PRODUCT = gql`
  mutation DeletePresetProduct($presetId: String!) {
    deletePresetProduct(presetId: $presetId) {
      _id
    }
  }
`;
