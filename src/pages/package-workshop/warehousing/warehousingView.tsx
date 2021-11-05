import React, { useState } from 'react'
import { Button, Spin, Space, Modal, Form, message, Image } from 'antd';
import { useHistory, useParams } from 'react-router-dom';
import { BaseInfo, DetailContent, CommonTable, DetailTitle } from '../../common';
import { baseInfoData } from './warehousingTaskData.json';
import useRequest from '@ahooksjs/use-request';
import RequestUtil from '../../../utils/RequestUtil';
import TextArea from 'antd/lib/input/TextArea';

const tableColumns = [
    { title: '塔型', dataIndex: 'ptcreateDeName', key: 'createDeptName', },
    { title: '杆塔号', dataIndex: 'createUserName', key: 'createUserName' },
    { title: '呼高', dataIndex: 'createTime', key: 'createTime' },
    { title: '入库重量', dataIndex: 'currentStatus', key: 'currentStatus'},
    { title: '总基数', dataIndex: 'currentStatus', key: 'currentStatus'},
    { title: '入库基数', dataIndex: 'currentStatus', key: 'currentStatus'},
    { title: '备注', dataIndex: 'description', key: 'description' }
]

const packageColumns = [
    { title: '捆号/包号', dataIndex: 'ptcreateDeName', key: 'createDeptName', },
    { title: '包类型', dataIndex: 'createUserName', key: 'createUserName' },
    { title: '重量', dataIndex: 'createTime', key: 'createTime' },
    { title: '入库数', dataIndex: 'currentStatus', key: 'currentStatus'},
    { title: '库位', dataIndex: 'description', key: 'description' }
]

export default function ConfirmTaskDetail(): React.ReactNode {
    const history = useHistory();
    const params = useParams<{ id: string ,status: string}>();
    const { loading, data } = useRequest(() => new Promise(async (resole, reject) => {
        const data: any = await RequestUtil.get(`/tower-science/drawTask/getDrawTaskById?drawTaskId=${params.id}`)
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
                <CommonTable columns={tableColumns} dataSource={detailData?.statusRecordList} pagination={ false } />
                <DetailTitle title="包信息"/>
                <CommonTable columns={packageColumns} dataSource={detailData?.statusRecordList} pagination={ false } />
            </DetailContent>
        </Spin>
    </>
}