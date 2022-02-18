import React, { useState } from 'react'
import { Button, Spin, Table } from 'antd';
import { useHistory, useParams } from 'react-router-dom';
import { BaseInfo, DetailContent, CommonTable, DetailTitle } from '../../common';
import { baseInfoData } from './warehousingTaskData.json';
import useRequest from '@ahooksjs/use-request';
import RequestUtil from '../../../utils/RequestUtil';

const tableColumns = [
    { title: '塔型', dataIndex: 'productCategoryName', key: 'productCategoryName', },
    { title: '杆塔号', dataIndex: 'productNumber', key: 'productNumber' },
    { title: '呼高', dataIndex: 'productHeight', key: 'productHeight' },
    { title: '入库重量', dataIndex: 'warehouseWeight', key: 'warehouseWeight'},
    { title: '总基数', dataIndex: 'number', key: 'number'},
    { title: '入库基数', dataIndex: 'warehouseNumber', key: 'warehouseNumber'}
]

const packageColumns = [
    { title: '捆号/包号', dataIndex: 'balesCode', key: 'balesCode', },
    { title: '包类型', dataIndex: 'packageTypeName', key: 'packageTypeName' },
    { title: '重量', dataIndex: 'weightCount', key: 'weightCount' },
    { title: '入库数', dataIndex: 'num', key: 'num'},
    { title: '库位', dataIndex: 'warehousePosition', key: 'warehousePosition' }
]

export default function WarehousingView(): React.ReactNode {
    const history = useHistory();
    const params = useParams<{ id: string ,status: string}>();
    const { loading, data } = useRequest(() => new Promise(async (resole, reject) => {
        const data: any = await RequestUtil.get(`/tower-production/packageWorkshop/taskCollectDetail/${params.id}`)
        data.packageUserNames = data?.packageUserVOList&& data?.packageUserVOList.length>0 &&data?.packageUserVOList.map((item:any)=>{
            return item.name
        }).join(',')
        resole(data)
    }), {})
    const detailData: any = data;
    return <>
        <Spin spinning={loading}>
            <DetailContent operation={[
                <Button key="goback" onClick={() => history.goBack()}>返回</Button>
            ]}>
                <DetailTitle title="基本信息" />
                <BaseInfo 
                    columns={baseInfoData} 
                    dataSource={detailData || {}} 
                    col={2}
                />
                <DetailTitle title="杆塔信息" />
                {/* <Table 
                    columns={tableColumns}
                    dataSource={detailData?.productVOList} 
                    // onRow={record => {
                    //     return {
                    //       onClick: async event => {
                    //           const packageData= await RequestUtil.get(`tower-production/packageWorkshop/packageList/${record.id}`);
                    //           setPackageDataSource(packageData)
                    //       }, // 点击行
                    //     };
                    // }}
                    pagination={false}
                /> */}
                <CommonTable 
                    columns={tableColumns}
                    dataSource={detailData?.productVOList} 
                    pagination={false}
                />
                <DetailTitle title="包信息" />
                <CommonTable 
                    columns={packageColumns}
                    dataSource={detailData?.packageVOList} 
                    pagination={false}
                />
            </DetailContent>
        </Spin>
    </>
}