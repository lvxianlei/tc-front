/**
 * @author Cory(coryisbest0728#gmail.com)
 * @copyright © 2021 Cory. All rights reserved
 */
import { Input, InputNumber, Select, Tree, TreeSelect } from 'antd';
import { DataNode } from 'rc-tree/lib/interface';
import { DataNode as SelectDataNode } from 'rc-tree-select/es/interface';
import React from 'react';
import { RouteComponentProps } from 'react-router';

import AbstractFillableComponent, {
    IAbstractFillableComponentState,
    IFormItemGroup,
} from '../../../components/AbstractFillableComponent';
import layoutStyles from '../../../layout/Layout.module.less';
import RequestUtil from '../../../utils/RequestUtil';
import { IRole, IMetaRole, IAuthority } from './IRole';

export interface IRoleDetail extends IMetaRole {
    readonly functionIdList: number[];
}

export interface IAbstractRoleSettingState extends IAbstractFillableComponentState {
    readonly authorities?: IAuthority[];
    readonly roles?: IRole[];
    readonly checkedFunctionKeys?: React.Key[];
    readonly roleDetail?: IRoleDetail;
    readonly expandKeys?: React.Key[];
    readonly autoExpandParent?: boolean;
}

/**
 * The abstract role setting
 */
export default abstract class AbstractRoleSetting<P extends RouteComponentProps, S extends IAbstractRoleSettingState> extends AbstractFillableComponent<P, S> {

    public state: S = this.getState();

    /**
     * @description Gets state
     * @returns state 
     */
    protected getState(): S {
        return {
            authorities: undefined,
            roles: undefined,
            roleDetail: undefined,
            checkedFunctionKeys: undefined,
            expandKeys: undefined,
            autoExpandParent: true
        } as S;
    }

    /**
     * @description Components did mount
     */
    public async componentDidMount() {
        const authorities: IAuthority[] = await RequestUtil.get<IAuthority[]>('/sinzetech-system/function/tree');
        const roles: IRole[] = await RequestUtil.get<IRole[]>('/sinzetech-system/role/tree');
        this.setState({
            authorities: authorities,
            roles: roles,
            expandKeys: this.expandKeysByValue(authorities)
        });
    }

    /**
     * @override
     * @description Gets return path
     * @returns return path 
     */
     protected getReturnPath(): string {
        return '/auth/roles';
    }
    
    /**
     * @description Wraps authority to data node
     * @param [authorities] 
     * @returns authority to data node 
     */
    protected wrapAuthority2DataNode(authorities: (IAuthority & DataNode)[] = []): DataNode[] {
        authorities.forEach((authority: (IAuthority & DataNode)): void => {
            authority.title = authority.name;
            authority.key = authority.id;
            authority.selectable = authority.checked;
            if (authority.children && authority.children.length) {
                this.wrapAuthority2DataNode(authority.children as (IAuthority & DataNode)[]);
            }
        });
        return authorities;
    }



    /**
     * @description Wraps role to data node
     * @param [roles] 
     * @returns role to data node 
     */
    protected wrapRole2DataNode(roles: (IRole & SelectDataNode)[] = []): SelectDataNode[] {
        roles.forEach((role: IRole & SelectDataNode): void => {
            role.title = role.name;
            role.value = role.id;
            if (role.children && role.children.length) {
                this.wrapRole2DataNode(role.children);
            }
        });
        return roles;
    }

    /**
     * @description Determines whether select auth on
     */
    protected onCheckAuth = (checkedKeys: { checked: React.Key[]; halfChecked: React.Key[]; } | React.Key[]): void => {
        this.setState({
            checkedFunctionKeys: checkedKeys as React.Key[]
        });
        this.getForm()?.setFieldsValue({
            functionIdList: checkedKeys
        });
    }
    

    /**
      * 获取expandKeys
      */
     protected expandKeysByValue(authorities: (IAuthority )[] = []):number[] {
        let data: number[]=[];
        authorities.forEach((authority: (IAuthority)): void => {
            data.push(authority.id);
            if (authority.children && authority.children.length) {
                this.expandKeysByValue(authority.children as (IAuthority)[]);
            }
        });
        return data;
    }

     //展开控制
     protected onExpand = (expandKeys: React.Key[])=>{
        this.setState({
          expandKeys,
          autoExpandParent:false,
        })
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
                label: '角色名称',
                name: 'name',
                initialValue: this.state.roleDetail?.name,
                children: <Input placeholder="请输入角色名称"/>,
                rules: [{
                    required: true
                }]
            }, {
                label: '角色编码',
                name: 'code',
                initialValue: this.state.roleDetail?.code,
                children: <Input placeholder="请输入角色编码"/>,
                rules: [{
                    required: true
                }]
            }, {
                label: '上级角色',
                name: 'parentId',
                initialValue: this.state.roleDetail?.parentId,
                children: <TreeSelect placeholder="请选择上级角色" className={ layoutStyles.width100 }
                    treeData={ this.wrapRole2DataNode( this.state.roles ) } showSearch={ true }/>
            }, {
                label: '角色排序',
                name: 'sort',
                initialValue: this.state.roleDetail?.sort,
                children: <InputNumber placeholder="请输入角色排序" className={ layoutStyles.width100 }/>,
                rules: [{
                    required: true
                }]
            }]
        }, {
            title: '权限设置',
            itemProps: [{
                children: (
                    <Tree checkable={ true } treeData={ this.wrapAuthority2DataNode(this.state.authorities as (IAuthority & DataNode)[]) }
                        onCheck={ this.onCheckAuth } checkedKeys={ this.state.checkedFunctionKeys } expandedKeys={ this.state.expandKeys } 
                        autoExpandParent={this.state.autoExpandParent} onExpand={this.onExpand}/>
                )
            }, {
                name: 'functionIdList',
                initialValue: this.state.roleDetail?.functionIdList,
                children: <Input type="hidden" />
            }, {
                name: 'id',
                initialValue: this.state.roleDetail?.id,
                children: <Input type="hidden" />
            }]
        }, {
            title: '其他信息',
            itemProps: [{
                label: '角色备注',
                name: 'description',
                initialValue: this.state.roleDetail?.description,
                children: (
                    <Input.TextArea placeholder="请输入角色备注" rows={ 4 }/>
                )
            }]
        }]];
    }
}