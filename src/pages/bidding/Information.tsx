import React from 'react'
import { Space, Button, Input } from 'antd'
import { Link } from 'react-router-dom'
import ConfirmableButton from '../../components/ConfirmableButton'
import { Page } from '../common'
import { IClient } from '../IClient'
import RequestUtil from '../../utils/RequestUtil'
export default function Information(): React.ReactNode {
    const columns = [
        {
            key: 'index',
            title: '序号',
            dataIndex: 'index',
            render: (_a: any, _b: any, index: number): React.ReactNode => (<span>{index + 1}</span>)
        },
        {
            key: 'name',
            title: '客户名称',
            dataIndex: 'name',
            render: (_: undefined, record: any): React.ReactNode => {
                return <Link to={`/bidding/information/detail/${record.id}`}>{record.name}</Link>
            }
        },
        {
            key: 'typeName',
            title: '客户类型',
            dataIndex: 'typeName'
        },
        {
            key: 'linkman',
            title: '重要联系人',
            dataIndex: 'linkman'
        },
        {
            key: 'phone',
            title: '手机号码',
            dataIndex: 'phone'
        },
        {
            key: 'description',
            title: '备注',
            dataIndex: 'description'
        },
        {
            key: 'createTime',
            title: '创建时间',
            dataIndex: 'createTime'
        },
        {
            key: 'operation',
            title: '操作',
            dataIndex: 'operation',
            render: (_: undefined, record: any): React.ReactNode => (
                <Space direction="horizontal" size="small">
                    <Link to={`/bidding/information/detail/${record.id}`}>查看</Link>
                </Space>
            )
        }
    ]
    return <Page
        path="/tower-customer/customer"
        columns={columns}
        extraOperation={<Button type="primary">新增</Button>}
        searchFormItems={[{
            name: 'name',
            label: '客户名称',
            children: <Input placeholder="搜索客户名称关键词" maxLength={200} />
        }]}
    />
}