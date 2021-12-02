import React from 'react'
import { Button, Spin, Space} from 'antd';
import { useHistory, useParams } from 'react-router-dom';
import { DetailContent, CommonTable, DetailTitle, BaseInfo, Attachment } from '../../common';
import useRequest from '@ahooksjs/use-request';
import { baseInfoData } from './labour.json';
import RequestUtil from '../../../utils/RequestUtil';


export default function Detail(): React.ReactNode {
    const history = useHistory()
    const params = useParams<{ id: string, contractId: string }>()
    const { loading, data } = useRequest(() => new Promise(async (resole, reject) => {
        // const data: any = await RequestUtil.get(`/tower-hr/labor/contract/detail`,{contractId: params.contractId})
        resole(data)
    }), {})
    const detailData: any = data;
    return <>
        <Spin spinning={loading}>
            <DetailContent operation={[
                <Button key="goback" onClick={() => history.goBack()}>返回</Button>
            ]}>
            <DetailTitle title="员工劳务合同"/>
            <BaseInfo columns={baseInfoData} dataSource={detailData || {}} col={2}/>
            <Attachment dataSource={detailData.fileVos}/>
            </DetailContent>
        </Spin>
    </>
}