export interface ISegmentNameList {
    readonly id?: string;
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