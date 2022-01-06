import React, { useState } from 'react'
import { Button, Spin} from 'antd';
import { useHistory, useParams } from 'react-router-dom';
import { BaseInfo, DetailContent, CommonTable, DetailTitle } from '../../common';
import { baseInfoData } from './deliveryTaskData.json';
import useRequest from '@ahooksjs/use-request';
import RequestUtil from '../../../utils/RequestUtil';

const tableColumns = [
    { 
        title: '出库状态', 
        dataIndex: 'status', 
        key: 'status',
        render: (status: number): React.ReactNode => {
            switch (status) {
                case -1:
                    return '-';
                case 1:
                    return '未出库';
                case 2:
                    return '已出库';
            }
    
        } 
    },
    { 
        title: '产品名称', 
        dataIndex: 'productTypeName', 
        key: 'productTypeName' 
    },
    { 
        title: '包名称', 
        dataIndex: 'balesCode', 
        key: 'balesCode' 
    },
    { 
        title: '塔型', 
        dataIndex: 'productCategoryName', 
        key: 'productCategoryName'
    },
    { 
        title: '塔位号', 
        dataIndex: 'productNumber', 
        key: 'productNumber'
    },
    { 
        title: '呼高', 
        dataIndex: 'productHeight',
        key: 'productHeight'
    },
    { 
        title: '基数', 
        dataIndex: 'number', 
        key: 'number' 
    },
    { 
        title: '班组', 
        dataIndex: 'teamName', 
        key: 'teamName' 
    },
    { 
        title: '发包人员', 
        dataIndex: 'userNames', 
        key: 'userNames'
    }
]


export default function DeliveryView(): React.ReactNode {
    const history = useHistory();
    const params = useParams<{ id: string ,status: string}>();
    const { loading, data } = useRequest(() => new Promise(async (resole, reject) => {
        const data: any = await RequestUtil.get(`tower-production/packageWorkshop/exWarehouse/${params.id}`)
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
                <CommonTable columns={tableColumns} dataSource={detailData?.packageExProductVOList} pagination={ false } />
            </DetailContent>
        </Spin>
    </>
}