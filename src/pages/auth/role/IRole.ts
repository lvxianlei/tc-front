/**
 * @author Cory(coryisbest0728#gmail.com)
 * @copyright © 2021 Cory. All rights reserved
 */
export interface IMetaRole {
    readonly id: number;
    readonly name: string;
    readonly clientId: string;
    readonly code: string;
    readonly description: string;
    readonly hasChildren: boolean;
    readonly isDeleted: number;
    readonly parentId: number;
    readonly parentName: string;
    readonly sort: number;
    readonly tenantId: string;
}

export interface IRole extends IMetaRole {
    readonly children: IRole[];
}

export interface IAuthority {
    readonly id: number;
    readonly categoryId: number;
    readonly categoryName: string;
    readonly checked: boolean;
    readonly code: string;
    readonly createTime: string;
    readonly createUser: number;
    readonly description: string;
    readonly hasChildren: boolean;
    readonly isDeleted: number;
    readonly name: string;
    readonly parentId: number;
    readonly status: number;
    readonly updateTime: string;
    readonly updateUser: number;
    readonly children: IAuthority[];
}