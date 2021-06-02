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
import { IUser } from './IUser';

interface IUserMngtProps {}
interface IUserRouteProps extends RouteComponentProps<IUserMngtProps>, WithTranslation {}
interface IUserMngtState extends IAbstractMngtComponentState, IFIlterValue {
    readonly users: IUser[];
    readonly selectedUserKeys: React.Key[];
    readonly selectedUsers: IUser[];
}

interface IFIlterValue {
    readonly account?: string;
    readonly name?: string;
}

/**
 * Users management
 */
class UserMngt extends AbstractMngtComponent<IUserRouteProps, IUserMngtState> {

    /**
     * @override
     * @description Gets state
     * @returns state 
     */
    protected getState(): IUserMngtState {
        return {
            ...super.getState(),
            // tablePagination: undefined,
            users: []
        };
    }

    /**
     * @description Fetchs users
     * @param [filterValues] 
     */
    protected async fetchUsers(filterValues: IFIlterValue = {}) {
        const users: IUser[] = await RequestUtil.get<IUser[]>('/user', filterValues);
        this.setState({
            users: users
        });
    }

    /**
     * @description Components did mount
     */
    public componentDidMount() {
        this.fetchUsers();
    }

    /**
     * @description Determines whether delete on
     * @param item 
     * @returns delete 
     */
    private onDelete(items: IUser[]): () => void {
        return async () => {
            // await RequestUtil.delete('/sinzetech-system/role', { ids: items.map<number>((item: IUser): number => item.id) });
            // this.setState({
            //     selectedUsers: [],
            //     selectedUserKeys: []
            // }, () => {
            //     this.fetchUsers({
            //         name: this.state.name,
            //         account: this.state.account
            //     });
            // });
        };
    }

    /**
     * @description Determines whether batch delete on
     * @returns batch delete 
     */
    private onBatchDelete(): () => void {
        return this.onDelete(this.state.selectedUsers);
    }

    /**
     * @implements
     * @description Gets tab items
     * @returns tab items 
     */
    public getTabItems(): ITabItem[] {
        return [{
            label: '用户列表',
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
            label: '账号',
            name: 'account',
            children: <Input placeholder="请输入账号"/>
        }, {
            label: '姓名',
            name: 'name',
            children: <Input placeholder="请输入姓名"/>
        }];
    }

    /**
     * @implements
     * @description Determines whether new click on
     * @param event 
     */
    public onNewClick(event: React.MouseEvent<HTMLButtonElement, MouseEvent>): void {
        this.props.history.push('/auth/users/new');
    }
    
    /**
     * @implements
     * @description Determines whether filter submit on
     * @param values 
     */
    public onFilterSubmit(values: Record<string, any>): void {
        this.fetchUsers(values);
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
            selectedUserKeys: selectedRowKeys,
            selectedUsers: selectedRows as IUser[]
        });
    }

    /**
     * @implements
     * @description Gets table data source
     * @param item 
     * @returns table data source 
     */
    public getTableDataSource(item: ITabItem): object[] {
        return this.state.users;
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
                selectedRowKeys: this.state.selectedUserKeys,
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
                <ConfirmableButton confirmTitle="确定删除这些用户吗？" danger={ true }
                    icon={ <DeleteOutlined /> }
                    disabled={ !this.state.selectedUsers?.length } onConfirm={ this.onBatchDelete() }>
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
            title: '登录账号',
            dataIndex: 'account'
        }, {
            title: '用户姓名',
            dataIndex: 'name'
        }, {
            title: '所属角色',
            dataIndex: 'userRoleNames'
        }, {
            title: '所属机构',
            dataIndex: 'departmentName'
        }, {
            title: '操作',
            render: (_: undefined, item: object): React.ReactNode => {
                return (
                    <Space direction="horizontal" size="middle">
                        <Link to={ `/auth/users/detail/${ (item as IUser).id }` }>查看</Link>
                        <Link to={ `/auth/users/setting/${ (item as IUser).id }` }>编辑</Link>
                        <ConfirmableButton confirmTitle="确定要删除该角色吗？" type="link" onConfirm={ this.onDelete([item as IUser]) }>删除</ConfirmableButton>
                    </Space>
                );
            }
        }];
    }
}

export default withRouter(withTranslation()(UserMngt));