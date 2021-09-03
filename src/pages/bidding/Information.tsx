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
        searchFormItems={[
            {
                name: 'name',
                children: <Input placeholder="请输入项目名称/项目编码/审批编号/关联合同/制单人进行查询" maxLength={200} />
            },
            {
                name: '1',
                label: '审批类型',
                children: <Input placeholder="" maxLength={200} />
            },
            {
                name: '2',
                label: '发起时间',
                children: <Input placeholder="" maxLength={200} />
            },
            {
                name: '3',
                label: '审批状态',
                children: <Input placeholder="" maxLength={200} />
            },
        ]}
    />
}