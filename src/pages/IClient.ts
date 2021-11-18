export interface IClient {
    readonly id?: number | string;
    readonly createTime?: string;
    readonly description?: string;
    readonly linkman?: string;
    readonly name?:	number | string;
    readonly phone?:string;	
    readonly tenantId?:	string;
    readonly type?: string | number;	
    readonly createUser?: string | number;
    readonly isDeleted?: number;
    readonly status?: number;
    readonly updateTime?: string;
    readonly updateUser?: string | number;
    readonly bidExplain?: string;
}