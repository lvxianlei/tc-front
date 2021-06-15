export interface ITask {
    readonly id?: number | string;
    readonly deliveryTime?: string;
    readonly internalNumber?: string;
    readonly materialDemand?: string;
    readonly materialStandard?:	number | string;
    readonly galvanizeDemand?:string;	
    readonly planDeliveryTime?:	string;
    readonly packDemand?: string;	
    readonly peculiarDescription?: string;
    readonly weldingDemand?: string;	
}