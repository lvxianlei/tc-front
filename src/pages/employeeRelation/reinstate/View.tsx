import React from 'react'
import { Button, Spin, Space} from 'antd';
import { useHistory, useParams } from 'react-router-dom';
import { DetailContent, CommonTable, DetailTitle, BaseInfo } from '../../common';
import useRequest from '@ahooksjs/use-request';
import { baseInfoData } from './reinstate.json';
import RequestUtil from '../../../utils/RequestUtil';

const tableColumns = [
    { 
        title: '序号', 
        dataIndex: 'index', 
        key: 'index',
        render: (_a: any, _b: any, index: number): React.ReactNode => (
            <span>{index + 1}</span>
        ) 
    },
    { 
        title: '审批人', 
        dataIndex: 'approverName', 
        key: 'approverName', 
    },
    { 
        title: '审批时间', 
        dataIndex: 'approveDate', 
        key: 'approveDate' 
    },
    { 
        title: '审批结果', 
        dataIndex: 'approveResult', 
        key: 'approveResult' 
    },
    { 
        title: '审批意见', 
        dataIndex: 'approveOpinion', 
        key: 'approveOpinion'
    }
]
export default function View(): React.ReactNode {
    const history = useHistory()
    const params = useParams<{ id: string }>()
    const { loading, data } = useRequest(() => new Promise(async (resole, reject) => {
        const data: any = await RequestUtil.get(`/tower-hr/employeeReinstatement/detail?id=${params.id}`)
        data.newDepartmentName=data.departmentId!=='0'?data.departmentName+'/'+data.teamName:data.teamName
        resole(data)
    }), {})
    const detailData: any = data;
    return <>
        <Spin spinning={loading}>
            <DetailContent operation={[
                <Button key="goback" onClick={() => history.goBack()}>返回</Button>
            ]}>
            <DetailTitle title="员工复职信息"/>
            <BaseInfo columns={baseInfoData} dataSource={detailData || {}} col={2}/>
            {detailData?.approveLog.length>0&&<DetailTitle title="审批记录" />}
            {detailData?.approveLog.length>0&&<CommonTable columns={tableColumns} dataSource={detailData?.approveLog} pagination={ false } />}
            </DetailContent>
        </Spin>
    </>
}