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
        key: 'productNumber',
        title: '杆塔号',
        width: 150,
        dataIndex: 'productNumber'
    },
    {
        key: 'productCategoryName',
        title: '塔型',
        dataIndex: 'productCategoryName',
        width: 120
    },
    {
        key: 'loftingLeaderName',
        title: '放样负责人',
        width: 200,
        dataIndex: 'loftingLeaderName'
    },
    {
        key: 'loftingDeliverTime',
        title: '放样交付时间',
        width: 200,
        dataIndex: 'loftingDeliverTime'
    },
    {
        key: 'loftingStatus',
        title: '杆塔放样状态',
        width: 200,
        dataIndex: 'loftingStatus',
        render: (status: number): React.ReactNode => {
            switch (status) {
                case 1:
                    return '配段中';
                case 2:
                    return '出单中';
                case 3:
                    return '已完成';
                case 4:
                    return '已提交';
                default:
                    return '-';
            }
        }
    },
    {
        key: 'materialLeaderName',
        title: '提料负责人',
        width: 200,
        dataIndex: 'materialLeaderName'
    },
    {
        key: 'materialDeliverTime',
        title: '提料交付时间',
        width: 200,
        dataIndex: 'materialDeliverTime'
    },
    {
        key: 'materialStatus',
        title: '杆塔提料状态',
        width: 200,
        dataIndex: 'materialStatus',
        render: (status: number): React.ReactNode => {
            switch (status) {
                case 1:
                    return '配段中';
                case 2:
                    return '已完成';
                case 3:
                    return '已提交';
                default:
                    return '-';
            }
        }
    }
]

export default function SetOutTaskPole(): React.ReactNode {
    const history = useHistory();
    const params = useParams<{ id: string }>();
    return <Page
        path="/tower-science/product/page"
        requestData={{ loftingTaskId: params.id  }}
        columns={ columns }
        headTabs={ [] }
        extraOperation={ 
            <Space direction="horizontal" size="small" className={ styles.bottomBtn }>
                {/* <Button type="primary">导出</Button> */}
                <Button type="ghost" onClick={() => history.goBack()}>返回上一级</Button>
            </Space> 
        }
        searchFormItems={ [] }
    />
}