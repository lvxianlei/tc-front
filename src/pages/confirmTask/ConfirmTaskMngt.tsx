import React, { useState } from 'react'
import { Space, Input, DatePicker, Select, Button, Modal, Form } from 'antd'
import { Link } from 'react-router-dom'
import { Page } from '../common'

export default function Information(): React.ReactNode {
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
            title: '任务状态',
            dataIndex: 'projectNumber'
        },
        {
            key: 'bidBuyEndTime',
            title: '最新状态变更时间',
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
            title: '合同名称',
            dataIndex: 'biddingAgency'
        },
        {
            key: 'biddingAddress',
            title: '业务经理',
            dataIndex: 'biddingAddress'
        },
        {
            key: 'operation',
            title: '操作',
            dataIndex: 'operation',
            render: (_: undefined, record: any): React.ReactNode => (
                <Space direction="horizontal" size="small">
                    <Link to={`/confirmTask/ConfirmTaskMngt/ConfirmTaskDetail/${record.id}`}>任务详情</Link>
                    <Button type='link' onClick={() => setVisible(true)}>指派</Button>
                    <Link to={`/bidding/information/detail/${record.id}`}>明细</Link>
                    <Button type='link'>提交任务</Button>
                </Space>
            )
        }
    ]

    const handleModalCancel = () => setVisible(false)
    return <>
        <Modal visible={visible} title="指派" okText="提交" onOk={handleModalOk} onCancel={handleModalCancel} >
            <Form form={form}>
                <Form.Item name="aaaa" label="部门">
                    <Select>
                        <Select.Option value="1">是</Select.Option>
                        <Select.Option value="0">否</Select.Option>
                    </Select>
                </Form.Item>
                <Form.Item name="cccc" label="人员">
                    <Select>
                        <Select.Option value="1">是</Select.Option>
                        <Select.Option value="0">否</Select.Option>
                    </Select>
                </Form.Item>
                <Form.Item name="bbbb" label="计划交付时间">
                    <DatePicker />
                </Form.Item>
            </Form>
        </Modal>
        <Page
            path="/tower-market/bidInfo"
            columns={columns}
            extraOperation={<Button type="primary">导出</Button>}
            searchFormItems={[
                {
                    name: 'fuzzyQuery',
                    label:'最新状态变更时间',
                    children: <Input placeholder="请输入项目名称/项目编码/审批编号/关联合同/制单人进行查询" maxLength={200} />
                },
                {
                    name: 'startBidBuyEndTime',
                    label: '任务状态',
                    children: <DatePicker />
                },
                {
                    name: 'startReleaseDate',
                    label: '确认人',
                    children: <DatePicker />
                },
                {
                    name: 'biddingStatus',
                    label: '模糊查询项',
                    children: <Input placeholder="请输入任务编号/合同名称/业务经理进行查询" maxLength={200} />
                },
            ]}
        />
    </>
}