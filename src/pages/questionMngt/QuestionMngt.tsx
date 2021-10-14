import React, { useState } from 'react'
import { Space, Input, DatePicker,  Button, Select } from 'antd'
import { Link } from 'react-router-dom'
import { Page } from '../common';
import { FixedType } from 'rc-table/lib/interface';

export default function QuestionMngt(): React.ReactNode {
    const [filterValue, setFilterValue] = useState({});
    const columns = [
        {
            key: 'index',
            title: '序号',
            dataIndex: 'index',
            width: 50,
            render: (_a: any, _b: any, index: number): React.ReactNode => (<span>{index + 1}</span>)
        },
        {
            key: 'issueNumber',
            title: '问题单编号',
            width: 100,
            dataIndex: 'issueNumber'
        },
        {
            key: 'status',
            title: '问题单状态',
            width: 100,
            dataIndex: 'status',
            render: (value: number, record: object): React.ReactNode => {
                const renderEnum: any = [
                    {
                        value: 1,
                        label: "待修改"
                    },
                    {
                        value: 2,
                        label: "已修改"
                    },
                    {
                        value: 3,
                        label: "已拒绝"
                    },
                    {
                        value: 4,
                        label: "已删除"
                    },
                  ]
                return <>{renderEnum.find((item: any) => item.value === value).label}</>
            }
        },
        {
            key: 'productCategoryName',
            title: '塔型',
            width: 100,
            dataIndex: 'productCategoryName'
        },
        {
            key: 'updateTime',
            title: '最新状态变更时间',
            width: 200,
            dataIndex: 'updateTime'
        },
        {
            key: 'type',
            title: '问题单类型',
            width: 200,
            dataIndex: 'type',
            render: (value: number, record: object): React.ReactNode => {
                const renderEnum: any = [
                    {
                        value: 1,
                        label: "提料"
                    },
                    {
                        value: 2,
                        label: "放样"
                    },
                    {
                        value: 3,
                        label: "螺栓"
                    },
                    {
                        value: 4,
                        label: "组焊"
                    },
                    {
                        value: 5,
                        label: "小样图"
                    },
                  ]
                return <>{renderEnum.find((item: any) => item.value === value).label}</>
            }
        },
        {
            key: 'recipientName',
            title: '接收人',
            width: 100,
            dataIndex: 'recipientName'
        },
        {
            key: 'createUserName',
            title: '创建人',
            width: 100,
            dataIndex: 'createUserName'
        },
        {
            key: 'operation',
            title: '操作',
            fixed: 'right' as FixedType,
            width: 250,
            dataIndex: 'operation',
            render: (_: undefined, record: any): React.ReactNode => (
                <Space direction="horizontal" size="small">
                    {
                        record.type<4? <Link to={`/question/questionMngt/otherDetail/${record.id}/${record.type}`}>查看详情</Link>:
                        record.type<5? <Link to={`/question/questionMngt/assemblyWeldDetail/${record.id}`}>查看详情</Link>:
                        <Link to={`/question/questionMngt/sampleDrawDetail/${record.id}`}>查看详情</Link>
                    }
                </Space>
            )
        }
    ];
    const onFilterSubmit=(value: any)=>{
        setFilterValue(value)
        return value;
    }
    return <>
        <Page
            path="/tower-science/issue"
            columns={columns}
            extraOperation={<Button type="primary">导出</Button>}
            onFilterSubmit={onFilterSubmit}
            filterValue={filterValue}
            searchFormItems={[
                {
                    name: 'updateTimeStart',
                    label:'状态时间',
                    children: <DatePicker/>
                },
                {
                    name: 'updateTimeEnd',
                    label:'',
                    children: <DatePicker/>
                },
                {
                    name: 'status',
                    label: '问题单状态',
                    children:  <Select>
                                    <Select.Option value={''} key ={''}>全部</Select.Option>
                                    <Select.Option value={1} key={1}>待修改</Select.Option>
                                    <Select.Option value={2} key={2}>已修改</Select.Option>
                                    <Select.Option value={3} key={3}>已拒绝</Select.Option>
                                    <Select.Option value={4} key={4}>已删除</Select.Option>
                                </Select>
                },
                {
                    name: 'type',
                    label: '问题单类型',
                    children:  <Select>
                                    <Select.Option value={''} key ={''}>全部</Select.Option>
                                    <Select.Option value={1} key={1}>提料</Select.Option>
                                    <Select.Option value={2} key={2}>放样</Select.Option>
                                    <Select.Option value={3} key={3}>螺栓</Select.Option>
                                    <Select.Option value={4} key={4}>组焊</Select.Option>
                                    <Select.Option value={5} key={5}>小样图</Select.Option>
                                </Select>
                },
                {
                    name: 'fuzzyMsg',
                    label: '模糊查询项',
                    children: <Input placeholder="请输入问题单编号/塔型进行查询" maxLength={200} />
                },
            ]}
        />
    </>
}