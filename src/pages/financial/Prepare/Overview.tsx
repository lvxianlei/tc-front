import React from "react"
import { Button, message, Spin } from 'antd'
import { DetailTitle, BaseInfo, CommonTable } from '../../common'
import { ApplicationList, operationInfo } from "../financialData.json"
import useRequest from '@ahooksjs/use-request'
import RequestUtil from '../../../utils/RequestUtil'
import { downLoadFile } from "../../../utils"
interface OverviewProps {
    id: string
}
export default function Overview({ id }: OverviewProps): JSX.Element {
    const { loading, data } = useRequest<{ [key: string]: any }>(() => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(`/tower-supply/applyPayment/${id}`)
            resole(result)
        } catch (error) {
            reject(error)
        }
    }))

    return <Spin spinning={loading}>
        <DetailTitle title="申请信息" />
        <BaseInfo columns={ApplicationList} dataSource={data || {}} />
        <DetailTitle title="审批信息" />
        <CommonTable columns={operationInfo} dataSource={[]} />
        <DetailTitle title="操作信息" />
        <CommonTable columns={operationInfo} dataSource={[]} />
    </Spin>
}