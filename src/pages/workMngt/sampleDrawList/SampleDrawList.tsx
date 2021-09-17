import React, { useState } from 'react';
import { Space, Input, DatePicker, Select, Button, Modal, Form } from 'antd';
import { Link } from 'react-router-dom';
import { FixedType } from 'rc-table/lib/interface';
import { Page } from '../../common';

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
            title: '放样任务编号',
            width: 100,
            dataIndex: 'projectName'
        },
        {
            key: 'projectName',
            title: '优先级',
            width: 100,
            dataIndex: 'projectName'
        },
        {
            key: 'projectName',
            title: '任务单编号',
            width: 100,
            dataIndex: 'projectName'
        },
        {
            key: 'projectName',
            title: '订单编号',
            width: 100,
            dataIndex: 'projectName'
        },
        {
            key: 'projectName',
            title: '内部合同编号',
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
            key: 'bidBuyEndTime',
            title: '计划交付时间',
            width: 200,
            dataIndex: 'bidBuyEndTime'
        },
        {
            key: 'biddingAddress',
            title: '样图负责人',
            width: 100,
            dataIndex: 'biddingAddress'
        },
        {
            key: 'biddingAgency',
            title: '小样图状态',
            width: 100,
            dataIndex: 'biddingAgency'
        },
        {
            key: 'biddingAddress',
            title: '最新状态变更时间',
            width: 200,
            dataIndex: 'biddingAddress'
        },
        {
            key: 'operation',
            title: '操作',
            dataIndex: 'operation',
            width: 230,
            fixed: 'right' as FixedType,
            render: (_: undefined, record: any): React.ReactNode => (
                <Space direction="horizontal" size="small">
                    <Link to={`/workMngt/sampleDrawList/sampleDrawMessage/${record.id}`}>小样图信息</Link>
                    <Link to={`/workMngt/sampleDrawList/sampleDraw/${record.id}`}>小样图</Link>
                    <Link to={`/workMngt/sampleDrawList/sampleDrawCheck/${record.id}`}>校核</Link>
                    <Button type='link'>提交</Button>
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
                    label: '最新状态变更时间',
                    children: <DatePicker />
                },
                {
                    name: 'fuzzyQuery',
                    label:'优先级',
                    children: <Input placeholder="请输入项目名称/项目编码/审批编号/关联合同/制单人进行查询" maxLength={200} />
                },
                {
                    name: 'startReleaseDate',
                    label: '计划交付时间',
                    children: <DatePicker />
                },
                {
                    name: 'biddingStatus',
                    label: '模糊查询项',
                    children: <Input placeholder="请输入放样任务编号/任务单编号、订单编号/内部合同编号进行查询" maxLength={200} />
                },
            ]}
        />
    )
}