import React, { useState } from 'react'
import { Button, Spin } from 'antd';
import { useHistory, useParams } from 'react-router-dom';
import { BaseInfo, DetailContent, CommonTable, DetailTitle } from '../../common';
import { packageData } from './detail.json';
import useRequest from '@ahooksjs/use-request';
import RequestUtil from '../../../utils/RequestUtil';



export default function PackageDetail(): React.ReactNode {
    const history = useHistory();
    const params = useParams<{ id: string, status: string, productNumber: string }>();
    const { loading, data } = useRequest(() => new Promise(async (resole, reject) => {
        const value: any = await RequestUtil.get(`tower-production/packageWorkshop/taskDetail/${params.id}`)
        const data: any = await RequestUtil.get(`tower-production/packageWorkshop/packageDetail`, {
            planId: params.id,
            planNumber: value.planNumber,
            productCategoryName: value.productCategoryName,
            productNumber: params.productNumber,
        })
        data.productNumber = params.productNumber
        resole(data)
    }), {})
    const detailData: any = data;
    const tableColumns = [
        {
            title: '捆号',
            dataIndex: 'balesCode',
            key: 'balesCode'
        },
        {
            title: '件号',
            dataIndex: 'pieceCode',
            key: 'pieceCode',
        },
        {
            title: '材料规格',
            dataIndex: 'structureSpec'
        },
        {
            title: '长度',
            dataIndex: 'length',
            key: 'length'
        },
        {
            title: '数量',
            dataIndex: 'num',
            key: 'num'
        },
        {
            title: '备注',
            dataIndex: 'description',
            key: 'description'
        }
    ]
    return <>
        <Spin spinning={loading}>
            <DetailContent operation={[
                <Button key="goback" onClick={() => history.goBack()}>返回</Button>
            ]}>
                <DetailTitle title="包装清单信息" />
                <BaseInfo columns={packageData} dataSource={detailData || {}} />
                <DetailTitle title="件号明细" />
                <CommonTable
                    columns={tableColumns}
                    dataSource={detailData?.packingStructureVOList}
                    pagination={false}
                />
            </DetailContent>
        </Spin>
    </>
}