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

export interface PdmModalProps {
    onSubmit: () => void;
}

export interface allotModalProps {
    onSubmit: () => void;
    onSave: () => void;
}

export interface IAllot {
    readonly id?: string;
    readonly productCategory?: string;
    readonly productCategoryName?: string;
    readonly productHeight?: string;
    readonly productNumber?: string;
    readonly segmentInformation?: string;
    readonly specialStatus?: string;
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
    
}