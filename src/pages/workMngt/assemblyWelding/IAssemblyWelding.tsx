export interface ISegmentNameList {
    readonly id?: string;
    readonly name?: string;
}

export interface IResponseData {
    readonly id: number;
    readonly size: number;
    readonly current: number;
    readonly total: number;
    readonly records: IData[];
}

interface IData {
    readonly id?: string;
    readonly mainPartId?: string;
    readonly segmentId?: string;
    readonly segmentName?: string;
}

export interface IComponentList {
    readonly basicsWeight?: number;
    readonly id?: string;
    readonly basicsPartNumNow?: number;
    readonly weldingLength?: number;
    readonly singleNum?: number;
    readonly isMainPart?: number;
    readonly structureId?: string;
    readonly surplusNum?: number;
    readonly segmentId?: string | number;
    readonly numberRemaining?: number;
}

export interface IBaseData {
    readonly segmentName?: string;
    readonly singleGroupWeight?: number;
    readonly componentId?: string;
    readonly electricWeldingMeters?: number;
    readonly mainPartId?: string;
    readonly id?: string;
    readonly type?: string;
    readonly singleGroupNumber?: number;
}