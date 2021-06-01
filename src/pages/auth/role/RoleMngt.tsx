/**
 * @author Cory(coryisbest0728#gmail.com)
 * @copyright © 2021 Cory. All rights reserved
 */
import { DeleteOutlined } from '@ant-design/icons';
import { FormItemProps, Input, Space, TableColumnType, TablePaginationConfig, TableProps } from 'antd';
import React from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import { RouteComponentProps, withRouter } from 'react-router';
import { Link } from 'react-router-dom';

import AbstractMngtComponent, { IAbstractMngtComponentState } from '../../../components/AbstractMngtComponent';
import ConfirmableButton from '../../../components/ConfirmableButton';
import { ITabItem } from '../../../components/ITabableComponent';
import RequestUtil from '../../../utils/RequestUtil';

interface IRoleMngtProps {}
interface IRoleRouteProps extends RouteComponentProps<IRoleMngtProps>, WithTranslation {}
interface IRoleMngtState extends IAbstractMngtComponentState, IFIlterValue {
    readonly roles: IRole[];
    readonly selectedRoleKeys: React.Key[];
    readonly selectedRoles: IRole[];
}

interface IFIlterValue {
    readonly name?: string;
    readonly code?: string;
}

export interface IRole {
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

/**
 * Roles management
 */
class RoleMngt extends AbstractMngtComponent<IRoleRouteProps, IRoleMngtState> {

    /**
     * @override
     * @description Gets state
     * @returns state 
     */
    protected getState(): IRoleMngtState {
        return {
            ...super.getState(),
            tablePagination: undefined,
            roles: []
        };
    }

    /**
     * @description Fetchs roles
     * @param [filterValues] 
     */
    protected async fetchRoles(filterValues: IFIlterValue = {}) {
        const roles: IRole[] = await RequestUtil.get('/sinzetech-system/role', filterValues);
        this.setState({
            roles: roles
        });
    }

    /**
     * @description Components did mount
     */
    public componentDidMount() {
        this.fetchRoles();
    }

    /**
     * @description Determines whether delete on
     * @param item 
     * @returns delete 
     */
    private onDelete(items: IRole[]): () => void {
        return async () => {
            await RequestUtil.delete('/sinzetech-system/role', { ids: items.map<number>((item: IRole): number => item.id) });
            this.setState({
                selectedRoles: [],
                selectedRoleKeys: []
            }, () => {
                this.fetchRoles({
                    name: this.state.name,
                    code: this.state.code
                });
            });
        };
    }

    /**
     * @description Determines whether batch delete on
     * @returns batch delete 
     */
    private onBatchDelete(): () => void {
        return this.onDelete(this.state.selectedRoles);
    }

    /**
     * @implements
     * @description Gets tab items
     * @returns tab items 
     */
    public getTabItems(): ITabItem[] {
        return [{
            label: '角色列表',
            key: 0
        }];
    }
    
    /**
     * @implements
     * @description Determines whether tab change on
     * @param activeKey 
     */
    public onTabChange(activeKey: string): void {}
    
    /**
     * @implements
     * @description Gets filter form item props
     * @param item 
     * @returns filter form item props 
     */
    public getFilterFormItemProps(item: ITabItem): FormItemProps<any>[] {
        return [{
            label: '角色名称',
            name: 'name',
            children: <Input placeholder="请输入角色名称"/>
        }, {
            label: '角色编码',
            name: 'code',
            children: <Input placeholder="请输入角色编码"/>
        }];
    }

    /**
     * @implements
     * @description Determines whether new click on
     * @param event 
     */
    public onNewClick(event: React.MouseEvent<HTMLButtonElement, MouseEvent>): void {
        this.props.history.push('/auth/roles/new');
    }
    
    /**
     * @implements
     * @description Determines whether filter submit on
     * @param values 
     */
    public onFilterSubmit(values: Record<string, any>): void {
        this.fetchRoles(values);
    }
    
    /**
     * @implements
     * @description Determines whether table change on
     * @param pagination 
     */
    public onTableChange(pagination: TablePaginationConfig): void {}
    
    /**
     * @description Select change of role mngt
     */
    private SelectChange = (selectedRowKeys: React.Key[], selectedRows: object[]): void => {
        this.setState({
            selectedRoleKeys: selectedRowKeys,
            selectedRoles: selectedRows as IRole[]
        });
    }

    /**
     * @implements
     * @description Gets table data source
     * @param item 
     * @returns table data source 
     */
    public getTableDataSource(item: ITabItem): object[] {
        return this.state.roles;
    }

    /**
     * @override
     * @description Gets table props
     * @param item 
     * @returns table props 
     */
    protected getTableProps(item: ITabItem): TableProps<object> {
        return {
            ...super.getTableProps(item),
            rowSelection: {
                selectedRowKeys: this.state.selectedRoleKeys,
                onChange: this.SelectChange
            }
        };
    }

    /**
     * @override
     * @description Renders extra operation content
     * @param item 
     * @returns extra operation content 
     */
    protected renderExtraOperationContent(item: ITabItem): React.ReactNode {
        return (
            <Space direction="horizontal" size="middle">
                { super.renderExtraOperationContent(item) }
                <ConfirmableButton confirmTitle="确定删除这些角色吗？" danger={ true }
                    icon={ <DeleteOutlined /> }
                    disabled={ !this.state.selectedRoles?.length } onConfirm={ this.onBatchDelete() }>
                    删除
                </ConfirmableButton>
            </Space>
        );
    }
    
    /**
     * @implements
     * @description Gets table columns
     * @param item 
     * @returns table columns 
     */
    public getTableColumns(item: ITabItem): TableColumnType<object>[] {
        return [{
            title: '角色名称',
            dataIndex: 'name'
        }, {
            title: '编码',
            dataIndex: 'code'
        }, {
            title: '排序',
            dataIndex: 'sort'
        }, {
            title: '操作',
            render: (_: undefined, item: object): React.ReactNode => {
                return (
                    <Space direction="horizontal" size="middle">
                        <Link to={ `/auth/roles/detail/${ (item as IRole).id }` }>查看</Link>
                        <Link to={ `/auth/roles/setting/${ (item as IRole).id }` }>编辑</Link>
                        <ConfirmableButton confirmTitle="确定要删除该角色吗？" type="link" onConfirm={ this.onDelete([item as IRole]) }>删除</ConfirmableButton>
                    </Space>
                );
            }
        }];
    }
}

export default withRouter(withTranslation()(RoleMngt));