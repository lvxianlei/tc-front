import React from 'react'
import { Button, Spin, Space} from 'antd';
import { useHistory, useParams } from 'react-router-dom';
import { DetailContent, CommonTable, DetailTitle, BaseInfo } from '../../common';
import useRequest from '@ahooksjs/use-request';
import { baseInfoData } from './quit.json';
import RequestUtil from '../../../utils/RequestUtil';

const tableColumns = [
    { title: '序号', dataIndex: 'index', key: 'index', render: (_a: any, _b: any, index: number): React.ReactNode => (<span>{index + 1}</span>) },
    { title: '审批人', dataIndex: 'ptcreateDeName', key: 'createDeptName', },
    { title: '审批时间', dataIndex: 'createUserName', key: 'createUserName' },
    { title: '审批结果', dataIndex: 'createTime', key: 'createTime' },
    { title: '审批意见', dataIndex: 'currentStatus', key: 'currentStatus'}
]
export default function View(): React.ReactNode {
    const history = useHistory()
    const params = useParams<{ id: string }>()
    const { loading, data } = useRequest(() => new Promise(async (resole, reject) => {
        const data: any = await RequestUtil.get(`/tower-hr/employeeDeparture/detail?id=${params.id}`)
        resole(data)
    }), {})
    const detailData: any = data;
    return <>
        <Spin spinning={loading}>
            <DetailContent operation={[
                <Button key="goback" onClick={() => history.goBack()}>返回</Button>
            ]}>
            <DetailTitle title="员工离职管理"/>
            <BaseInfo columns={baseInfoData} dataSource={detailData || {}} col={2}/>
            <DetailTitle title="审批记录" />
            <CommonTable columns={tableColumns} dataSource={detailData?.statusRecordList} pagination={ false } />
            </DetailContent>
        </Spin>
    </>
}