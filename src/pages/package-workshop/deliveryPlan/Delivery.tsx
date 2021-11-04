import React, { useState } from 'react'
import { Button, Spin} from 'antd';
import { useHistory, useParams } from 'react-router-dom';
import { BaseInfo, DetailContent, CommonTable, DetailTitle } from '../../common';
import { baseInfoData } from './deliveryTaskData.json';
import useRequest from '@ahooksjs/use-request';
import RequestUtil from '../../../utils/RequestUtil';

const tableColumns = [
    { title: '出库状态', dataIndex: 'ptcreateDeName', key: 'createDeptName', },
    { title: '产品名称', dataIndex: 'createUserName', key: 'createUserName' },
    { title: '包名称', dataIndex: 'createTime', key: 'createTime' },
    { title: '塔型', dataIndex: 'currentStatus', key: 'currentStatus'},
    { title: '塔位号', dataIndex: 'currentStatus', key: 'currentStatus'},
    { title: '呼高', dataIndex: 'currentStatus', key: 'currentStatus'},
    { title: '基数', dataIndex: 'description', key: 'description' },
    { title: '班组', dataIndex: 'description', key: 'description' },
    { title: '发包人员', dataIndex: 'description', key: 'description' }
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
            </DetailContent>
        </Spin>
    </>
}