/**
 * @author lxy
 * @copyright © 2022 
 * @description 计划交货期
 */

import React, { useState } from 'react';
import { Button, Modal, DatePicker, Form, Spin, message, Space, Input, Table } from 'antd';
import { BaseInfo, CommonTable, DetailContent, DetailTitle } from '../../common';
import { IPlanSchedule } from './IPlanSchedule';
import { useHistory, useParams } from 'react-router-dom';
import useRequest from '@ahooksjs/use-request';
import RequestUtil from '../../../utils/RequestUtil';
const baseColums = [
    {
        "dataIndex": "productCategoryName",
        "title": "塔型"
    },
    {
        "dataIndex": "productNumber",
        "title": "杆塔"
    }
]
export default function DistributedTech(): React.ReactNode {
    const [dataSource, setDataSorce] = useState<any>({});
    const params = useParams<{ ids: string,id: string }>();
    const history = useHistory();

    const { loading, data } = useRequest<IPlanSchedule[]>(() => new Promise(async (resole, reject) => {
        try {
            const data: any = await RequestUtil.get(`/tower-aps/productionPlan/change/record/${params.id}`);
            setDataSorce(data)
            resole(data)
        } catch (error) {
            reject(error)
        }
    }), { refreshDeps: [] })

    const columns = [
        {
            key: 'originalDeliveryTime',
            title: '原计划交货日期',
            dataIndex: 'originalDeliveryTime',
            width: 120
        },
        {
            key: 'newDeliveryTime',
            title: '变更后交货日期',
            dataIndex: 'newDeliveryTime',
            width: 120,
            format: 'YYYY-MM-DD'
        },
        {
            key: 'reason',
            title: '交货期变更原因',
            dataIndex: 'reason',
            // width: 300,
        },
        {
            key: 'createTime',
            title: '操作时间',
            dataIndex: 'createTime',
            width: 150,
        },
        {
            key: 'createUserName',
            title: '操作人',
            dataIndex: 'createUserName',
            width: 150,
        },
    ]



    return (
        <Spin spinning={loading}>
            <DetailContent operation={[<Button type="ghost" onClick={() => history.goBack()}>返回</Button>]}>
                <DetailTitle title='基础信息'/>
                <BaseInfo columns={baseColums} dataSource={dataSource}/>
                <DetailTitle title='计划交货期变更记录'/>
                <CommonTable
                    scroll={{ x: '700' }}
                    rowKey="id"
                    dataSource={dataSource?.recordVOList}
                    pagination={false}
                    columns={columns}
                />
            </DetailContent>
        </Spin>
    )
}