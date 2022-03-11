export interface IAssignedList {
    readonly id?: string;
    readonly internalNumber?: string;
    readonly planNumber?: string;
    readonly plannedDeliveryTime?: string;
    readonly productCategoryName?: string;
    readonly saleOrderNumber?: string;
    readonly status?: string;
    readonly statusName?: string;
    readonly taskNum?: string;
    readonly updateStatusTime?: string;
    readonly materialDeliverTime?: string;
    readonly description?: string;
    readonly materialLeaderName?: string;
    readonly priorityName?: string;
    readonly patternName?: string;
    readonly statusRecordList?: IStatusRecordList[];
    readonly materialLeader?: string;
    readonly priority?: string;
    readonly materialLeaderDept?: string;
}
export interface IStatusRecordList {
    readonly createDept?: string;
    readonly createDeptName?: string;
    readonly createTime?: string;
    readonly createUser?: string;
    readonly createUserName?: string;
    readonly currentStatus?: string;
    readonly description?: string;
    readonly id?: string;
}