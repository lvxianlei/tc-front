import React from 'react'
import { Button, Spin, Space } from 'antd';
import { useHistory, useParams } from 'react-router-dom';
import { DetailContent, CommonTable } from '../../../common';
import useRequest from '@ahooksjs/use-request';
import RequestUtil from '../../../../utils/RequestUtil';

const towerColumns = [
    { title: '序号', dataIndex: 'index', key: 'index', render: (_a: any, _b: any, index: number): React.ReactNode => (<span>{index + 1}</span>) },
    { title: '段名', dataIndex: 'partBidNumber', key: 'partBidNumber', },
    { title: '段重复数', dataIndex: 'amount', key: 'amount' },
    { title: '构件编号', dataIndex: 'goodsType', key: 'goodsType' },
    { title: '材料名称', dataIndex: 'packageNumber', key: 'packgeNumber' },
    { title: '材质', dataIndex: 'amount', key: 'amount' },
    { title: '规格', dataIndex: 'unit', key: 'unit' },
    { title: '宽度（mm）', dataIndex: 'amount', key: 'amount' },
    { title: '厚度（mm）', dataIndex: 'amount', key: 'amount' },
    { title: '长度（mm）', dataIndex: 'packageNumber', key: 'packgeNumber' },
    { title: '单段件数', dataIndex: 'packageNumber', key: 'packgeNumber' },
    { title: '理算重量（kg）', dataIndex: 'unit', key: 'unit' },
    { title: '单件重量（kg）', dataIndex: 'packageNumber', key: 'packgeNumber' },
    { title: '小计重量（kg）', dataIndex: 'amount', key: 'amount' },
    { title: '总计重量（kg）', dataIndex: 'amount', key: 'amount' },
    { title: '备注', dataIndex: 'unit', key: 'unit' }
]

export default function PickTowerDetail(): React.ReactNode {
    const history = useHistory()
    const params = useParams<{ id: string }>()
    const { loading, data } = useRequest(() => new Promise(async (resole, reject) => {
        const data: any = await RequestUtil.get(`/tower-market/bidInfo/${params.id}`)
        resole(data)
    }), {})
    const detailData: any = data
    return <>
        <Spin spinning={loading}>
            <DetailContent operation={[
                <Button key="goback" onClick={() => history.goBack()}>返回</Button>
            ]}>
                <Button type='primary' onClick={()=>{window.open()}}>导出</Button>
                <CommonTable dataSource={[]} columns={towerColumns}/>
            </DetailContent>
        </Spin>
    </>
}