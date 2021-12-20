import React, { useState } from 'react'
import { Button, Spin, Space, Modal, Form, message, Image, Table } from 'antd';
import { useHistory, useParams } from 'react-router-dom';
import { BaseInfo, DetailContent, CommonTable, DetailTitle } from '../../common';
import { baseInfoData } from './warehousingTaskData.json';
import useRequest from '@ahooksjs/use-request';
import RequestUtil from '../../../utils/RequestUtil';
import TextArea from 'antd/lib/input/TextArea';

const tableColumns = [
    { title: '塔型', dataIndex: 'productCategoryName', key: 'productCategoryName', },
    { title: '杆塔号', dataIndex: 'productNumber', key: 'productNumber' },
    { title: '呼高', dataIndex: 'productHeight', key: 'productHeight' },
    { title: '入库重量', dataIndex: 'warehouseWeight', key: 'warehouseWeight'},
    { title: '总基数', dataIndex: 'number', key: 'number'},
    { title: '入库基数', dataIndex: 'currentStatus', key: 'currentStatus'},
    { title: '备注', dataIndex: 'description', key: 'description' }
]

const packageColumns = [
    { title: '捆号/包号', dataIndex: 'balesCode', key: 'balesCode', },
    { title: '包类型', dataIndex: 'typeName', key: 'typeName' },
    { title: '重量', dataIndex: 'weight', key: 'weight' },
    { title: '入库数', dataIndex: 'num', key: 'num'},
    { title: '库位', dataIndex: 'warehousePosition', key: 'warehousePosition' }
]

export default function WarehousingView(): React.ReactNode {
    const history = useHistory();
    const params = useParams<{ id: string ,status: string}>();
    const [ packageDataSource, setPackageDataSource] = useState<any>([]);
    const { loading, data } = useRequest(() => new Promise(async (resole, reject) => {
        const data: any = await RequestUtil.get(`/packageWorkshop/taskCollectDetail/${params.id}`)
        const packageData= await RequestUtil.get(`tower-production/packageWorkshop/packageList/${data.productVOList[0].id}`);
        setPackageDataSource(packageData)
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
                <DetailTitle title="杆塔信息" />
                <Table 
                    columns={tableColumns}
                    dataSource={detailData?.productVOList} 
                    onRow={record => {
                        return {
                          onClick: async event => {
                              const packageData= await RequestUtil.get(`tower-production/packageWorkshop/packageList/${record.id}`);
                              setPackageDataSource(packageData)
                          }, // 点击行
                        };
                    }}
                    pagination={false}
                />
                <DetailTitle title="包信息" />
                <CommonTable 
                    columns={packageColumns}
                    dataSource={packageDataSource} 
                    pagination={false}
                />
            </DetailContent>
        </Spin>
    </>
}