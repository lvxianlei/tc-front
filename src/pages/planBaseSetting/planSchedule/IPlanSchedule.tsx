export interface IPlanSchedule {
    readonly id?: string;
    readonly approvalTime?: string;
    readonly businessManager?: string;
    readonly businessManagerName?: string;
    readonly customerCompany?: string;
    readonly deliveryTime?: string;
    readonly description?: string;
    readonly loftingIssueUser?: string;
    readonly loftingIssueUserName?: string;
    readonly lineName?: string;
    readonly loftCompleteTime?: string;
    readonly loftIssueTime?: string;
    readonly loftRealCompleteTime?: string;
    readonly planDeliveryTime?: string;
    readonly planNumber?: string;
    readonly productCategory?: string;
    readonly productCategoryId?: string;
    readonly productCategoryName?: string;
    readonly productNum?: string;
    readonly productType?: string;
    readonly productTypeName?: string;
    readonly loftingStatus?: string;
    readonly voltageGradeName?: string;
    readonly weight?: string;
    readonly planId?: string;
    readonly issueDescription?: string;
    readonly productionBatchNo?: string;
    readonly customerDeliveryTime?: string;
}

export interface IUnit {
    readonly id: string;
    readonly name?: string;
    readonly productUnitCode?: string;
}

export interface ILink {
    readonly id: string;
    readonly name?: string;
}