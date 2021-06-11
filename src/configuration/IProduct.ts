export interface IProduct {
    readonly id?: number | string;
    readonly lineName?: string;
    readonly num?: number;
    readonly price?: number;
    readonly productStatus?: number;
    readonly description?: string;	
    readonly productHeight?: number;
    readonly productNumber?: string;
    readonly productShape?: string;	
    readonly productType?: number;
    readonly saleOrderId?: number | string;
    readonly taskNoticeId?: number | string;
    readonly tender?: string;
    readonly totalAmount?: number;
    readonly winBidType?: number;
    readonly unit?: string;
    readonly voltageGrade?: number;
}