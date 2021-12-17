import React from "react"
import { Spin } from 'antd'
import { DetailTitle, BaseInfo, Attachment, CommonTable } from '../../common'
import { billinformation, billOperationInfo } from "../financialData.json"
import useRequest from '@ahooksjs/use-request'
import RequestUtil from '../../../utils/RequestUtil'
import { invoiceTypeOptions } from "../../../configuration/DictionaryOptions"
interface OverviewProps {
    id: string
}
export default function Overview({ id }: OverviewProps) {
    const invoiceTypeEnum = invoiceTypeOptions?.map((item: { id: string, name: string }) => ({
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
        })} col={2} dataSource={data || {}} />
        <Attachment dataSource={data?.invoiceAttachInfoVos || []} />
        <DetailTitle title="操作信息" />
        <CommonTable columns={billOperationInfo} dataSource={data?.operationRecordInfoVos || []} />
    </Spin>
}