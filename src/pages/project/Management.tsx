import React, { useState } from 'react'
import { Space, Button, TableColumnProps } from 'antd'
import { DeleteOutlined } from '@ant-design/icons'
import { Link } from 'react-router-dom'
import ConfirmableButton from '../../components/ConfirmableButton'
import { Page } from '../common'
import { IClient } from '../IClient'
import RequestUtil from '../../utils/RequestUtil'

interface ManagementState {
    selectedUserKeys: React.Key[]
    selectedUsers: object[]
}

export default function Management(): React.ReactNode {
    const [selectKeys, setSelectKeys] = useState<ManagementState>({
        selectedUserKeys: [],
        selectedUsers: []
    })
    const columns: TableColumnProps<object>[] = [
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
                return <Link to={`/approvalm/management/detail/${record.id}`}>{record.name}</Link>
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
            render: (_: undefined, record: object): React.ReactNode => (
                <Space direction="horizontal" size="small">
                    <Link to={`/client/mngt/setting/${(record as IClient).id}`}>编辑</Link>
                    <ConfirmableButton
                        confirmTitle="要删除该客户吗？"
                        type="link"
                        placement="topRight"
                        onConfirm={async () => {
                            await RequestUtil.delete(`/tower-customer/customer?customerId=${(record as IClient).id}`)
                        }}
                    >
                        删除
                    </ConfirmableButton>
                </Space>
            )
        }]

    const SelectChange = (selectedRowKeys: React.Key[], selectedRows: object[]): void => {
        setSelectKeys({
            selectedUserKeys: selectedRowKeys,
            selectedUsers: selectedRows
        });
    }

    return <Page
        path="/tower-customer/customer"
        columns={columns}
        extraOperation={<Button type="primary">新增</Button>}
        tableProps={{
            rowSelection: {
                selectedRowKeys: selectKeys.selectedUserKeys,
                onChange: SelectChange
            }
        }}
    />
}