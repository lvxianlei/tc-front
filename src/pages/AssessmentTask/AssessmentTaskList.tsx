import React from 'react';
import { Space, Input, DatePicker, Select, Button, Popconfirm } from 'antd';
import { Link } from 'react-router-dom';
import { Page } from '../common';
import { FixedType } from 'rc-table/lib/interface';
import AssessmentInformation from './AssessmentInformation';
import styles from './AssessmentTask.module.less';
import Assign from './Assign';

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
        title: '评估任务编号',
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
        title: '评估人',
        width: 150,
        dataIndex: 'biddingEndTime'
    },
    {
        key: 'biddingPerson',
        title: '项目名称',
        dataIndex: 'biddingPerson',
        width: 200
    },
    {
        key: 'biddingAgency',
        title: '客户名称',
        dataIndex: 'biddingAgency',
        width: 200
    },
    {
        key: 'biddingAddress',
        title: '项目负责人',
        dataIndex: 'biddingAddress',
        width: 150
    },
    {
        key: 'releaseDate',
        title: '投标截止时间',
        dataIndex: 'releaseDate',
        width: 200
    },
    {
        key: 'operation',
        title: '操作',
        dataIndex: 'operation',
        fixed: 'right' as FixedType,
        width: 230,
        render: (_: undefined, record: Record<string, any>): React.ReactNode => (
            <Space direction="horizontal" size="small" className={ styles.operationBtn }>
                <Link to={ `/assessmentTask/assessmentTaskDetail/${ record.id }` }>任务详情</Link>
                <Assign id={ record.id } />
                <AssessmentInformation id={ record.id } />
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

export default function AssessmentTaskList(): React.ReactNode {
    return <Page
        path="/tower-market/bidInfo"
        columns={ columns }
        headTabs={ [] }
        extraOperation={ <Button type="primary" ghost>导出</Button> }
        searchFormItems={ [
            {
                name: 'startReleaseDate',
                label: '模糊查询项',
                children: <Input placeholder="任务编号/项目名称/客户名称"/>
            },
            {
                name: 'fuzzyQuery',
                label: '最新状态变更时间',
                children: <DatePicker />
            },
            {
                name: 'startBidBuyEndTime',
                label: '任务状态',
                children: <Select style={{ width: '120px' }}>
                    <Select.Option value="0" key="0">aaaaaaaaaa</Select.Option>
                    <Select.Option value="1" key="1">bbbbbbbbbb</Select.Option>
                    <Select.Option value="2" key="2">bbbggggggggggggggggbbbbbbb</Select.Option>
                    <Select.Option value="3" key="3">bbbbbbbbbb</Select.Option>
                    <Select.Option value="4" key="4">bbbbbbbbbb</Select.Option>
                </Select>
            },
            {
                name: 'startReleaseDate',
                label: '项目负责人',
                children: <Input />
            },
            {
                name: 'startReleaseDate',
                label: '评估人',
                children: <Input />
            },
            {
                name: 'fuzzyQuery',
                label: '投标截止时间',
                children: <DatePicker />
            }
        ] }
    />
}