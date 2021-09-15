import React, { useState } from 'react'
import { Space, Button, Input, Modal, Select } from 'antd'
import { Link, useHistory } from 'react-router-dom'
import { Page } from '../common'
import SelectAuditType from './SelectAuditType'
import { auditHead } from "./approvalHeadData.json"
// import { IClient } from '../IClient'
// import RequestUtil from '../../utils/RequestUtil'
export default function Information(): React.ReactNode {
    const history = useHistory()
    const [visible, setVisible] = useState(false)
    const handleNewAudit = () => setVisible(true)
    const handleOk = (value: string) => {
        history.push(`/approvalm/management/edit/new/${value}`)
        setVisible(false)
    }
    return <>
        <SelectAuditType visible={visible} title="新建审批" okText="创建" onOk={handleOk} onCancel={() => setVisible(false)} />
        <Page
            path="/tower-market/audit"
            columns={[
                {
                    key: 'index',
                    title: '序号',
                    dataIndex: 'index',
                    width: 50,
                    render: (_a: any, _b: any, index: number): React.ReactNode => (<span>{index + 1}</span>)
                },
                ...auditHead, {
                    title: '操作',
                    dataIndex: 'operation',
                    render: (_: undefined, record: any): React.ReactNode => (
                        <Space direction="horizontal" size="small">
                            <Link to={`/bidding/information/detail/${record.id}`}>查看</Link>
                        </Space>
                    )
                }]}
            extraOperation={<Button type="primary" onClick={handleNewAudit}>新增审批</Button>}
            searchFormItems={[
                {
                    name: 'omnipotentQuery',
                    children: <Input placeholder="请输入项目名称/项目编码/审批编号/关联合同/制单人进行查询" maxLength={200} />
                },
                {
                    name: 'processTypeId',
                    label: '审批类型',
                    children: <Input placeholder="" maxLength={200} />
                },
                {
                    name: 'minStartTime',
                    label: '发起时间',
                    children: <Input placeholder="" maxLength={200} />
                },
                {
                    name: 'auditStatus',
                    label: '审批状态',
                    children: <Input placeholder="" maxLength={200} />
                },
            ]}
        />
    </>
}