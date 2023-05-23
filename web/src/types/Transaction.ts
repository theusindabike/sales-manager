export interface Transaction {
    id: any;
    type: TransactionType;
    date: any;
    productDescription: any;
    value: any;
    sellerName: any;    
}

export enum TransactionType {
    PRODUCER_SALE = 1,
    AFFILIATE_SALE = 2,
    COMMISSION_PAID = 3,
    COMMISSION_RECIEVED = 4,
}
  