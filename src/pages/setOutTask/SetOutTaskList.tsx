import React from 'react';
import { Space, Input, DatePicker, Select, Button, Popconfirm } from 'antd';
import { Page } from '../common';
import { FixedType } from 'rc-table/lib/interface';
import styles from './SetOutTask.module.less';
import { Link } from 'react-router-dom';
import Deliverables from './Deliverables';

const columns = [
    {
        key: 'index',
        title: '序号',
        dataIndex: 'index',
        width: 50,
        render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (<span>{ index + 1 }</span>)
    },
    {
        key: 'projectName',
        title: '放样任务编号',
        width: 150,
        dataIndex: 'projectName'
    },
    {
        key: 'projectNumber',
        title: '任务状态',
        dataIndex: 'projectNumber',
        width: 120
    },
    {
        key: 'bidBuyEndTime',
        title: '最新状态变更时间',
        width: 200,
        dataIndex: 'bidBuyEndTime'
    },
    {
        key: 'biddingEndTime',
        title: '塔型完成进度',
        width: 150,
        dataIndex: 'biddingEndTime',
        render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
            <Link to={ `/setOutTask/setOutTaskTower/${ record.id }` }>{ record.biddingEndTime }塔型完成进度</Link>
        )
    },
    {
        key: 'biddingPerson',
        title: '杆塔完成进度',
        dataIndex: 'biddingPerson',
        width: 200,
        render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
            <Link to={ `/setOutTask/setOutTaskPole/${ record.id }` }>{ record.biddingEndTime }杆塔完成进度</Link>
        )
    },
    {
        key: 'bidBuyEndTime',
        title: '重量（吨）',
        width: 200,
        dataIndex: 'bidBuyEndTime'
    },
    {
        key: 'bidBuyEndTime',
        title: '任务单编号',
        width: 200,
        dataIndex: 'bidBuyEndTime'
    },
    {
        key: 'bidBuyEndTime',
        title: '订单编号',
        width: 200,
        dataIndex: 'bidBuyEndTime'
    },
    {
        key: 'bidBuyEndTime',
        title: '内部合同编号',
        width: 200,
        dataIndex: 'bidBuyEndTime'
    },
    {
        key: 'bidBuyEndTime',
        title: '计划交付时间',
        width: 200,
        dataIndex: 'bidBuyEndTime'
    },
    {
        key: 'operation',
        title: '操作',
        dataIndex: 'operation',
        fixed: 'right' as FixedType,
        width: 200,
        render: (_: undefined, record: Record<string, any>): React.ReactNode => (
            <Space direction="horizontal" size="small" className={ styles.operationBtn }>
                <Link to={ `/setOutTask/setOutTaskDetail/${ record.id }` }>任务详情</Link>
                <Deliverables id={ record.id }/>
                <Popconfirm
                    title="确认提交?"
                    onConfirm={ () => {} }
                    okText="提交"
                    cancelText="取消"
                >
                    <Button type="link">提交任务</Button>
                </Popconfirm>
            </Space>
        )
    }
]

export default function SetOutTaskList(): React.ReactNode {
    return <Page
        path="/tower-market/bidInfo"
        columns={ columns }
        headTabs={ [] }
        extraOperation={ <Button type="primary" ghost>导出</Button> }
        searchFormItems={ [
            {
                name: 'startReleaseDate',
                label: '模糊查询项',
                children: <Input placeholder="放样任务编号/任务单编号/订单编号/内部合同编号"/>
            },
            {
                name: 'startReleaseDate',
                label: '最新状态变更时间',
                children: <DatePicker />
            },
            {
                name: 'startBidBuyEndTime',
                label: '任务状态',
                children: <Select style={{ width: '120px' }} placeholder="请选择">
                    <Select.Option value="0" key="0">待确认</Select.Option>
                    <Select.Option value="1" key="1">待指派</Select.Option>
                    <Select.Option value="2" key="2">已拒绝</Select.Option>
                    <Select.Option value="3" key="3">待完成</Select.Option>
                    <Select.Option value="4" key="4">已完成</Select.Option>
                    <Select.Option value="5" key="5">已提交</Select.Option>
                </Select>
            },
            {
                name: 'fuzzyQuery',
                label: '计划交付时间',
                children: <DatePicker />
            },
        ] }
    />
}