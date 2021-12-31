export interface ILineList {
    readonly createTime?: string;
    readonly createUserName?: string;
    readonly deptProcessesId?: string;
    readonly deptProcessesName?: string;
    readonly description?: string;
    readonly id?: string;
    readonly name?: string;
    readonly workshopDeptId?: string;
    readonly workshopDeptName?: string;
}

export interface IDetail {
    readonly name?: string;
    readonly id?: string;
    readonly teamUserVOList?: ITeamUserList[];
    readonly productUnitId?: string;
}

export interface ITeamUserList {
    readonly name?: string;
    readonly position?: string;
    readonly teamId?: string;
    readonly userId?: string;
}