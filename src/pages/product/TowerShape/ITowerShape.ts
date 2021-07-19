export interface ITowerShape {
    readonly id?: string;
    readonly description?: string;
    readonly internalNumber?: string;
    readonly operateStatus?: number;
    readonly name?: string;
    readonly projectName?: string;
    readonly steelProductShape?: string;
    readonly contractId?: string;
    readonly productDTOList?: IProductDTOList[];
    readonly productVOList?: IProductDTOList[];
    readonly productCategoryName?: string;
    readonly productChangeRecordVos?: IProductDTOList[];
}

export interface IProductDTOList {
    readonly index?: number;
    readonly bodyWeight?: number;
    readonly description?: string;
    readonly id?: string | number;
    readonly lineName?: string;
    readonly productAdditionalDTOList?: IProductAdditionalDTOList[];
    readonly productAdditionalVOList?: IProductAdditionalDTOList[];
    readonly productHeight?: number;
    readonly productNumber?: string;
    readonly productCategoryName?: string;
    readonly productShapeId?: number;
    readonly productType?: string | number;
    readonly productWeight?: number;
    readonly towerFootWeight?: number;
    readonly towerLeg1Length?: number;
    readonly towerLeg1Num?: string;
    readonly towerLeg1Weight?: number;
    readonly towerLeg2Length?: number;
    readonly towerLeg2Num?: string;
    readonly towerLeg2Weight?: number;
    readonly towerLeg3Length?: number;
    readonly towerLeg3Num?: string;
    readonly towerLeg3Weight?: number;
    readonly towerLeg4Length?: number;
    readonly towerLeg4Num?: string;
    readonly towerLeg4Weight?: number;
    readonly voltageGrade?: string | number;
    readonly productDeployVOList?: IProductDeployVOList[];
    readonly productDeployDTOList?: IProductDeployVOList[];
    readonly status?: number;
    readonly productAdditional?: number;
    readonly productCategoryId?: string | number;
    readonly productDeployIdList?: (string | number)[];
}

export interface IProductAdditionalDTOList {
    readonly id?: number | string;
    readonly additionalItem?: string;
    readonly productId?: string | number;
    readonly weight?: number;
}

export interface IProductDeployVOList {
    readonly id?: number | string;
    readonly number?: number;
    readonly partNum?: string;
    readonly productId?: string | number;
}