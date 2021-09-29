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
            key: 'taskCode',
            title: '放样任务编号',
            width: 100,
            dataIndex: 'taskCode'
        },
        {
            key: 'taskNumber',
            title: '任务单编号',
            width: 100,
            dataIndex: 'taskNumber'
        },
        {
            key: 'saleOrderNumber',
            title: '订单编号',
            width: 100,
            dataIndex: 'saleOrderNumber'
        },
        {
            key: 'internalNumber',
            title: '内部合同编号',
            width: 100,
            dataIndex: 'internalNumber'
        },
        {
            key: 'plannedDeliveryTime',
            title: '计划交付时间',
            width: 200,
            dataIndex: 'plannedDeliveryTime'
        },
        {
            key: 'weight',
            title: '重量（吨）',
            width: 200,
            dataIndex: 'weight'
        },
        {
            key: 'productCategoryNum',
            title: '塔型（个）',
            dataIndex: 'productCategoryNum'
        },
        {
            key: 'productNum',
            title: '杆塔（基）',
            dataIndex: 'productNum'
        },
        {
            key: 'status',
            title: '状态',
            dataIndex: 'status',
            render: (value: number, record: object): React.ReactNode => {
                const renderEnum: any = [
                  {
                    value: 1,
                    label: "待确认"
                  },
                  {
                    value: 2,
                    label: "待指派"
                  },
                  {
                    value: 3,
                    label: "已拒绝"
                  },
                  {
                    value: 4,
                    label: "待完成"
                  },
                  {
                    value: 5,
                    label: "已完成"
                  },
                  {
                    value: 6,
                    label: "已提交"
                  },
                ]
                return <>{renderEnum.find((item: any) => item.value === value).label}</>
            }
        },
        {
            key: 'updateStatusTime',
            title: '最新状态变更时间',
            dataIndex: 'updateStatusTime'
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

    const onFilterSubmit = (value: any) => {
        console.log(value)
        return value
    }

   

    return (
        <Page
            path="/tower-science/loftingTask"
            columns={columns}
            extraOperation={<Button type="primary">导出</Button>}
            onFilterSubmit={onFilterSubmit}
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
                    children: <Select style={{width:"100%"}}>
                        <Select.Option value={1} key={1}>待确认</Select.Option>
                        <Select.Option value={2} key={2}>待指派</Select.Option>
                        <Select.Option value={3} key={3}>已拒绝</Select.Option>
                        <Select.Option value={4} key={4}>待完成</Select.Option>
                        <Select.Option value={5} key={5}>已完成</Select.Option>
                        <Select.Option value={6} key={6}>已提交</Select.Option>
                    </Select>
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