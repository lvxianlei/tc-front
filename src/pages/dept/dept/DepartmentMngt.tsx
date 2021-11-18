import React, { useState } from 'react';
import { Space, Input, Button, Popconfirm } from 'antd';
import { Page } from '../../common';
import { FixedType } from 'rc-table/lib/interface';
import styles from './Department.module.less';
import { Link } from 'react-router-dom';
import RequestUtil from '../../../utils/RequestUtil';

export interface IDept extends IMetaDept {
    readonly children: IDept[];
}

export interface IMetaDept {
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
    readonly key: string;
}

export interface IDeptTree {
    id?: string;
    title?: string;
    children?: [];
}

export default function DepartmentMngt(): React.ReactNode {
    const [ refresh, setRefresh ] = useState<boolean>(false);
    const [ selectedRoles, setSelectedRoles ] = useState<IDept[]>([]);
    
    const columns = [
        {
            key: 'name',
            title: '机构名称',
            width: 150,
            dataIndex: 'name'
        },
        {
            key: 'classification',
            title: '类型',
            dataIndex: 'classification',
            width: 120
        },
        {
            key: 'description',
            title: '简介',
            width: 200,
            dataIndex: 'description'
        },
        {
            key: 'operation',
            title: '操作',
            dataIndex: 'operation',
            fixed: 'right' as FixedType,
            width: 200,
            render: (_: undefined, record: Record<string, any>): React.ReactNode => (
                <Space direction="horizontal" size="small" className={ styles.operationBtn }>
                    <Link to={ `/dept/deptMngt/setting/${ record.id }` }>编辑</Link>
                    <Popconfirm
                        title="确认删除?"
                        onConfirm={ () => {
                            RequestUtil.delete(`/tower-system/department?ids=${ record.id }`).then(res => {
                                setRefresh(!refresh);
                            });
                        } }
                        okText="确认"
                        cancelText="取消"
                    >
                        <Button type="link">删除</Button>
                    </Popconfirm>
                    <Link to={ `/dept/deptMngt/new/${ record.id }` }>新增下级</Link>
                </Space>
            )
        }
    ]

    return <Page
        path="/tower-system/department"
        columns={ columns }
        headTabs={ [] }
        refresh={ refresh }
        extraOperation={ <Link to={ `/dept/deptMngt/new/0` }><Button type="primary">新增</Button></Link> }
        searchFormItems={ [] }
    />
}