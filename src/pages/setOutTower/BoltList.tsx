import React, { useState } from 'react'
import { Button, Spin } from 'antd';
import { useHistory, useParams } from 'react-router-dom';
import { DetailContent, CommonTable, DetailTitle } from '../common';
import useRequest from '@ahooksjs/use-request';
import RequestUtil from '../../utils/RequestUtil';

export default function BoltInfo(): React.ReactNode {
    const history = useHistory()
    const [visible, setVisible] = useState<boolean>(false);
    const params = useParams<{ id: string }>()
    const { loading, data } = useRequest(() => new Promise(async (resole, reject) => {
        const data: any = await RequestUtil.get(`/tower-market/bidInfo/${params.id}`)
        resole(data)
    }), {})
    const detailData: any = data;
    const columns = [
        { title: '序号', dataIndex: 'index', key: 'index', render: (_a: any, _b: any, index: number): React.ReactNode => (<span>{index + 1}</span>) },
        { title: '名称', dataIndex: 'partBidNumber', key: 'partBidNumber', },
        { title: '规格', dataIndex: 'goodsType', key: 'goodsType' },
        { title: '无扣长', dataIndex: 'packageNumber', key: 'packgeNumber' },
        { title: '等级', dataIndex: 'amount', key: 'amount' },
        { title: '1', dataIndex: 'goodsType', key: 'goodsType' },
        { title: '2', dataIndex: 'packageNumber', key: 'packgeNumber' },
        { title: '3', dataIndex: 'goodsType', key: 'goodsType' },
        { title: '4', dataIndex: 'unit', key: 'unit' },
        { title: '5', dataIndex: 'goodsType', key: 'goodsType' },
        { title: '总计', dataIndex: 'unit', key: 'unit' },
    ]
    return <>
        <Spin spinning={loading}>
            <DetailContent operation={[
                <Button key="goback" onClick={() => history.goBack()}>返回</Button>
            ]}>
                <DetailTitle title="螺栓清单" />
                <CommonTable columns={columns} dataSource={detailData?.cargoVOList} />
            </DetailContent>
        </Spin>
    </>
}