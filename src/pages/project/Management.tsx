import React, { useState } from 'react'
import { Space, Button, TableColumnProps, Modal, Input } from 'antd'
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
            width: 50,
            render: (_a: any, _b: any, index: number): React.ReactNode => (<span>{index + 1}</span>)
        },
        {
            key: 'projectName',
            title: '项目名称',
            dataIndex: 'projectName',
            render: (_a: any, _b: any) => <Link to={`/project/management/detail/${_b.id}`}>{_b.projectName}</Link>
        },
        {
            key: 'projectNumber',
            title: '项目编码',
            dataIndex: 'projectNumber'
        },
        {
            key: 'projectType',
            title: '项目类型',
            dataIndex: 'projectType'
        },
        {
            key: 'bidBuyEndTime',
            title: '标书购买截至日期',
            dataIndex: 'bidBuyEndTime'
        },
        {
            key: 'biddingEndTime',
            title: '投标截至日期',
            dataIndex: 'biddingEndTime'
        },
        {
            key: 'currentProjectStage',
            title: '项目阶段',
            dataIndex: 'currentProjectStage'
        },
        {
            key: 'projectLeader',
            title: '项目负责人',
            dataIndex: 'projectLeader'
        },
        {
            key: 'createTime',
            title: '创建时间',
            dataIndex: 'createTime'
        },
        {
            key: 'releaseDate',
            title: '发布时间',
            dataIndex: 'releaseDate'
        },
        {
            key: 'explain',
            title: '说明',
            dataIndex: 'explain'
        },
        {
            key: 'operation',
            title: '操作',
            dataIndex: 'operation',
            render: (_: undefined, record: object): React.ReactNode => (
                <Space direction="horizontal" size="small">
                    <Link to={`/project/management/detail/1`}>查看</Link>
                    <Link to={`/project/management/edit/${(record as IClient).id}`}>编辑</Link>
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

    const handleConfirmDelete = () => {
        Modal.confirm({
            title: '确认提示',
            content: '是否确定删除对应项目信息？',
            okText: '确定',
            cancelText: '取消',
            onOk: () => {
                console.log(selectKeys, '--------')
            },
            onCancel: () => {

            }
        })
    }

    const SelectChange = (selectedRowKeys: React.Key[], selectedRows: object[]): void => {
        setSelectKeys({
            selectedUserKeys: selectedRowKeys,
            selectedUsers: selectedRows
        });
    }

    return <Page
        path="/tower-market/projectInfo"
        columns={columns}
        extraOperation={<>
            <Link to="/project/management/edit/new"><Button type="primary">新建项目</Button></Link>
            <Button type="primary" onClick={handleConfirmDelete}>删除</Button>
        </>}
        tableProps={{
            rowSelection: {
                selectedRowKeys: selectKeys.selectedUserKeys,
                onChange: SelectChange
            }
        }}
        searchFormItems={[
            {
                name: 'name',
                children: <Input placeholder="搜索客户名称关键词" maxLength={200} />
            },
            {
                name: '1',
                label: '招标截至日期',
                children: <Input placeholder="搜索客户名称关键词" maxLength={200} />
            },
            {
                name: '2',
                label: '购买截至日期',
                children: <Input placeholder="搜索客户名称关键词" maxLength={200} />
            },
            {
                name: '3',
                label: '项目状态',
                children: <Input placeholder="搜索客户名称关键词" maxLength={200} />
            },
        ]}
    />
}