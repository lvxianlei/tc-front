import React, { useState } from 'react'
import { Space, Input, DatePicker, Select, Button, Modal, Form } from 'antd'
import { Link } from 'react-router-dom'
import { CommonTable, DetailTitle, Page } from '../common';
import { FixedType } from 'rc-table/lib/interface';
import TextArea from 'antd/lib/input/TextArea';

export default function ConfirmTaskMngt(): React.ReactNode {
    const [assignVisible, setVisible] = useState<boolean>(false);
    const [detailVisible, setDetailVisible] = useState<boolean>(false);
    const [form] = Form.useForm();
    const [formDetail] = Form.useForm();
    const handleAssignModalOk = async () => {
        try {
            const submitData = await form.validateFields()
            console.log(submitData)
            setVisible(false)
        } catch (error) {
            console.log(error)
        }
    }
    const handleDetailModalOk = async () => {
        try {
            const submitData = await formDetail.validateFields()
            console.log(submitData)
            setVisible(false)
        } catch (error) {
            console.log(error)
        }
    }
    const towerColumns=[
        {
            key: 'index',
            title: '序号',
            dataIndex: 'index',
            width: 50,
            render: (_a: any, _b: any, index: number): React.ReactNode => (<span>{index + 1}</span>)
        },
        {
            key: 'projectName',
            title: '线路名称',
            width: 100,
            dataIndex: 'projectName'
        },
        {
            key: 'projectName',
            title: '杆塔号',
            width: 100,
            dataIndex: 'projectName'
        },
        {
            key: 'projectName',
            title: '塔型',
            width: 100,
            dataIndex: 'projectName'
        },
        {
            key: 'projectName',
            title: '塔型钢印号',
            width: 100,
            dataIndex: 'projectName'
        },
        {
            key: 'projectName',
            title: '产品类型',
            width: 100,
            dataIndex: 'projectName'
        },
        {
            key: 'projectName',
            title: '电压等级（kv）',
            width: 100,
            dataIndex: 'projectName'
        },
        {
            key: 'projectName',
            title: '呼高（m）',
            width: 100,
            dataIndex: 'projectName'
        },
        {
            key: 'projectName',
            title: '其他增重（kg）',
            width: 100,
            dataIndex: 'projectName'
        },
        {
            key: 'projectName',
            title: '总重（kg）',
            width: 100,
            dataIndex: 'projectName'
        },
        {
            key: 'projectName',
            title: '备注',
            width: 100,
            dataIndex: 'projectName'
        }
    ]
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
            width: 100,
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
            width: 100,
            dataIndex: 'biddingAgency'
        },
        {
            key: 'biddingAddress',
            title: '业务经理',
            width: 100,
            dataIndex: 'biddingAddress'
        },
        {
            key: 'operation',
            title: '操作',
            fixed: 'right' as FixedType,
            width: 250,
            dataIndex: 'operation',
            render: (_: undefined, record: any): React.ReactNode => (
                <Space direction="horizontal" size="small">
                    <Link to={`/confirmTask/ConfirmTaskMngt/ConfirmTaskDetail/${record.id}`}>任务详情</Link>
                    <Button type='link' onClick={() => setVisible(true)}>指派</Button>
                    <Button type='link' onClick={() => setDetailVisible(true)}>明细</Button>
                    <Button type='link'>提交任务</Button>
                </Space>
            )
        }
    ]

    const handleAssignModalCancel = () => setVisible(false)
    const handleDetailModalCancel = () => setDetailVisible(false)
    return <>
        <Modal visible={assignVisible} title="指派" okText="提交" onOk={handleAssignModalOk} onCancel={handleAssignModalCancel} >
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
        <Modal visible={detailVisible} title="明细" okText="确认" onOk={handleDetailModalOk} onCancel={handleDetailModalCancel} width={1200}>
            <DetailTitle title="杆塔信息"/>
            <CommonTable columns={towerColumns} dataSource={[]} />
            <DetailTitle title="其他信息"/>
            <Form form={formDetail}>
                <Form.Item name="decription" label="备注">
                    <TextArea maxLength={300} showCount rows={3}/>
                </Form.Item>
            </Form>
            <DetailTitle title="附件"/>
            <CommonTable columns={[
                {
                    title: '附件名称',
                    dataIndex: 'name',
                    key: 'name',
                },
                {
                    key: 'operation',
                    title: '操作',
                    dataIndex: 'operation',
                    render: (_: undefined, record: any): React.ReactNode => (
                        <Space direction="horizontal" size="small">
                            <Button type='link'>下载</Button>
                            <Button type='link'>预览</Button>
                        </Space>
                    )
                }
            ]} dataSource={[]} />
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