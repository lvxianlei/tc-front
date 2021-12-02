import React from "react"
import { Spin } from 'antd'
import { DetailTitle, BaseInfo, Attachment } from '../../common'
import { billinformation } from "../financialData.json"
import useRequest from '@ahooksjs/use-request'
import RequestUtil from '../../../utils/RequestUtil'
import ApplicationContext from "../../../configuration/ApplicationContext"
interface OverviewProps {
    id: string
}
export default function Overview({ id }: OverviewProps) {
    const invoiceTypeEnum = (ApplicationContext.get().dictionaryOption as any)["1210"].map((item: { id: string, name: string }) => ({
        value: item.id,
        label: item.name
    }))
    const { loading, data } = useRequest<{ [key: string]: any }>(() => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(`/tower-supply/invoice/${id}`)
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { refreshDeps: [id] })

    return <Spin spinning={loading}>
        <DetailTitle title="票据信息" />
        <BaseInfo columns={billinformation.map((item: any) => {
            if (item.dataIndex === "invoiceType") {
                return ({ ...item, type: "select", enum: invoiceTypeEnum })
            }
            return item
        })} dataSource={data || {}} />
        <Attachment dataSource={data?.invoiceAttachInfoVos || []} />
    </Spin>
}