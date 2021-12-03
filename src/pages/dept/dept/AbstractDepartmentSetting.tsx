/**
 * @author zyc
 * @copyright © 2021 zyc
 * @description 改成弹窗，暂时废弃
 */
import { Input, Select, TreeSelect } from 'antd';
import { DataNode as SelectDataNode } from 'rc-tree-select/es/interface';
import React from 'react';
import { RouteComponentProps } from 'react-router';

import AbstractFillableComponent, {
    IAbstractFillableComponentState,
    IFormItemGroup,
} from '../../../components/AbstractFillableComponent';
import { deptTypeOptions } from "../../../configuration/DictionaryOptions";
import layoutStyles from '../../../layout/Layout.module.less';
import RequestUtil from '../../../utils/RequestUtil';
import { IDeptTree } from './DepartmentMngt';

export interface IDeptDetail {
    readonly parentName?: string | number;
    readonly name?: string;
    readonly id?: string;
    readonly description?: string;
    readonly parentId?: string | number;
    readonly sort?: string;
    readonly classification?: string;
}

export interface IAbstractDepartmentSettingState extends IAbstractFillableComponentState {
    readonly tree?: IDeptTree[];
    readonly deptDeatil?: IDeptDetail;
    readonly id?: string;
    readonly tip?: boolean;
}

/**
 * The abstract dept setting
 */
export default abstract class AbstractDepartmentSetting<P extends RouteComponentProps, S extends IAbstractDepartmentSettingState> extends AbstractFillableComponent<P, S> {

    public state: S = this.getState();

    /**
     * @description Gets state
     * @returns state 
     */
    protected getState(): S {
        return {
            tree: undefined,
            deptDeatil: undefined
        } as S;
    }

    /**
     * @description Components did mount
     */
    public async componentDidMount() {
        const tree: IDeptTree[] = await RequestUtil.get<IDeptTree[]>('/tower-system/department/tree');
        this.setState({
            tree: tree
        });
    }

    /**
     * @override
     * @description Gets return path
     * @returns return path 
     */
    protected getReturnPath(): string {
        return '/dept/deptMngt';
    }  

    /**
     * @description Wraps role to data node
     * @param [roles] 
     * @returns role to data node 
     */
    protected wrapRole2DataNode(roles: (IDeptTree & SelectDataNode)[] = []): SelectDataNode[] {
        roles.forEach((role: IDeptTree & SelectDataNode): void => {
            role.title = role.title;
            role.value = role.id;
            if (role.children && role.children.length) {
                this.wrapRole2DataNode(role.children);
            }
        });
        return roles;
    }    

    protected renderExtraOperationArea(): React.ReactNode {
        return null;
    }

    /**
     * @implements
     * @description Gets form item groups
     * @returns form item groups 
     */
    public getFormItemGroups(): IFormItemGroup[][] {
        const deptDeatil: IDeptDetail | undefined = this.state.deptDeatil;
        return [[{
            title: '基本信息',
            itemCol: {
                span: 12
            },
            itemProps: [{
                label: '部门名称',
                name: 'name',
                initialValue: deptDeatil?.name,
                children: <Input placeholder="请输入部门名称"/>,
                rules: [{
                    required: true,
                    message: '请输入部门名称'
                },
                {
                  pattern: /^[^\s]*$/,
                  message: '禁止输入空格',
                }]
            }, {
                label: '上级机构',
                name: 'parentId',
                initialValue: deptDeatil?.parentId === 0 ? '' : deptDeatil?.parentId,
                children: <TreeSelect disabled={ this.state.tip } placeholder="请选择上级机构" className={ layoutStyles.width100 }
                    treeData={ this.wrapRole2DataNode( this.state.tree ) } showSearch={ true }/>
            }, {
                label: '部门类型',
                name: 'classification',
                initialValue: deptDeatil?.classification,
                rules: [{
                    required: true,
                    message: '请选择部门类型'
                }],
                children: <Select getPopupContainer={triggerNode => triggerNode.parentNode}>
                    { deptTypeOptions && deptTypeOptions.map(({ id, name }, index) => {
                        return <Select.Option key={index} value={name}>
                            {name}
                        </Select.Option>
                    }) }
                </Select>
            }, {
            label: '部门备注',
            name: 'description',
            initialValue: deptDeatil?.description,
            children: (
                <Input.TextArea placeholder="请输入部门备注" maxLength={ 300 } showCount/>
            )}]
        }]];
    }
}