/**
 * @author zyc
 * @copyright © 2021 
 * @description 详情
*/

import React from 'react';
import { Spin, Button, Space } from 'antd';
import { useHistory, useParams } from 'react-router-dom';
import { DetailTitle, BaseInfo, DetailContent, CommonTable } from '../../common';
import RequestUtil from '../../../utils/RequestUtil';
import useRequest from '@ahooksjs/use-request';

const tableColumns = [
    {
        key: 'recordType',
        title: '操作类型',
        dataIndex: 'recordType'
    },
    {
        key: 'stateFront',
        title: '操作前状态',
        dataIndex: 'stateFront'
    },
    {
        key: 'stateAfter',
        title: '操作后状态',
        dataIndex: 'stateAfter'
    },
    {
        key: 'createUserName',
        title: '操作人',
        dataIndex: 'createUserName'
    },
    {
        key: 'createTime',
        title: '操作时间',
        dataIndex: 'createTime'
    }
]

const baseColums = [
    {
        "dataIndex": "dataNumber",
        "title": "资料编号"
    },
    {
        "dataIndex": "dataName",
        "title": "资料名称"
    },
    {
        "dataIndex": "dataTypeName",
        "title": "资料类型"
    },
    {
        "dataIndex": "designation",
        "title": "备注"
    }
]

export default function DataDetail(): React.ReactNode {
    const history = useHistory();
    const params = useParams<{ id: string }>();
    const { loading, data } = useRequest(() => new Promise(async (resole, reject) => {
        const data = await RequestUtil.get(`/tower-system/dataRecord/${params.id}`)
        resole(data)
    }), {})
    const detailData: any = data;
    if (loading) {
        return <Spin spinning={loading}>
            <div style={{ width: '100%', height: '300px' }}></div>
        </Spin>
    }

    return <>
        <DetailContent operation={[
            <Space direction="horizontal" size="small" >
                <Button onClick={() => history.goBack()}>关闭</Button>
            </Space>
        ]}>
            <DetailTitle title="基本信息" />
            <BaseInfo columns={baseColums} dataSource={detailData} col={2} />
            <DetailTitle title="操作信息" />
            <CommonTable columns={tableColumns} dataSource={detailData.businessRecordVOList} pagination={false} />
        </DetailContent>
    </>
}