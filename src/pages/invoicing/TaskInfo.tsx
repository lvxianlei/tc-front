import React from "react"
import { Button, message, Spin } from 'antd'
import { useHistory, useParams } from 'react-router-dom'
import { DetailContent, DetailTitle, BaseInfo, CommonTable, Attachment } from '../common'
import { baseInfoHead, invoiceHead, billingHead, batchHead } from "../project/Invoicing/InvoicingData.json"
import useRequest from '@ahooksjs/use-request'
import RequestUtil from '../../utils/RequestUtil'
import ApplicationContext from "../../configuration/ApplicationContext"
export default function Edit() {
    const history = useHistory()
    const params = useParams<{ invoicing: string }>()
    const productType: any = (ApplicationContext.get().dictionaryOption as any)["101"]
    const { loading, data } = useRequest<{ [key: string]: any }>(() => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(`/tower-market/invoicing/getInvoicingInfo/${params.invoicing}`)
            resole(result)
        } catch (error) {
            reject(error)
        }
    }))
    const { loading: approvalLoading, run } = useRequest<{ [key: string]: any }>((data: any) => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.post(`/tower-market/invoicing/approval`, { ...data, invoicingId: params.invoicing })
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    return <DetailContent operation={[<Button key="cancel" onClick={() => history.go(-1)}>返回</Button>]}>
        <Spin spinning={loading}>
            <DetailTitle title="基本信息" />
            <BaseInfo columns={baseInfoHead.map((item: any) => {
                if (item.dataIndex === "productTypeId") {
                    return ({
                        ...item,
                        enum: productType.map((product: any) => ({
                            value: product.id,
                            label: product.name
                        }))
                    })
                }
                return item
            })} dataSource={data || {}} />

            <DetailTitle title="发票信息" />
            <BaseInfo columns={invoiceHead} dataSource={data?.invoicingInfoVo || []} />

            <DetailTitle title="开票明细" />
            <CommonTable columns={billingHead} dataSource={data?.invoicingDetailVos || []} />
            <Attachment dataSource={data?.attachInfoVos} />
        </Spin>
    </DetailContent>
}