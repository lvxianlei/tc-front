import React from "react"
import { Button, message, Spin } from 'antd'
import { useHistory } from 'react-router-dom'
import { DetailTitle, CommonTable, BaseInfo } from '../../common'
import { billinformation } from "../financialData.json"
import useRequest from '@ahooksjs/use-request'
import RequestUtil from '../../../utils/RequestUtil'
import { downLoadFile } from "../../../utils"
interface OverviewProps {
    id: string
}
export default function Overview({ id }: OverviewProps) {
    const history = useHistory()
    const { loading, data } = useRequest<{ [key: string]: any }>(() => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(`/tower-supply/invoice/${id}`)
            resole(result)
        } catch (error) {
            reject(error)
        }
    }))

    return <Spin spinning={loading}>
        <DetailTitle title="票据信息" />
        <BaseInfo columns={billinformation} dataSource={data || {}} />
        <DetailTitle title="相关附件" />
        <CommonTable columns={[]} dataSource={[]} />
        <DetailTitle title="操作信息" />
        <CommonTable columns={[]} dataSource={[]} />
    </Spin>
}