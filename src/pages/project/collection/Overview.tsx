import React from "react"
import { Button, Spin } from 'antd'
import { useHistory, useParams } from 'react-router-dom'
import { DetailContent, DetailTitle, BaseInfo, CommonTable } from '../../common'
import { promotionalTourism, contractInformationDetail } from "./collection.json"
import useRequest from '@ahooksjs/use-request'
import RequestUtil from '../../../utils/RequestUtil'
export default function Overview() {
    const history = useHistory()
    const params = useParams<{ id: string }>()

    const { loading, data } = useRequest<{ [key: string]: any }>(() => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(`/tower-market/backMoney/${params.id}`)
            resole(result)
        } catch (error) {
            reject(error)
        }
    }))

    return <DetailContent operation={[<Button key="cancel" onClick={() => history.go(-1)}>返回</Button>]}>
        <Spin spinning={loading}>
            <DetailTitle title="基本信息" />
            <BaseInfo columns={data?.returnType === 1172 ? promotionalTourism.filter(item => item.dataIndex !== "payNum") : promotionalTourism} dataSource={data || {}} />
            {data?.returnType === 1172 && <>
                <DetailTitle title="合同信息" />
                <CommonTable columns={contractInformationDetail} dataSource={data?.backMoneyVOList || []} />
            </>}
        </Spin>
    </DetailContent>
}