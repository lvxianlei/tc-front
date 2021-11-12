import React, { useState } from "react"
import { Spin } from 'antd'
import { DetailTitle, BaseInfo, CommonTable, Attachment } from '../../common'
import { ApplicationOverview, operationInfo } from "../financialData.json"
import useRequest from '@ahooksjs/use-request'
import RequestUtil from '../../../utils/RequestUtil'
import ApplicationContext from "../../../configuration/ApplicationContext"
interface OverviewProps {
    id: string
}
export default function Overview({ id }: OverviewProps): JSX.Element {
    const pleasePayTypeEnum = (ApplicationContext.get().dictionaryOption as any)["1212"].map((item: { id: string, name: string }) => ({
        value: item.id,
        label: item.name
    }))
    const paymentMethodEnum = (ApplicationContext.get().dictionaryOption as any)["1211"].map((item: { id: string, name: string }) => ({
        value: item.id,
        label: item.name
    }))
    const { loading, data } = useRequest<{ [key: string]: any }>(() => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(`/tower-supply/applyPayment/${id}`)
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { refreshDeps: [id] })

    return <Spin spinning={loading}>
        <DetailTitle title="申请信息" />
        <BaseInfo columns={ApplicationOverview.map((item: any) => {
            if (item.dataIndex === "pleasePayType") {
                return ({ ...item, type: "select", enum: pleasePayTypeEnum })
            }
            if (item.dataIndex === "paymentMethod") {
                return ({ ...item, type: "select", enum: paymentMethodEnum })
            }
            return item
        })} dataSource={data || {}} />
        <Attachment title="回执单" dataSource={data?.applyPaymentAttachInfoVos || []} />
        <DetailTitle title="审批信息" />
        <CommonTable columns={operationInfo} dataSource={[]} />
        <DetailTitle title="操作信息" />
        <CommonTable columns={operationInfo} dataSource={[]} />
    </Spin>
}