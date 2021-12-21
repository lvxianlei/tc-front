import React, { useState } from 'react'
import { Button, Spin } from 'antd';
import { useHistory, useParams } from 'react-router-dom';
import { BaseInfo, DetailContent, CommonTable, DetailTitle } from '../../common';
import { baseInfoData } from './detail.json';
import useRequest from '@ahooksjs/use-request';
import RequestUtil from '../../../utils/RequestUtil';



export default function ProcessDetail(): React.ReactNode {
    const history = useHistory();
    const params = useParams<{ id: string, status: string }>();
    const [userDataSource,setUserDataSource] = useState<any>([]);
    const { loading, data } = useRequest(() => new Promise(async (resole, reject) => {
        const data = await RequestUtil.get(`tower-production/packageWorkshop/taskDetail/${params.id}`)
        resole(data)
    }), {})
    const detailData: any = data;
    const delRow = (index: number) => {
        userDataSource.splice(index, 1);
        setUserDataSource([...userDataSource]);
    }
    const tableColumns = [
        { title: '序号', dataIndex: 'index', key: 'index', render: (_a: any, _b: any, index: number): React.ReactNode => (<span>{index + 1}</span>) },
        { title: '杆塔号', dataIndex: 'productNumber', key: 'productNumber', },
        { title: '呼高', dataIndex: 'productHeight', key: 'productHeight' },
        { title: '入库重量', dataIndex: 'warehouseWeight', key: 'warehouseWeight' },
        { title: '总基数', dataIndex: 'number', key: 'number' },
        { title: '包装清单', dataIndex: 'operation', key: 'operation',render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
            <Button type="link" onClick={()=>{
                history.push(`/packagingWorkshop/processingTask/detail/${params.id}/${params.status}/detail/${record.id}`)
            }}>明细</Button>
        ) }
    ]
    return <>
        <Spin spinning={loading}>
            <DetailContent operation={params.status!=='3'?[
                <Button key="edit" style={{ marginRight: '10px' }} type="primary" onClick={async () => {
                    history.push(`/packagingWorkshop/processingTask/detail/${params.id}/${params.status}/wareHouse`)
                }}>采集入库</Button>,
                <Button key="goback" onClick={() => history.goBack()}>返回</Button>
            ]:[
                <Button key="goback" onClick={() => history.goBack()}>返回</Button>
            ]}>
                <DetailTitle title="包装任务基本信息" />
                <BaseInfo columns={baseInfoData} dataSource={detailData || {}}/>
                <DetailTitle title="任务明细" />
                <CommonTable 
                    columns={tableColumns}
                    dataSource={detailData?.productVOList} 
                    pagination={false}
                />
            </DetailContent>
        </Spin>
    </>
}