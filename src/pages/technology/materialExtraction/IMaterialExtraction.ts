export interface IMaterialExtraction {
    readonly id: string | number;
    readonly createTime?: string;
    readonly createUser?: number | string;
    readonly createUserName?: string;
    readonly batchSn?: string;
    readonly description?: string;
    readonly materialStandard?: string;
    readonly materialStandardName?: string;
    readonly productCategoryName?: string;
    projectName?: string;
    taskNumber?: string;
    taskNoticeId?: string | number;
    steelProductShape?: string;
    productCategoryId?: string | number;
}

export interface IDetail {
    readonly id?: number | string;
    readonly thickness?: number;
    readonly width?: number;
    readonly subtotalWeight: number;
    readonly spec?: string;
    readonly singleWeight?: number;
    readonly rowMaterial?: string;
    readonly partNum?: string;
    readonly number: number;
    readonly materialTexture?: string;
    readonly length?: number;
    readonly drawingComponentId?: string | number;
    readonly description?: string;
    readonly componentCode?: string;
    readonly accurateWeight?: number;
    readonly sectionSn?: number;
    totalQuantity: number;
    totalWeight: string;
}


export interface IParagraph {
    readonly id?: number | string;
    readonly extractionMaterialId?: string;
    readonly sectionSn?: string;
    readonly allocatedSectionCount?: string;
    readonly towerProductId?: string;
    sectionCount: number|string;
}


export interface ITower{
    readonly id: string | number;
    readonly productCategoryName: string;
    readonly steelProductShape: string;
}