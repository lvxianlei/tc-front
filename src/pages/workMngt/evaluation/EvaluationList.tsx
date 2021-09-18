import React from 'react';
import { Space, Input, DatePicker, Select, Button } from 'antd';
import { Page } from '../../common';
import { FixedType } from 'rc-table/lib/interface';
import styles from './Evaluation.module.less';
import EvaluationInformation from './EvaluationInformation';

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
        title: '项目名称',
        dataIndex: 'projectNumber',
        width: 120
    },
    {
        key: 'bidBuyEndTime',
        title: '计划交付时间',
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
        title: '状态',
        dataIndex: 'biddingPerson',
        width: 200
    },
    {
        key: 'bidBuyEndTime',
        title: '最新状态变更时间',
        width: 200,
        dataIndex: 'bidBuyEndTime'
    },
    {
        key: 'operation',
        title: '操作',
        dataIndex: 'operation',
        fixed: 'right' as FixedType,
        width: 150,
        render: (_: undefined, record: Record<string, any>): React.ReactNode => (
            <Space direction="horizontal" size="small" className={ styles.operationBtn }>
                <EvaluationInformation id={ record.id }/>
            </Space>
        )
    }
]

export default function EvaluationList(): React.ReactNode {
    return <Page
        path="/tower-market/bidInfo"
        columns={ columns }
        headTabs={ [] }
        extraOperation={ <Button type="primary" ghost>导出</Button> }
        searchFormItems={ [
            {
                name: 'startReleaseDate',
                label: '模糊查询项',
                children: <Input placeholder="任务编号/项目名称"/>
            },
            {
                name: 'startBidBuyEndTime',
                label: '任务状态',
                children: <Select style={{ width: '120px' }}>
                    <Select.Option value="0" key="0">待完成</Select.Option>
                    <Select.Option value="1" key="1">已完成</Select.Option>
                </Select>
            },
            {
                name: 'fuzzyQuery',
                label: '计划交付时间',
                children: <DatePicker />
            },
            {
                name: 'startReleaseDate',
                label: '评估人',
                children: <Input />
            }
        ] }
    />
}