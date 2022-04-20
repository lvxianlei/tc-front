export interface TryAssembleProps {
    onSubmit: () => void
    resetFields: () => void
}

export interface IResponseData {
    readonly id: number;
    readonly size: number;
    readonly current: number;
    readonly total: number;
    readonly records: [];
}

export interface ILofting {
    readonly id?: string;
    readonly segmentName?: string;
    readonly code?: string;
    readonly materialName?: string;
    readonly structureTexture?: string;
    readonly structureSpec?: string;
    readonly width?: string;
    readonly thickness?: string;
    readonly length?: string;
    readonly basicsPartNum?: string;
    readonly basicsWeight?: string;
    readonly totalWeight?: string;
    readonly holesNum?: string;
    readonly description?: string;
    readonly electricWelding?: string;
    readonly bend?: string;
    readonly chamfer?: string;
    readonly shovelBack?: string;
    readonly rootClear?: string;
    readonly squash?: string;
    readonly openCloseAngle?: string;
    readonly perforate?: string;
    readonly groove?: string;
    readonly intersectingLine?: string;
    readonly slottedForm?: string;
    readonly type?: string;
    readonly sides?: string;
    readonly perimeter?: string;
    readonly surfaceArea?: string;
    readonly apertureNumber?: string;
    readonly weldingEdge?: string;
}

export interface modalProps {
    onSubmit: () => void;
    resetFields: () => void
}

export interface allotModalProps {
    onSubmit: () => void;
    onSave: () => void;
    onCheck: () => void;
    resetFields:()=> void;
    visibleData:()=> void;
    selectedRowKeys: string[];
}

export interface IAllot {
    readonly id?: string;
    readonly productCategory?: string;
    readonly productCategoryName?: string;
    readonly productHeight?: string;
    readonly productNumber?: string;
    readonly segmentInformation?: string;
    readonly packageStructureCount?:string;
    readonly specialStatus?: number;
    readonly loftingProductStructureVOS?: ILoftingProductStructureVOS[];
}

export interface ILoftingProductStructureVOS {
    readonly basicsPartNum?: string;
    readonly basicsWeight?: string;
    readonly code?: string;
    readonly codeRelation?: string;
    readonly description?: string;
    readonly holesNum?: string;
    readonly id?: string;
    readonly length?: string;
    readonly materialName?: string;
    readonly productCategoryId?: string;
    readonly segmentGroupId?: string;
    readonly segmentId?: string;
    readonly segmentName?: string;
    readonly smallSample?: string;
    readonly specName?: string;
    readonly structureSpec?: string;
    readonly structureTexture?: string;
    readonly thickness?: string;
    readonly totalWeight?: string;
    readonly uploadTime?: string;
    readonly width?: string;
    readonly specialBasicsPartNum?: string;

}

export interface IData {
    readonly ncCount: string;
    readonly structureCount: string;
}

export interface IBundle {
    readonly id?: string;
    readonly towerStructureId?: string;
    readonly productCategoryId?: string;
    readonly balesCode?: string;
    readonly productId?: string;
    readonly num?: number;
    readonly code?: string;
    readonly structureSpec?: string;
    readonly length?: string;
    readonly description?: string;
    readonly structureNum?: number;
    readonly structureCount?: number;
    readonly materialSpec?: string;
    readonly structureId?: string;
    readonly topId?: string;
    readonly pieceCode?: string;
    readonly basicsWeight?: number;
    readonly weldingStructureList?: IBundle[];
    readonly isChild?: boolean;
    readonly structureRemainingNum?: number;
    readonly businessId?: string;
    readonly mainStructureId?: string;
    readonly singleNum?: string;
    readonly isWelding?: number;
    readonly structureCountNum?: string;
    readonly totalWeight?: number;
    readonly isMainPart?: number;
    readonly packageRemainingNum?: string;
}

export interface IPackingList {
    readonly balesCode?: string;
    readonly productCategoryId?: string;
    readonly productCategoryName?: string;
    readonly productId?: string;
    readonly productNumber?: string;
    readonly packageRecordVOList?: IBundle[];
    readonly toChooseList?: IBundle[];
    readonly id?: string;
    readonly description?: string;
    readonly packageType?: string;
    readonly structureNum?: number;
    readonly topId?: string;
    readonly packageAttributeName?: string;
}

export interface IDetailData {
    readonly productCategoryId?: string;
    readonly productCategoryName?: string;
    readonly productId?: string;
    readonly productNumber?: string;
    readonly legNumberA?: string;
    readonly legNumberB?: string;
    readonly legNumberC?: string;
    readonly legNumberD?: string;
    readonly loftingProductSegmentList?: IProductSegmentList[];
}

export interface IProductSegmentList {
    readonly productCategoryId?: string;
    readonly segmentName?: string;
    readonly id?: string | number;
    readonly count?: string;
    readonly segmentId?: string;
}

export interface IRecord {
    readonly id?: string;
    readonly problemField?: string;
    readonly originalData?: string;
    readonly description?: string;
    readonly newValue?: string;
    readonly issueRecordList?: [];
    readonly status?: number;
    readonly dataIndex?: string;
    readonly rowId?: string;
    readonly currentValue?: string;
    readonly problemFieldName?: string;
}

export interface ICount {
    readonly id?: string;
    readonly count?: string;
    readonly packageStructureCount?: string;
    readonly productCategoryId?: string;
    readonly productCategoryName?: string;
    readonly productId?: string;
    readonly productNumber?: string;
    readonly untreatedCount?: string;
}

export interface ITower {
    readonly id?: string;
    readonly productNumber?: string;
    readonly productHeight?: string;
}
