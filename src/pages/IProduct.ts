export interface IProduct {
    readonly id?: number | string;
    readonly lineName?: string;
    readonly num?: number;
    readonly price?: number;
    readonly status?: number | string;
    readonly description?: string;	
    readonly productHeight?: number;
    readonly productNumber?: string;
    readonly productCategoryName?: string;	
    readonly productType?: number | string;
    readonly saleOrderId?: number | string;
    readonly taskNoticeId?: number | string;
    readonly tender?: string;
    readonly totalAmount?: number;
    readonly unit?: string;
    readonly voltageGrade?: number | string;
    readonly voltageGradeName?: string;
    readonly productTypeName?: string;
    readonly index?: number;
    readonly changeType?: number;
    readonly createTime?: string;
}