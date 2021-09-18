import React, { useState } from 'react'
import { Space, Input, DatePicker, Button, Form } from 'antd'
import { Link } from 'react-router-dom'
import { FixedType } from 'rc-table/lib/interface';
import { Page } from '../../common'

export default function ConfirmList(): React.ReactNode {
    const [visible, setVisible] = useState<boolean>(false);
    const [form] = Form.useForm();
    const handleModalOk = async () => {
        try {
            const submitData = await form.validateFields()
            console.log(submitData)
            setVisible(false)
        } catch (error) {
            console.log(error)
        }
    }
    const columns = [
        {
            key: 'index',
            title: '序号',
            dataIndex: 'index',
            width: 50,
            render: (_a: any, _b: any, index: number): React.ReactNode => (<span>{index + 1}</span>)
        },
        {
            key: 'projectName',
            title: '确认任务编号',
            width: 100,
            dataIndex: 'projectName'
        },
        {
            key: 'projectNumber',
            title: '合同名称',
            dataIndex: 'projectNumber'
        },
        {
            key: 'bidBuyEndTime',
            title: '计划交付时间',
            width: 200,
            dataIndex: 'bidBuyEndTime'
        },
        {
            key: 'biddingEndTime',
            title: '确认人',
            width: 200,
            dataIndex: 'biddingEndTime'
        },
        {
            key: 'biddingAgency',
            title: '状态',
            width: 100,
            dataIndex: 'biddingAgency'
        },
        {
            key: 'biddingAddress',
            title: '状态时间',
            width: 200,
            dataIndex: 'biddingAddress'
        },
        {
            key: 'operation',
            title: '操作',
            fixed: 'right' as FixedType,
            width: 150,
            dataIndex: 'operation',
            render: (_: undefined, record: any): React.ReactNode => (
                <Space direction="horizontal" size="small">
                    <Link to={`/workMngt/confirmList/confirmMessage/${record.id}`}>确认信息</Link>
                    <Link to={`/workMngt/confirmList/confirmDetail/${record.id}`}>确认明细</Link>
                </Space>
            )
        }
    ]

    const handleModalCancel = () => setVisible(false)
    return (
        <Page
            path="/tower-market/bidInfo"
            columns={columns}
            extraOperation={<Button type="primary">导出</Button>}
            searchFormItems={[
                {
                    name: 'startBidBuyEndTime',
                    label: '任务状态',
                    children: <DatePicker />
                },
                {
                    name: 'fuzzyQuery',
                    label:'计划交付时间',
                    children: <Input placeholder="请输入项目名称/项目编码/审批编号/关联合同/制单人进行查询" maxLength={200} />
                },
                {
                    name: 'startReleaseDate',
                    label: '确认人',
                    children: <DatePicker />
                },
                {
                    name: 'biddingStatus',
                    label: '模糊查询项',
                    children: <Input placeholder="请输入任务编号/合同名称进行查询" maxLength={200} />
                },
            ]}
        />
    )
}