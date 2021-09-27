import React, { useState } from 'react'
import { Space, Input, DatePicker, Button, Form, Select } from 'antd'
import { Link } from 'react-router-dom'
import { Page } from '../../common'

export default function ScheduleList(): React.ReactNode {
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
            key: 'bidBuyEndTime',
            title: '计划交付时间',
            width: 200,
            dataIndex: 'bidBuyEndTime'
        },
        {
            key: 'biddingEndTime',
            title: '重量（吨）',
            width: 200,
            dataIndex: 'biddingEndTime'
        },
        {
            key: 'biddingAgency',
            title: '塔型（个）',
            dataIndex: 'biddingAgency'
        },
        {
            key: 'biddingAddress',
            title: '杆塔（基）',
            dataIndex: 'biddingAddress'
        },
        {
            key: 'biddingAgency',
            title: '状态',
            dataIndex: 'biddingAgency'
        },
        {
            key: 'biddingAddress',
            title: '最新状态变更时间',
            dataIndex: 'biddingAddress'
        },
        {
            key: 'operation',
            title: '操作',
            dataIndex: 'operation',
            render: (_: undefined, record: any): React.ReactNode => (
                <Space direction="horizontal" size="small">
                    <Link to={`/workMngt/scheduleList/scheduleView/${record.id}`}>查看</Link>
                </Space>
            )
        }
    ]

    return (
        <Page
            path="/tower-science/loftingTask"
            columns={columns}
            extraOperation={<Button type="primary">导出</Button>}
            searchFormItems={[
                {
                    name: 'updateStatusTimeStart',
                    label: '最新状态变更时间',
                    children: <DatePicker placeholder='请选择开始时间'/>
                },
                {
                    name: 'updateStatusTimeEnd',
                    label: '',
                    children: <DatePicker placeholder='请选择结束时间'/>
                },
                {
                    name: 'status',
                    label:'任务状态',
                    children: <Select style={{width:"100%"}}/>
                },
                {
                    name: 'plannedDeliveryTimeStart',
                    label: '计划交付时间',
                    children: <DatePicker placeholder='请选择开始时间'/>
                },
                {
                    name: 'plannedDeliveryTimeEnd',
                    label: '',
                    children: <DatePicker placeholder='请选择结束时间'/>
                },
                {
                    name: 'fuzzyMsg',
                    label: '模糊查询项',
                    children: <Input placeholder="请输入放样任务编号/任务单编号、订单编号/内部合同编号进行查询" maxLength={200} />
                },
            ]}
        />
    )
}