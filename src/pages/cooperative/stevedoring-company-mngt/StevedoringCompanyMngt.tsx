import React, { useState } from 'react';
import { Space, Input, Select, Button, Popconfirm, Form, message } from 'antd';
import { Link } from 'react-router-dom';
import { Page } from '../../common';
import { FixedType } from 'rc-table/lib/interface';
import RequestUtil from '../../../utils/RequestUtil';
import { FileProps } from '../../common/Attachment';

export interface IStevedoringCompanyMngt {
    readonly id?: string;
    readonly title?: string;
    readonly content?: string;
    readonly state?: number;
    readonly updateTime?: string;
    readonly userNames?: string;
    readonly attachInfoDtos?: FileProps[];
    readonly attachInfoVos?: FileProps[];
    readonly attachVos?: FileProps[];
    readonly staffList?: string[];
}

export default function StevedoringCompanyMngt(): React.ReactNode {
    const [ refresh, setRefresh ] = useState<boolean>(false);
    const [ filterValue, setFilterValue ] = useState({});

    const columns = [
        {
            key: 'index',
            title: '序号',
            dataIndex: 'index',
            width: 50,
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (<span>{ index + 1 }</span>)
        },
        {
            key: 'stevedoreCompanyNumber',
            title: '装卸公司编号',
            width: 150,
            dataIndex: 'stevedoreCompanyNumber'
        },
        {
            key: 'stevedoreCompanyName',
            title: '装卸公司名称',
            width: 150,
            dataIndex: 'stevedoreCompanyName'
        },
        {
            key: 'content',
            title: '添加时间',
            width: 150,
            dataIndex: 'content'
        },
        {
            key: 'contactMan',
            title: '联系人',
            dataIndex: 'contactMan',
            width: 120
        },
        {
            key: 'contactManTel',
            title: '联系电话',
            width: 200,
            dataIndex: 'contactManTel'
        },
        {
            key: 'openBankName',
            title: '开户银行',
            width: 200,
            dataIndex: 'openBankName'
        },
        {
            key: 'description',
            title: '银行账号',
            width: 200,
            dataIndex: 'description'
        },
        {
            key: 'updateTime',
            title: '备注',
            width: 200,
            dataIndex: 'updateTime'
        },
        {
            key: 'operation',
            title: '操作',
            dataIndex: 'operation',
            fixed: 'right' as FixedType,
            width: 130,
            render: (_: undefined, record: Record<string, any>): React.ReactNode => (
                <Space direction="horizontal" size="small">
                    <Button type="link">编辑</Button>
                    <Button type="link">详情</Button>
                    <Button type="link">删除</Button>
                </Space>
            )
        }
    ]

    return <Page
        path="/tower-supply/stevedoreCompany"
        columns={ columns }
        headTabs={ [] }
        extraOperation={ <Button type="primary" ghost>创建</Button> }
        refresh={ refresh }
        searchFormItems={ [
            {
                name: 'fuzzyQuery',
                label: '查询',
                children: <Input maxLength={50} placeholder="编号/名称/联系人/联系电话"/>
            }
        ] }
        filterValue={ filterValue }
        onFilterSubmit = { (values: Record<string, any>) => {
            setFilterValue(values);
            return values;
        } }
    />
}