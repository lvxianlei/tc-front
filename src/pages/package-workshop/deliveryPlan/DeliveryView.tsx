import React, { useState } from 'react'
import { Button, Spin} from 'antd';
import { useHistory, useParams } from 'react-router-dom';
import { BaseInfo, DetailContent, CommonTable, DetailTitle } from '../../common';
import { baseInfoData } from './deliveryTaskData.json';
import useRequest from '@ahooksjs/use-request';
import RequestUtil from '../../../utils/RequestUtil';

const tableColumns = [
    { title: '出库状态', dataIndex: 'exFlag', key: 'exFlag',render: (exFlag: number): React.ReactNode => {
        switch (exFlag) {
            case -1:
                return '-';
            case 0:
                return '未出库';
            case 1:
                return '部分出库';
            case 2:
                return '已出库';
        }
    } },
    { title: '产品名称', dataIndex: 'productName', key: 'productName' },
    { title: '包名称', dataIndex: 'packageName', key: 'packageName' },
    { title: '塔型', dataIndex: 'productCategoryName', key: 'productCategoryName'},
    { title: '塔位号', dataIndex: 'towerTagNum', key: 'towerTagNum'},
    { title: '呼高', dataIndex: 'productHeight', key: 'productHeight'},
    { title: '基数', dataIndex: 'baseNum', key: 'baseNum' },
    { title: '班组', dataIndex: 'teamName', key: 'teamName' },
    { title: '发包人员', dataIndex: 'packingExTeamUserVOList', key: 'packingExTeamUserVOList', render: (_: undefined, record: Record<string, any>, index: number) =>{
        return <span>{ record.packingExTeamUserVOList.join(',') }</span>
    }  }
]


export default function DeliveryView(): React.ReactNode {
    const history = useHistory();
    const params = useParams<{ id: string ,status: string}>();
    const { loading, data } = useRequest(() => new Promise(async (resole, reject) => {
        const data: any = await RequestUtil.get(`/productionLines/exGetById?id=${params.id}`)
        resole(data)
    }), {})
    const detailData: any = data;
    return <>
        <Spin spinning={loading}>
            <DetailContent operation={[
                <Button key="goback" onClick={() => history.goBack()}>返回</Button>
            ]}>
                <DetailTitle title="基本信息" />
                <BaseInfo columns={baseInfoData} dataSource={detailData || {}} col={2}/>
                <DetailTitle title="杆塔信息"/>
                <CommonTable columns={tableColumns} dataSource={detailData?.packingExTowerVOList} pagination={ false } />
            </DetailContent>
        </Spin>
    </>
}