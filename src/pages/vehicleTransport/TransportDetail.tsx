import React from 'react';
import { Space, Button } from 'antd';
import { DetailTitle, Page } from '../common';
import { FixedType } from 'rc-table/lib/interface';
import { useHistory, useParams } from 'react-router-dom';

const columns = [
    {
        key: 'index',
        title: '序号',
        dataIndex: 'index',
        width: 50,
        fixed: 'left' as FixedType,
        render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (<span>{index + 1}</span>)
    },
    {
        key: 'productNumber',
        title: '条码',
        width: 150,
        dataIndex: 'productNumber'
    },
    {
        key: 'productCategoryName',
        title: '件号',
        dataIndex: 'productCategoryName',
        width: 120
    },
    {
        key: 'loftingLeaderName',
        title: '材料',
        width: 200,
        dataIndex: 'loftingLeaderName'
    },
    {
        key: 'loftingDeliverTime',
        title: '材质',
        width: 200,
        dataIndex: 'loftingDeliverTime'
    },
    {
        key: 'loftingStatus',
        title: '规格',
        width: 200,
        dataIndex: 'loftingStatus'
    },
    {
        key: 'materialLeaderName',
        title: '长度（mm）',
        width: 200,
        dataIndex: 'materialLeaderName'
    },
    {
        key: 'materialDeliverTime',
        title: '类型',
        width: 200,
        dataIndex: 'materialDeliverTime'
    },
    {
        key: 'materialStatus',
        title: '单件孔数',
        width: 200,
        dataIndex: 'materialStatus'
    },
    {
        key: 'materialStatus',
        title: '单段数',
        width: 200,
        dataIndex: 'materialStatus'
    },
    {
        key: 'materialStatus',
        title: '加工数',
        width: 200,
        dataIndex: 'materialStatus'
    },
    {
        key: 'materialStatus',
        title: '试装数',
        width: 200,
        dataIndex: 'materialStatus'
    },
    {
        key: 'materialStatus',
        title: '总重（kg）',
        width: 200,
        dataIndex: 'materialStatus'
    },
    {
        key: 'materialStatus',
        title: '工艺流程',
        width: 200,
        dataIndex: 'materialStatus'
    },
    {
        key: 'materialStatus',
        title: '所在车间',
        width: 200,
        dataIndex: 'materialStatus'
    },
    {
        key: 'materialStatus',
        title: '所在工序',
        width: 200,
        dataIndex: 'materialStatus'
    }
]

export default function TransportDetail(): React.ReactNode {
    const history = useHistory();
    const params = useParams<{ id: string }>();
    return <>
        <DetailTitle title={'构件明细列表'} />
        <Page
            path="/vehicle/transport/task/detail"
            requestData={{ taskId: params.id }}
            columns={columns}
            headTabs={[]}
            extraOperation={
                <Space direction="horizontal" size="small">
                    <Button type="ghost" onClick={() => history.goBack()}>返回</Button>
                </Space>
            }
            searchFormItems={[]}
        />
    </>
}