/**
 * @author Cory(coryisbest0728#gmail.com)
 * @copyright © 2021 Cory. All rights reserved
 * More info please see {@link http://47.111.254.114:3001/project/83/interface/api/4079}
 */

export interface IUser {
    readonly account?: string;
    readonly clientId?: string;
    readonly createTime?: string;
    readonly createUser?: number;
    readonly departmentId?: number;
    readonly departmentName?: string;
    readonly email?: string;
    readonly id?: number;
    readonly isDeleted?: number;
    readonly name?: string;
    readonly openId?: string;
    readonly password?: string;
    readonly phone?: string;
    readonly portrait?: string;
    readonly roleIds?: string;
    readonly status?: number;
    readonly tenantId?: string;
    readonly tenantName?: string;
    readonly updateTime?: string;
    readonly updateUser?: number;
    readonly userId?: number;
    readonly userRoleList?: number[];
    readonly userRoleNames?: string;
}