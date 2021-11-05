import React from "react"
import { Button, message, Spin } from 'antd'
import { useHistory, useParams } from 'react-router-dom'
import { DetailContent, DetailTitle, BaseInfo, CommonTable } from '../../common'
import { operationInformation } from "./shortageListData.json"
import useRequest from '@ahooksjs/use-request'
import RequestUtil from '../../../utils/RequestUtil'
interface OverviewProps {
    id: string
}
export default function Overview({ id }: OverviewProps) {
    const history = useHistory()
    const { loading, data } = useRequest<any[]>(() => new Promise(async (resole, reject) => {
        try {
            const result: any[] = await RequestUtil.get(`/tower-market/invoicing/getInvoicingInfo/${id}`)
            resole(result)
        } catch (error) {
            reject(error)
        }
    }))

    return <CommonTable loading={loading} columns={operationInformation} dataSource={data || []} />
}