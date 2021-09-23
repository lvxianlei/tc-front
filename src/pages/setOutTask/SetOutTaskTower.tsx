import React from 'react';
import { Space, Button } from 'antd';
import { Page } from '../common';
import { FixedType } from 'rc-table/lib/interface';
import styles from './SetOutTask.module.less';
import { useHistory } from 'react-router-dom';

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
        title: '钢印号塔型',
        dataIndex: 'projectNumber',
        width: 120
    },
    {
        key: 'bidBuyEndTime',
        title: '基数',
        width: 200,
        dataIndex: 'bidBuyEndTime'
    },
    {
        key: 'biddingEndTime',
        title: '放样负责人',
        width: 150,
        dataIndex: 'biddingEndTime'
    },
    {
        key: 'biddingPerson',
        title: '放样人',
        dataIndex: 'biddingPerson',
        width: 200
    },
    {
        key: 'bidBuyEndTime',
        title: '放样交付时间',
        width: 200,
        dataIndex: 'bidBuyEndTime'
    },
    {
        key: 'bidBuyEndTime',
        title: '塔型放样状态',
        width: 200,
        dataIndex: 'bidBuyEndTime'
    },
    {
        key: 'bidBuyEndTime',
        title: '提料负责人',
        width: 200,
        dataIndex: 'bidBuyEndTime'
    },
    {
        key: 'bidBuyEndTime',
        title: '提料人',
        width: 200,
        dataIndex: 'bidBuyEndTime'
    },
    {
        key: 'bidBuyEndTime',
        title: '提料交付时间',
        width: 200,
        dataIndex: 'bidBuyEndTime'
    },
    {
        key: 'bidBuyEndTime',
        title: '塔型提料状态',
        width: 200,
        dataIndex: 'bidBuyEndTime'
    },
    {
        key: 'bidBuyEndTime',
        title: '螺栓负责人',
        width: 200,
        dataIndex: 'bidBuyEndTime'
    },
    {
        key: 'bidBuyEndTime',
        title: '螺栓交付时间',
        width: 200,
        dataIndex: 'bidBuyEndTime'
    },
    {
        key: 'bidBuyEndTime',
        title: '螺栓清单状态',
        width: 200,
        dataIndex: 'bidBuyEndTime'
    },
    {
        key: 'bidBuyEndTime',
        title: '小样图负责人',
        width: 200,
        dataIndex: 'bidBuyEndTime'
    },
    {
        key: 'bidBuyEndTime',
        title: '小样图交付时间',
        width: 200,
        dataIndex: 'bidBuyEndTime'
    },
    {
        key: 'bidBuyEndTime',
        title: '小样图清单状态',
        width: 200,
        dataIndex: 'bidBuyEndTime'
    },
    {
        key: 'bidBuyEndTime',
        title: '组焊负责人',
        width: 200,
        dataIndex: 'bidBuyEndTime'
    },
    {
        key: 'bidBuyEndTime',
        title: '组焊交付时间',
        width: 200,
        dataIndex: 'bidBuyEndTime'
    },
    {
        key: 'bidBuyEndTime',
        title: '组焊清单状态',
        width: 200,
        dataIndex: 'bidBuyEndTime'
    }
]

export default function SetOutTaskTower(): React.ReactNode {
    const history = useHistory();
    
    return <Page
        path="/tower-market/bidInfo"
        columns={ columns }
        headTabs={ [] }
        extraOperation={ 
            <Space direction="horizontal" size="small" className={ styles.bottomBtn }>
                <Button type="primary">导出</Button>
                <Button type="ghost" onClick={() => history.goBack()}>返回上一级</Button>
            </Space> 
        }
        searchFormItems={ [] }
    />
}