import React, { useState } from 'react'
import { Space, Input, DatePicker, Select, Button, Modal, Form } from 'antd'
import { Link } from 'react-router-dom'
import { CommonTable, DetailTitle, Page } from '../common';
import { FixedType } from 'rc-table/lib/interface';
import TextArea from 'antd/lib/input/TextArea';

export default function Information(): React.ReactNode {
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
            title: '问题单编号',
            width: 100,
            dataIndex: 'projectName'
        },
        {
            key: 'projectName',
            title: '问题单状态',
            width: 100,
            dataIndex: 'projectName'
        },
        {
            key: 'projectNumber',
            title: '塔型',
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
            title: '问题单类型',
            width: 200,
            dataIndex: 'biddingEndTime'
        },
        {
            key: 'biddingAgency',
            title: '接收人',
            width: 100,
            dataIndex: 'biddingAgency'
        },
        {
            key: 'biddingAddress',
            title: '创建人',
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
                    <Link to={`/question/questionMngt/otherDetail/${record.id}`}>查看详情</Link>
                    <Link to={`/question/questionMngt/assemblyWeldDetail/${record.id}`}>查看详情</Link>
                    <Link to={`/question/questionMngt/sampleDrawDetail/${record.id}`}>查看详情</Link>
                </Space>
            )
        }
    ]
    return <>
        <Page
            path="/tower-market/bidInfo"
            columns={columns}
            extraOperation={<Button type="primary">导出</Button>}
            searchFormItems={[
                {
                    name: 'fuzzyQuery',
                    label:'状态时间',
                    children: <Input placeholder="请输入项目名称/项目编码/审批编号/关联合同/制单人进行查询" maxLength={200} />
                },
                {
                    name: 'startBidBuyEndTime',
                    label: '问题单状态',
                    children: <DatePicker />
                },
                {
                    name: 'startReleaseDate',
                    label: '问题单类型',
                    children: <DatePicker />
                },
                {
                    name: 'biddingStatus',
                    label: '模糊查询项',
                    children: <Input placeholder="请输入问题单编号/塔型进行查询" maxLength={200} />
                },
            ]}
        />
    </>
}