/**
 * @author zyc
 * @copyright © 2021 
 * @description 工作管理-放样列表-杆塔信息
*/

import React from 'react';
import { Space, DatePicker, Select, Button } from 'antd';
import { Page } from '../../common';
import { FixedType } from 'rc-table/lib/interface';
import styles from './SetOut.module.less';
import { Link, useHistory } from 'react-router-dom';
import WithSectionModal from './WithSectionModal';

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
        title: '杆塔号',
        width: 150,
        dataIndex: 'projectName'
    },
    {
        key: 'projectNumber',
        title: '塔型',
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
        title: '配段人',
        width: 150,
        dataIndex: 'biddingEndTime',
    },
    {
        key: 'biddingPerson',
        title: '杆塔放样状态',
        dataIndex: 'biddingPerson',
        width: 200,
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
        width: 200,
        render: (_: undefined, record: Record<string, any>): React.ReactNode => (
            <Space direction="horizontal" size="small" className={ styles.operationBtn }>
                <WithSectionModal id={ record.id }/>
                <Link to={ `/workMngt/setOutList/poleInformation/${ record.id }/poleLoftingDetails/${ record.id }` }>杆塔放样明细</Link>
                <Link to={ `/workMngt/setOutList/poleInformation/${ record.id }/packingList/${ record.id }` }>包装清单</Link>
            </Space>
        )
    }
]

export default function PoleInformation(): React.ReactNode {
    const history = useHistory();
    
    return <Page
        path="/tower-market/bidInfo"
        columns={ columns }
        headTabs={ [] }
        extraOperation={ <Space direction="horizontal" size="small">
            <Button type="primary" ghost>导出</Button>
            <Button type="primary" ghost>完成汇总</Button>
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
                label: '杆塔放样状态',
                children: <Select style={{ width: '120px' }} placeholder="请选择">
                    <Select.Option value="0" key="0">放样中</Select.Option>
                    <Select.Option value="1" key="1">校核中</Select.Option>
                    <Select.Option value="2" key="2">已完成</Select.Option>
                    <Select.Option value="3" key="3">已提交</Select.Option>
                </Select>
            },
            {
                name: 'startBidBuyEndTime',
                label: '配段人',
                children: <Select style={{ width: '120px' }} placeholder="请选择">
                    <Select.Option value="0" key="0">放样人</Select.Option>
                </Select>
            }
        ] }
    />
}