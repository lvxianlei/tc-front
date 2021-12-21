export interface IDetailData {
    readonly createTime?: string;
    readonly createUserName?: string;
    readonly deptProcessesId?: string;
    readonly deptProcessesName	?: string;
    readonly description?: string;
    readonly id?: string;
    readonly name?: string;
    readonly workshopDeptId?: string;
    readonly workshopDeptName?: string;
}


export interface IWorkCenterMngt {
    readonly sort?: string;
    readonly name?: string;
    readonly id?: string;
}

export interface IDetailData {
    readonly deptId?: string;
    readonly deptName?: string;
    readonly id?: string;
    readonly deptProcessesDetailList?: IWorkCenterMngt[];
}

export interface EditRefProps {
    onSubmit: () => void
    resetFields: () => void
}