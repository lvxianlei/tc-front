export interface IContract {
    readonly id?: number | string;
    readonly chargeType?: string | number;
    readonly contractNumber?: string;
    readonly createTime?: string;
    readonly createUser?: number;
    readonly currencyType?: number;
    readonly customerCompany?: string;
    readonly deliveryTime?: string;
    readonly internalNumber?: string;
    readonly projectName?: string;
    readonly saleType?: number;
    readonly signContractTime?: string;
    readonly signCustomerName?: string;
    readonly signCustomerId?: string | number;
}