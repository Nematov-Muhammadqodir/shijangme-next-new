import { gql } from "@apollo/client";

/**************************
 *         FRIDGE         *
 *************************/

export const GET_FRIDGE_ITEMS = gql`
  query GetFridgeItems($input: FridgeItemsInquiry!) {
    getFridgeItems(input: $input) {
      list {
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
      metaCounter {
        total
      }
    }
  }
`;

export const GET_VENDOR_FRIDGE = gql`
  query GetVendorFridge($vendorId: String!, $input: FridgeItemsInquiry!) {
    getVendorFridge(vendorId: $vendorId, input: $input) {
      list {
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
      metaCounter {
        total
      }
    }
  }
`;

/**************************
 *         BILLS          *
 *************************/

export const GET_BILLS = gql`
  query GetBills($input: BillsInquiry!) {
    getBills(input: $input) {
      list {
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
      metaCounter {
        total
      }
    }
  }
`;

export const GET_BILL = gql`
  query GetBill($billId: String!) {
    getBill(billId: $billId) {
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

/**************************
 *         LOANS          *
 *************************/

export const GET_MY_LOANS = gql`
  query GetMyLoans($input: LoansInquiry!) {
    getMyLoans(input: $input) {
      list {
        _id
        lenderId
        borrowerId
        loanDate
        status
        items {
          productName
          quantity
          unit
          unitPrice
          totalPrice
          approvedAt
        }
        totalAmount
        paidAt
        memo
        createdAt
        lenderData {
          _id
          memberNick
          memberImage
          memberAddress
        }
      }
      metaCounter {
        total
      }
    }
  }
`;

export const GET_GIVEN_LOANS = gql`
  query GetGivenLoans($input: LoansInquiry!) {
    getGivenLoans(input: $input) {
      list {
        _id
        lenderId
        borrowerId
        loanDate
        status
        items {
          productName
          quantity
          unit
          unitPrice
          totalPrice
          approvedAt
        }
        totalAmount
        paidAt
        memo
        createdAt
        borrowerData {
          _id
          memberNick
          memberImage
          memberAddress
        }
      }
      metaCounter {
        total
      }
    }
  }
`;

export const GET_INCOMING_REQUESTS = gql`
  query GetIncomingRequests($input: BorrowRequestsInquiry!) {
    getIncomingRequests(input: $input) {
      list {
        _id
        requesterId
        targetVendorId
        productName
        quantity
        unit
        unitPrice
        status
        loanId
        message
        createdAt
        requesterData {
          _id
          memberNick
          memberImage
          memberAddress
        }
      }
      metaCounter {
        total
      }
    }
  }
`;

export const GET_MY_REQUESTS = gql`
  query GetMyRequests($input: BorrowRequestsInquiry!) {
    getMyRequests(input: $input) {
      list {
        _id
        requesterId
        targetVendorId
        productName
        quantity
        unit
        unitPrice
        status
        loanId
        message
        createdAt
        targetVendorData {
          _id
          memberNick
          memberImage
        }
      }
      metaCounter {
        total
      }
    }
  }
`;

/**************************
 *       PURCHASES        *
 *************************/

export const GET_PURCHASES = gql`
  query GetPurchases($input: PurchasesInquiry!) {
    getPurchases(input: $input) {
      list {
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
      metaCounter {
        total
      }
    }
  }
`;

export const GET_PURCHASE_SUMMARY = gql`
  query GetPurchaseSummary($input: PurchaseSummaryInput!) {
    getPurchaseSummary(input: $input) {
      items {
        productName
        totalQuantity
        unit
        totalCost
      }
      grandTotal
    }
  }
`;

/**************************
 *        PRESETS         *
 *************************/

export const GET_PRESET_PRODUCTS = gql`
  query GetPresetProducts {
    getPresetProducts {
      _id
      memberId
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
      createdAt
      updatedAt
    }
  }
`;
