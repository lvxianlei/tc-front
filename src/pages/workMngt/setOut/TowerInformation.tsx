/**
 * @author zyc
 * @copyright © 2021 
 * @description 工作管理-放样列表-塔型信息
*/

import React from 'react';
import { Space, DatePicker, Select, Button, Popconfirm } from 'antd';
import { Page } from '../../common';
import { FixedType } from 'rc-table/lib/interface';
import styles from './SetOut.module.less';
import { Link, useHistory, useParams } from 'react-router-dom';
import TowerLoftingAssign from './TowerLoftingAssign';

const columns = [
    {
        key: 'index',
        title: '序号',
        dataIndex: 'index',
        width: 50,
        fixed: 'left' as FixedType,
        render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (<span>{ index + 1 }</span>)
    },
    {
        key: 'projectName',
        title: '塔型',
        width: 150,
        dataIndex: 'projectName'
    },
    {
        key: 'projectNumber',
        title: '优先级',
        dataIndex: 'projectNumber',
        width: 120
    },
    {
        key: 'bidBuyEndTime',
        title: '段名',
        width: 200,
        dataIndex: 'bidBuyEndTime'
    },
    {
        key: 'biddingEndTime',
        title: '模式',
        width: 150,
        dataIndex: 'biddingEndTime',
    },
    {
        key: 'biddingPerson',
        title: '计划交付时间',
        dataIndex: 'biddingPerson',
        width: 200,
    },
    {
        key: 'bidBuyEndTime',
        title: '放样人',
        width: 200,
        dataIndex: 'bidBuyEndTime'
    },
    {
        key: 'bidBuyEndTime',
        title: '校核人',
        width: 200,
        dataIndex: 'bidBuyEndTime'
    },
    {
        key: 'bidBuyEndTime',
        title: '放样状态',
        width: 200,
        dataIndex: 'bidBuyEndTime'
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
        width: 250,
        render: (_: undefined, record: Record<string, any>): React.ReactNode => (
            <Space direction="horizontal" size="small" className={ styles.operationBtn }>
                <Link to={ `/workMngt/setOutList/towerInformation/${ record.id }/lofting/${ record.id }` }>放样</Link>
                <Link to={ `/workMngt/setOutList/towerInformation/${ record.id }/NCProgram/${ record.id }` }>NC程序</Link>
                <Link to={ `/workMngt/setOutList/towerInformation/${ record.id }/towerCheck/${ record.id }` }>校核</Link>
                <Link to={ `/workMngt/setOutList/towerInformation/${ record.id }/towerLoftingDetails/${ record.id }` }>塔型放样明细</Link>
            </Space>
        )
    }
]

export default function TowerInformation(): React.ReactNode {
    const history = useHistory();
    const params = useParams<{ id: string }>();
    return <Page
        path="/tower-market/bidInfo"
        columns={ columns }
        headTabs={ [] }
        extraOperation={ <Space direction="horizontal" size="small">
            <Button type="primary" ghost>导出</Button>
            <Popconfirm
                title="确认提交?"
                onConfirm={ () => {} }
                okText="提交"
                cancelText="取消"
            >
                <Button type="primary" ghost>提交</Button>
            </Popconfirm>
            <TowerLoftingAssign id={ params.id }/>
            <Button type="primary" ghost onClick={() => history.goBack()}>返回上一级</Button>
        </Space>}
        searchFormItems={ [
            {
                name: 'startReleaseDate',
                label: '最新状态变更时间',
                children: <DatePicker />
            },
            {
                name: 'startBidBuyEndTime',
                label: '放样状态',
                children: <Select style={{ width: '120px' }} placeholder="请选择">
                    <Select.Option value="0" key="0">放样中</Select.Option>
                    <Select.Option value="1" key="1">校核中</Select.Option>
                    <Select.Option value="2" key="2">已完成</Select.Option>
                    <Select.Option value="3" key="3">已提交</Select.Option>
                </Select>
            },
            {
                name: 'startBidBuyEndTime',
                label: '放样人',
                children: <Select style={{ width: '120px' }} placeholder="请选择">
                    <Select.Option value="0" key="0">放样人</Select.Option>
                </Select>
            },
            {
                name: 'startBidBuyEndTime',
                label: '校核人',
                children: <Select style={{ width: '120px' }} placeholder="请选择">
                    <Select.Option value="0" key="0">校核人</Select.Option>
                </Select>
            }
        ] }
    />
}