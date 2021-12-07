import React from 'react'
import { Button, Spin, Space} from 'antd';
import { useHistory, useParams } from 'react-router-dom';
import { DetailContent, CommonTable, DetailTitle, Attachment, BaseInfo } from '../../common';
import useRequest from '@ahooksjs/use-request';
import { baseInfoData, quitInfoData } from './quit.json';
import RequestUtil from '../../../utils/RequestUtil';
import TextArea from 'antd/lib/input/TextArea';


export default function QuitProceduresView(): React.ReactNode {
    const history = useHistory()
    const params = useParams<{ id: string }>()
    const { loading, data } = useRequest(() => new Promise(async (resole, reject) => {
        const data: any = await RequestUtil.get(`/tower-hr/employeeDeparture/detail?id=${params.id}`)
        data.isRemoveContract = data.isRemoveContract?0:1;
        data.isTransactProcedure = data.isTransactProcedure?0:1
        data.newDepartmentName = data.departmentName+'/'+data.teamName
        resole(data)
    }), {})
    const detailData: any = data;
    return <>
        <Spin spinning={loading}>
            <DetailContent operation={[
                <Button key="goback" onClick={() => history.goBack()}>返回</Button>
            ]}>
            <DetailTitle title="员工离职信息"/>
            <BaseInfo columns={baseInfoData} dataSource={detailData || {}} col={2}/>
            <DetailTitle title="办理离职信息"/>
            <BaseInfo columns={quitInfoData} dataSource={detailData || {}} col={2}/>
            <Attachment dataSource={detailData?.fileVos}/>
            </DetailContent>
        </Spin>
    </>
}