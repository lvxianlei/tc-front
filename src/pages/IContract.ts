export interface IContract {
    readonly id?: number | string;
    readonly chargeType?: string | number;
    readonly contractNumber?: string;
    readonly createTime?: string;
    readonly createUser?: number | string;
    readonly createUserName?: string;
    readonly currencyType?: number;
    readonly customerCompany?: string;
    readonly deliveryTime?: string;
    readonly internalNumber?: string;
    readonly isDeleted?: number;
    readonly projectName?: string;
    readonly saleType?: number;
    readonly signContractTime?: string;
    readonly signCustomerName?: string;
    readonly signCustomerId?: string | number;
    readonly status?: number;
    readonly simpleProjectName?: string;
    readonly signUserName?: string;
    readonly tenantId?: number | string;
    readonly updateTime?: string;
    readonly updateUser?: string | number;
    readonly updateUserName?: string;
    readonly voltageGrade?: string | number;
    readonly winBidType?: number | string;
    readonly productType?: number | string;
    readonly reviewTime?: string;
    readonly salesman?: string;
    readonly contractAmount?: number;
    readonly description?: string;
    readonly planType?: number | string;
    readonly region?: [];
    readonly countryCode?: number;
    readonly currencyTypeName?: string;
    readonly saleTypeName?: string;
    readonly winBidTypeName?: string;
    readonly productTypeName?: string;
    readonly voltageGradeName?: string;
    readonly isRelateOrder?: number;
    readonly payCompanyName?: string;
    readonly purchaseOrderNumber?: string;
    readonly takeOverTime?: string;
    readonly contractList?: IResponseList;
    readonly payServiceManager?: string;
    readonly contractName?: string; // 合同名称
}

interface IResponseList {
    readonly id: number;
    readonly size: number;
    readonly current: number;
    readonly total: number;
    readonly records: IContract[];
}