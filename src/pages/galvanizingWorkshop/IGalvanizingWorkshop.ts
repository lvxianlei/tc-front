export interface IDailySchedule{
    readonly angleWeight?: string;
    readonly deliveryTime?: string;
    readonly galvanizedStartTime?: string;
    readonly id?: string;
    readonly internalNumber?: string;
    readonly issueWeight?: string;
    readonly maintenanceTeamName?: string;
    readonly maintenanceTeamId?: string;
    readonly orderName?: string;
    readonly packagingTeamName?: string;
    readonly picklingTeamName?: string;
    readonly picklingTeamId?: string;
    readonly planNo?: string;
    readonly plateGalvanizedCompleteTime?: string;
    readonly plateWeight?: string;
    readonly potGalvanizedCompleteTime?: string;
    readonly productCategoryId?: string;
    readonly productCategoryName?: string;
    readonly productDeliveryTime?: string;
    readonly productNum?: string;
    readonly voltageGrade?: string;
    readonly wearHangTeamName?: string;
    readonly wearHangTeamId?: string;
    readonly zincPotTeamName?: string;
    readonly zincPotTeamId?: string;
    readonly status?: string;
    readonly angleTotalWeight?: string;
    readonly issueTotalWeight?: string;
    readonly plateTotalWeight?: string;
}

export interface IWeighingList {
    readonly derrickNo?: string;
    readonly id?: string;
    readonly maintenanceTeamName?: string;
    readonly picklingTeamName?: string;
    readonly relationProducts?: IRelationProducts[];
    readonly wearHangTeamName?: string;
    readonly weighMan?: string;
    readonly weighingDate?: string;
    readonly weighingNo?: string;
    readonly weighingType?: string;
    readonly weight?: string;
    readonly zincPotTeamName?: string;
}


export interface IRelationProducts {
    readonly weighingId?: string;
    readonly id?: string;
    readonly internalNumber?: string;
    readonly orderName?: string;
    readonly planNo?: string;
    readonly productCategoryName?: string;
    readonly productNum?: string;
    readonly voltageGrade?: string;
}