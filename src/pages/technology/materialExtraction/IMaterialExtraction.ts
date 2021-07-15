export interface IMaterialExtraction {
    readonly id: string;
    readonly createTime?: string;
    readonly createUser?: number | string;
    readonly createUserName?: string;
    readonly projectName?: string;
    readonly batchSn?: string;
    readonly description?: string;
    readonly embossedStamp?: number;
    readonly materialStandard?: string;
    readonly materialStandardName?: string;
    readonly productShape?: string;
    readonly taskNumber?: string;
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
    readonly number?: number;
    readonly materialTexture?: string;
    readonly length?: number;
    readonly drawingComponentId?: string | number;
    readonly description?: string;
    readonly componentCode?: string;
    readonly accurateWeight?: number;
    readonly sectionSn?: number;
    totalQuantity: number;
    totalWeight: number;
}


export interface IParagraph {
    readonly id?: number | string;
    readonly extractionMaterialId?: string;
    readonly sectionSn?: string;
    readonly sectionTotalCount?: string;
    readonly towerProductId?: string;
    sectionCount: number;
}