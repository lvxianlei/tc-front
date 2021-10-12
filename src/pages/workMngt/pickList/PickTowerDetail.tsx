import React from 'react'
import { Button, Spin, Space } from 'antd';
import { useHistory, useParams } from 'react-router-dom';
import { BaseInfo, DetailContent, CommonTable, DetailTitle } from '../../common';
import { specialInfoData, productInfoData } from './pick.json';
import useRequest from '@ahooksjs/use-request';
import RequestUtil from '../../../utils/RequestUtil';

const towerColumns = [
    { title: '序号', dataIndex: 'index', key: 'index', render: (_a: any, _b: any, index: number): React.ReactNode => (<span>{index + 1}</span>) },
    { title: '段名', dataIndex: 'segmentName', key: 'segmentName', },
    { title: '段重复数', dataIndex: 'repeatNumber', key: 'repeatNumber' },
    { title: '构件编号', dataIndex: 'code', key: 'code' },
    { title: '材料名称', dataIndex: 'materialName', key: 'materialName' },
    { title: '材质', dataIndex: 'structureTexture', key: 'structureTexture' },
    { title: '规格', dataIndex: 'structureSpec', key: 'structureSpec' },
    { title: '宽度（mm）', dataIndex: 'width', key: 'width' },
    { title: '厚度（mm）', dataIndex: 'thickness', key: 'thickness' },
    { title: '长度（mm）', dataIndex: 'length', key: 'length' },
    { title: '单段件数', dataIndex: 'basicsPartNum', key: 'basicsPartNum' },
    { title: '理算重量（kg）', dataIndex: 'unit', key: 'unit' },
    { title: '单件重量（kg）', dataIndex: 'basicsTheoryWeight', key: 'basicsTheoryWeight' },
    { title: '小计重量（kg）', dataIndex: 'amount', key: 'amount' },
    { title: '总计重量（kg）', dataIndex: 'totalWeight', key: 'totalWeight' },
    { title: '备注', dataIndex: 'description', key: 'description' }
]

export default function PickTowerDetail(): React.ReactNode {
    const history = useHistory()
    const params = useParams<{ productId: string }>()
    const { loading, data } = useRequest(() => new Promise(async (resole, reject) => {
        const data: any = await RequestUtil.get(`/tower-science/drawProductStructure/material/${params.productId}`)
        // const data: any = await RequestUtil.get(`/tower-science/drawProductStructure/material/productId=${params.id}`)
        resole(data)
    }), {})
    const detailData: any = data
    return <>
        <Spin spinning={loading}>
            <DetailContent operation={[
                <Button key="goback" onClick={() => history.goBack()}>返回</Button>
            ]}>
                <Button type='primary' onClick={()=>{window.open()}}>导出</Button>
                <CommonTable dataSource={detailData?.records} columns={towerColumns}/>
            </DetailContent>
        </Spin>
    </>
}