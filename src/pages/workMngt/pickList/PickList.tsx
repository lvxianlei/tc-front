import React, { useState } from 'react'
import { Space, Input, DatePicker, Button, Form, Modal } from 'antd'
import { FixedType } from 'rc-table/lib/interface';
import { Link } from 'react-router-dom'
import { CommonTable, Page } from '../../common'

export default function PickList(): React.ReactNode {
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
            title: '放样任务编号',
            width: 100,
            dataIndex: 'projectName'
        },
        {
            key: 'projectNumber',
            title: '任务单编号',
            width: 100,
            dataIndex: 'projectNumber'
        },
        {
            key: 'projectNumber',
            title: '内部合同编号',
            width: 100,
            dataIndex: 'projectNumber'
        },
        {
            key: 'bidBuyEndTime',
            title: '塔型',
            width: 100,
            dataIndex: 'bidBuyEndTime'
        },
        {
            key: 'biddingEndTime',
            title: '塔型钢印号',
            width: 100,
            dataIndex: 'biddingEndTime'
        },
        {
            key: 'biddingAgency',
            title: '杆塔（基）',
            width: 100,
            dataIndex: 'biddingAgency'
        },
        {
            key: 'biddingAddress',
            title: '计划交付时间',
            width: 200,
            dataIndex: 'biddingAddress'
        },
        {
            key: 'operation',
            title: '操作',
            fixed: 'right' as FixedType,
            width: 230,
            dataIndex: 'operation',
            render: (_: undefined, record: any): React.ReactNode => (
                <Space direction="horizontal" size="small">
                    <Link to={`/workMngt/pickList/pickMessage/${record.id}`}>提料信息</Link>
                    <Link to={`/workMngt/pickList/pickTowerMessage/${record.id}`}>塔型信息</Link>
                    <Link to={`/workMngt/pickList/pickTower/${record.id}`}>杆塔配段</Link>
                    <Button type='link' onClick={() => setVisible(true)}>交付物</Button>
                </Space>
            )
        }
    ]

    const handleModalCancel = () => setVisible(false)
    return (
        <>
            <Modal title='交付物清单'  width={1200} visible={visible} onCancel={handleModalCancel} footer={false}>
                <CommonTable columns={[
                    { 
                        key: 'index',
                        title: '序号', 
                        dataIndex: 'index',
                        width: 50, 
                        render: (_a: any, _b: any, index: number): React.ReactNode => (<span>{index + 1}</span>) },
                    { 
                        key: 'name', 
                        title: '交付物名称', 
                        dataIndex: 'name',
                        width: 150 
                    },
                    { 
                        key: 'name', 
                        title: '用途', 
                        dataIndex: 'name',
                        width: 230
                    },
                    { 
                        key: 'operation', 
                        title: '操作', 
                        dataIndex: 'operation', 
                        render: (_: undefined, record: Record<string, any>): React.ReactNode => (
                            <Button type="link">下载</Button>
                    ) }
                ]} dataSource={[]} />
            </Modal>
            <Page
                path="/tower-market/bidInfo"
                columns={columns}
                extraOperation={<Button type="primary">导出</Button>}
                searchFormItems={[
                    {
                        name: 'startBidBuyEndTime',
                        label: '最新状态变更时间',
                        children: <DatePicker />
                    },
                    {
                        name: 'startBidBuyEndTime',
                        label: '塔型状态',
                        children: <DatePicker />
                    },
                    {
                        name: 'fuzzyQuery',
                        label:'计划交付时间',
                        children: <Input placeholder="请输入项目名称/项目编码/审批编号/关联合同/制单人进行查询" maxLength={200} />
                    },
                    {
                        name: 'startReleaseDate',
                        label: '模式',
                        children: <DatePicker />
                    },
                    {
                        name: 'biddingStatus',
                        label: '模糊查询项',
                        children: <Input placeholder="请输入放样任务编号/任务单编号/订单编号/内部合同编号/塔型/塔型钢印号进行查询" maxLength={200} />
                    },
                ]}
            />
        </>
    )
}