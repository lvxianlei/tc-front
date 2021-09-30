import React, { useState } from 'react'
import { Space, Input, DatePicker, Button, Form, Select } from 'antd'
import { Link } from 'react-router-dom'
import { FixedType } from 'rc-table/lib/interface';
import { Page } from '../../common'

export default function ConfirmList(): React.ReactNode {
    const columns = [
        {
            key: 'index',
            title: '序号',
            dataIndex: 'index',
            width: 50,
            render: (_a: any, _b: any, index: number): React.ReactNode => (<span>{index + 1}</span>)
        },
        {
            key: 'drawTaskNum',
            title: '确认任务编号',
            width: 100,
            dataIndex: 'drawTaskNum'
        },
        {
            key: 'contractName',
            title: '合同名称',
            dataIndex: 'contractName'
        },
        {
            key: 'plannedDeliveryTime',
            title: '计划交付时间',
            width: 200,
            dataIndex: 'plannedDeliveryTime'
        },
        {
            key: 'confirmName',
            title: '确认人',
            width: 200,
            dataIndex: 'confirmName'
        },
        {
            key: 'status',
            title: '状态',
            width: 100,
            dataIndex: 'status',
            render: (value: number, record: object): React.ReactNode => {
                const renderEnum: any = [
                    {
                        value: 0,
                        label: "已拒绝"
                    },
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
                        label: "待完成"
                    },
                    {
                        value: 4,
                        label: "已完成"
                    },
                    {
                        value: 5,
                        label: "已提交"
                    }
                  ]
                return <>{renderEnum.find((item: any) => item.value === value).label}</>
            }
        },
        {
            key: 'updateStatusTime',
            title: '状态时间',
            width: 200,
            dataIndex: 'updateStatusTime'
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

    return (
        <Page
            path="/tower-science/drawProductDetail"
            columns={columns}
            extraOperation={<Button type="primary">导出</Button>}
            searchFormItems={[
                {
                    name: 'status',
                    label: '任务状态',
                    children: <Select style={{width:"100%"}}>
                        <Select.Option value={1} key={1}>待确认</Select.Option>
                        <Select.Option value={2} key={2}>待指派</Select.Option>
                        <Select.Option value={3} key={3}>待完成</Select.Option>
                        <Select.Option value={4} key={4}>已完成</Select.Option>
                        <Select.Option value={5} key={5}>已提交</Select.Option>
                        <Select.Option value={0} key={0}>已拒绝</Select.Option>
                    </Select>
                },
                {
                    name: 'plannedDeliveryTimeStart',
                    label:'计划交付时间',
                    children: <DatePicker />
                },
                {
                    name: 'plannedDeliveryTimeEnd',
                    label:'',
                    children: <DatePicker  />
                },
                {
                    name: 'confirmDept',
                    label: '确认人',
                    children: <Select />
                },
                {
                    name: 'confirmId',
                    label: '',
                    children: <Select />
                },
                {
                    name: 'fuzzyQueryItem',
                    label: '模糊查询项',
                    children: <Input placeholder="请输入任务编号/合同名称进行查询" maxLength={200} />
                },
            ]}
        />
    )
}