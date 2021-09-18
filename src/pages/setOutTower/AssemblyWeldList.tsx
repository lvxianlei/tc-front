import React, { useState } from 'react'
import { Button, Spin } from 'antd';
import { useHistory, useParams } from 'react-router-dom';
import { DetailContent, CommonTable, DetailTitle } from '../common';
import useRequest from '@ahooksjs/use-request';
import RequestUtil from '../../utils/RequestUtil';

export default function AssemblyWeldInfo(): React.ReactNode {
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
        { title: '段号', dataIndex: 'partBidNumber', key: 'partBidNumber', },
        { title: '组件号', dataIndex: 'goodsType', key: 'goodsType' },
        { title: '主件号', dataIndex: 'packageNumber', key: 'packgeNumber' },
        { title: '单段组数', dataIndex: 'amount', key: 'amount' },
        { title: '单组重量（kg）', dataIndex: 'goodsType', key: 'goodsType' },
        { title: '电焊米数（mm）', dataIndex: 'packageNumber', key: 'packgeNumber' },
        { title: '件号信息', dataIndex: 'goodsType', key: 'goodsType' },
        { title: '备注', dataIndex: 'unit', key: 'unit' },
    ]
    return <>
        <Spin spinning={loading}>
            <DetailContent operation={[
                <Button key="goback" onClick={() => history.goBack()}>返回</Button>
            ]}>
                <DetailTitle title="组焊清单" />
                <CommonTable columns={columns} dataSource={detailData?.cargoVOList} />
            </DetailContent>
        </Spin>
    </>
}