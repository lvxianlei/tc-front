import React from 'react';
import { Space, Button } from 'antd';
import { Page } from '../common';
import { FixedType } from 'rc-table/lib/interface';
import styles from './SetOutTask.module.less';
import { useHistory, useParams } from 'react-router-dom';

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
        key: 'name',
        title: '塔型',
        width: 150,
        dataIndex: 'name'
    },
    {
        key: 'steelProductShape',
        title: '钢印号塔型',
        dataIndex: 'steelProductShape',
        width: 120
    },
    {
        key: 'num',
        title: '基数',
        width: 200,
        dataIndex: 'num'
    },
    {
        key: 'loftingLeaderName',
        title: '放样负责人',
        width: 150,
        dataIndex: 'loftingLeaderName'
    },
    {
        key: 'loftingUserName',
        title: '放样人',
        dataIndex: 'loftingUserName',
        width: 200
    },
    {
        key: 'loftingDeliverTime',
        title: '放样交付时间',
        width: 200,
        dataIndex: 'loftingDeliverTime'
    },
    {
        key: 'loftingStatus',
        title: '塔型放样状态',
        width: 200,
        dataIndex: 'loftingStatus'
    },
    {
        key: 'materialLeaderName',
        title: '提料负责人',
        width: 200,
        dataIndex: 'materialLeaderName'
    },
    {
        key: 'materialUserName',
        title: '提料人',
        width: 200,
        dataIndex: 'materialUserName'
    },
    {
        key: 'materialDeliverTime',
        title: '提料交付时间',
        width: 200,
        dataIndex: 'materialDeliverTime'
    },
    {
        key: 'materialStatus',
        title: '塔型提料状态',
        width: 200,
        dataIndex: 'materialStatus'
    },
    {
        key: 'boltLeaderName',
        title: '螺栓负责人',
        width: 200,
        dataIndex: 'boltLeaderName'
    },
    {
        key: 'boltDeliverTime',
        title: '螺栓交付时间',
        width: 200,
        dataIndex: 'boltDeliverTime'
    },
    {
        key: 'boltStatus',
        title: '螺栓清单状态',
        width: 200,
        dataIndex: 'boltStatus'
    },
    {
        key: 'smallSampleLeaderName',
        title: '小样图负责人',
        width: 200,
        dataIndex: 'smallSampleLeaderName'
    },
    {
        key: 'smallSampleDeliverTime',
        title: '小样图交付时间',
        width: 200,
        dataIndex: 'smallSampleDeliverTime'
    },
    {
        key: 'smallSampleStatus',
        title: '小样图清单状态',
        width: 200,
        dataIndex: 'smallSampleStatus'
    },
    {
        key: 'combinedWeldingLeaderName',
        title: '组焊负责人',
        width: 200,
        dataIndex: 'combinedWeldingLeaderName'
    },
    {
        key: 'combinedWeldingDeliverTime',
        title: '组焊交付时间',
        width: 200,
        dataIndex: 'combinedWeldingDeliverTime'
    },
    {
        key: 'boltStatus',
        title: '组焊清单状态',
        width: 200,
        dataIndex: 'boltStatus'
    }
]

export default function SetOutTaskTower(): React.ReactNode {
    const history = useHistory();
    const params = useParams<{ id: string }>();
    return <Page
        path="/tower-science/productCategory/list"
        requestData={{ loftingTaskId: params.id  }}
        columns={ columns }
        headTabs={ [] }
        extraOperation={ 
            <Space direction="horizontal" size="small" className={ styles.bottomBtn }>
                <Button type="primary">导出</Button>
                <Button type="ghost" onClick={() => history.goBack()}>返回上一级</Button>
            </Space> 
        }
        searchFormItems={ [] }
        tableProps={{ 
            pagination: false
        }}
    />
}