/**
 * @author Cory(coryisbest0728#gmail.com)
 * @copyright © 2021 Cory. All rights reserved
 */
import { Input, TreeSelect } from 'antd';
import { FormInstance } from 'rc-field-form/es/interface';
import { RuleObject, StoreValue } from 'rc-field-form/lib/interface';
import { DataNode as SelectDataNode } from 'rc-tree-select/es/interface';
import React from 'react';
import { RouteComponentProps } from 'react-router';

import AbstractFillableComponent, {
    IAbstractFillableComponentState,
    IFormItemGroup,
} from '../../../components/AbstractFillableComponent';
import layoutStyles from '../../../layout/Layout.module.less';
import RequestUtil from '../../../utils/RequestUtil';
import { IRole } from '../../auth/role/IRole';
import { IUser } from './IUser';

export interface IAbstractUserSettingState extends IAbstractFillableComponentState {
    readonly user?: IUser;
    readonly roles?: IRole[];
    readonly department?: IRole[];
}

/**
 * The abstract role setting
 */
export default abstract class AbstractUserSetting<P extends RouteComponentProps, S extends IAbstractUserSettingState> extends AbstractFillableComponent<P, S> {

    public state: S = this.getState();

    /**
     * @description Gets state
     * @returns state 
     */
    protected getState(): S {
        return {
            user: undefined,
            roles: undefined
        } as S;
    }

    /**
     * @description Components did mount
     */
    public async componentDidMount() {
        super.componentDidMount();
        const roles: IRole[] = await RequestUtil.get<IRole[]>('/sinzetech-system/role/tree');
        const department: IRole[] = await RequestUtil.get<IRole[]>('/sinzetech-user/department/tree');
        this.setState({
            roles: roles,
            department,
        });
    }

    /**
     * @override
     * @description Gets return path
     * @returns return path 
     */
    protected getReturnPath(): string {
        return '/sys/users';
    }

    /**
     * @description Wraps role to data node
     * @param [roles] 
     * @returns role to data node 
     */
    protected wrapRole2DataNode(roles: (IRole & SelectDataNode)[] = []): SelectDataNode[] {
        roles.forEach((role: IRole & SelectDataNode): void => {
            role.value = role.id;
            if (role.children && role.children.length) {
                this.wrapRole2DataNode(role.children);
            }
        });
        return roles;
    }

    /**
     * @implements
     * @description Gets form item groups
     * @returns form item groups 
     */
    public getFormItemGroups(): IFormItemGroup[][] {
        return [[{
            title: '基本信息',
            itemCol: {
                span: 12
            },
            itemProps: [{
                label: '登录账号',
                name: 'account',
                initialValue: this.state.user?.account,
                children: <Input placeholder="请输入登录账号" />,
                rules: [{
                    required: true,
                    message: '请输入登录账号!'
                }]
            }, {
                label: '用户姓名',
                name: 'name',
                initialValue: this.state.user?.name,
                children: <Input placeholder="请输入用户姓名" />,
                rules: [{
                    required: true,
                    message: '请输入用户姓名!'
                }]
            }, {
                label: '密码',
                name: 'password',
                hasFeedback: true,
                initialValue: this.state.user?.password,
                children: <Input.Password placeholder="请输入密码" />,
                rules: [{
                    required: true,
                    message: '请输入密码!'
                }]
            }, {
                label: '确认密码',
                name: 'confirm',
                dependencies: ['password'],
                hasFeedback: true,
                children: <Input.Password placeholder="请输入确认密码" />,
                rules: [{
                    required: true,
                    message: '请输入确认密码!'
                }, (form: FormInstance): RuleObject => {
                    return {
                        validator: (rule: RuleObject, value: StoreValue): Promise<void> => {
                            if (!value || form.getFieldValue('password') === value) {
                                return Promise.resolve();
                            }
                            return Promise.reject(new Error('密码与确认密码不匹配!'));
                        }
                    };
                }]
            }]
        }, {
            title: '详细信息',
            itemCol: {
                span: 12
            },
            itemProps: [{
                label: '手机号码',
                name: 'phone',
                initialValue: this.state.user?.phone,
                children: <Input placeholder="请输入手机号码" />
            }, {
                label: '电子邮箱',
                name: 'email',
                initialValue: this.state.user?.email,
                children: <Input placeholder="请输入电子邮箱" />
            }]
        }, {
            title: '职责信息',
            itemCol: {
                span: 12
            },
            itemProps: [{
                label: '所属角色',
                name: 'roleIds',
                initialValue: this.state.user?.roleIds?.split(','),
                children: <TreeSelect showSearch={true} placeholder="请选择所属角色" multiple={true}
                    className={layoutStyles.width100} treeData={this.wrapRole2DataNode(this.state.roles)} />,
                rules: [{
                    required: true,
                    message: '请输入所属角色!'
                }]
            }, {
                label: '所属部门',
                name: 'departmentId',
                initialValue: this.state.user?.departmentId,
                children: <TreeSelect showSearch={true} placeholder="请选择所属机构"
                    className={layoutStyles.width100} treeData={this.wrapRole2DataNode(this.state.department)} />,
                rules: [{
                    required: true,
                    message: '请输入所属机构!'
                }]
            }]
        }]];
    }
}