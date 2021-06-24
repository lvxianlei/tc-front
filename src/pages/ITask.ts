export interface ITask {
    readonly id?: number | string;
    readonly deliveryTime?: string;
    readonly description?: string;		
    readonly internalNumber?: string;
    readonly materialDemand?: string;
    readonly materialStandard?:	number | string;
    readonly galvanizeDemand?:string;	
    readonly planDeliveryTime?:	string;
    readonly packDemand?: string;	
    readonly peculiarDescription?: string;
    readonly weldingDemand?: string;
    readonly contractId?: string | number;
    readonly saleOrderId?: string | number;
    readonly status?: number;
    readonly materialStandardName?: string;
    readonly projectName?: string;
    readonly saleOrderNumber?: string;
    readonly taskNumber?: string;
    readonly taskReviewStatus?: number;	
}