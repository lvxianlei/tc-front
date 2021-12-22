
export interface IShopFloorPlan {
    readonly id?: string;
    readonly angle110?: string;
    readonly angle160?: string;
    readonly angle161?: string;
    readonly angle40?: string;
    readonly angle50?: string;
    readonly angle63?: string;
    readonly angle70?: string;
    readonly angle75?: string;
    readonly angle90?: string;
    readonly endTime?: string;
    readonly orderProjectName?: string;
    readonly planNumber?: string;
    readonly productCategoryName?: string;
    readonly productNum?: number;
    readonly unitId?: string;
    readonly unitName?: string;
    readonly weight?: number;
    readonly workPlanNumber?: string;
}

export interface ISchedulingList {
    readonly id?: string;
    readonly basicsPartNum?: string;
    readonly code?: string;
    readonly endTime?: string;
    readonly holesNum?: string;
    readonly length?: string;
    readonly materialName?: string;
    readonly planNumber?: string;
    readonly processFlow?: string;
    readonly processingNum?: string;
    readonly productCategoryName?: string;
    readonly segmentName?: string;
    readonly startTime?: string;
    readonly structureSpec?: string;
    readonly totalWeight?: string;
    readonly type?: string;
    readonly workCenterId?: string;
    readonly workCenterName?: string;
    readonly workPlanId?: string;
    readonly workPlanNumber?: string;
}