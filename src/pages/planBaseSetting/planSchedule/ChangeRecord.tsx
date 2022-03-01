/**
 * @author zyc
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
        "dataIndex": "title",
        "title": "塔型"
    },
    {
        "dataIndex": "content",
        "title": "杆塔"
    }
]
export default function DistributedTech(): React.ReactNode {
    const [dataSource, setDataSorce] = useState<IPlanSchedule[]>([]);
    const params = useParams<{ ids: string }>();
    const history = useHistory();

    const { loading, data } = useRequest<IPlanSchedule[]>(() => new Promise(async (resole, reject) => {
        try {
            const data: IPlanSchedule[] = await RequestUtil.post(`/tower-aps/productionPlan/issue/detail/plan`, [...params.ids.split(',')]);
            setDataSorce(data)
            resole(data)
        } catch (error) {
            reject(error)
        }
    }), { refreshDeps: [] })

    const columns = [
        {
            key: 'customerDeliveryTime',
            title: '原计划交货日期',
            dataIndex: 'customerDeliveryTime',
            width: 120
        },
        {
            key: 'planDeliveryTime',
            title: '变更后交货日期',
            dataIndex: 'planDeliveryTime',
            width: 120,
            format: 'YYYY-MM-DD'
        },
        {
            key: 'reason',
            title: '交货期变更原因',
            dataIndex: 'reason',
            width: 150,
        },
        {
            key: 'reason',
            title: '操作时间',
            dataIndex: 'reason',
            width: 150,
        },
        {
            key: 'reason',
            title: '操作人',
            dataIndex: 'reason',
            width: 150,
        },
    ]



    return (
        <Spin spinning={loading}>
            <DetailContent operation={[<Button type="ghost" onClick={() => history.goBack()}>返回</Button>]}>
                <DetailTitle title='基础信息'/>
                <BaseInfo columns={baseColums} dataSource={{}}/>
                <DetailTitle title='计划交货期变更记录'/>
                <CommonTable
                    scroll={{ x: '700' }}
                    rowKey="id"
                    dataSource={dataSource}
                    pagination={false}
                    columns={columns}
                />
            </DetailContent>
        </Spin>
    )
}