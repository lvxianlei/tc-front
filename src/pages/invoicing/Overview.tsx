import React from "react"
import { Button, Spin } from 'antd'
import { useHistory, useParams } from 'react-router-dom'
import { DetailContent, DetailTitle, BaseInfo, Attachment, CommonTable } from '../common'
import { baseInfoHead, invoiceHead, billingHeader, saleInvoiceDetail, transferHead } from "./InvoicingData.json"
import useRequest from '@ahooksjs/use-request'
import RequestUtil from '../../utils/RequestUtil'
import { productTypeOptions } from "../../configuration/DictionaryOptions"
export default function Overview() {
    const history = useHistory()
    const params = useParams<{ invoicingId: string }>()
    const productType: any = productTypeOptions
    const { loading, data } = useRequest<{ [key: string]: any }>(() => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(`/tower-finance/invoicing/getTaskInfo/${params.invoicingId}`)
            resole(result)
        } catch (error) {
            reject(error)
        }
    }))

    return <DetailContent
        operation={[
            <Button key="cancel" onClick={() => history.go(-1)}>返回</Button>
        ]}>
        <Spin spinning={loading}>
            <DetailTitle title="基本信息" />
            <BaseInfo columns={baseInfoHead.map((item: any) => {
                if (item.dataIndex === "productTypeId") {
                    return ({
                        ...item,
                        type: "select",
                        enum: productType.map((product: any) => ({
                            value: product.id,
                            label: product.name
                        }))
                    })
                }
                if (item.dataIndex === "weigh") {
                    if (parseFloat(data?.weigh) > parseFloat(data?.reasonWeight)) {
                        return ({ ...item, contentStyle: { backgroundColor: "red" } })
                    }
                    return item
                }
                return item
            })} dataSource={data || {}} />

            <DetailTitle title="发票信息" />
            <BaseInfo columns={invoiceHead} dataSource={data?.invoicingInfoVo || []} />

            <DetailTitle title="开票明细" />
            <CommonTable columns={billingHeader} dataSource={data?.invoicingDetailVos || []} />

            <DetailTitle title="移交信息" />
            <BaseInfo
                columns={transferHead}
                dataSource={data || {}} />

            <DetailTitle title="销售发票" />
            <CommonTable
                columns={saleInvoiceDetail}
                dataSource={data?.invoicingSaleVos} />

            <Attachment dataSource={data?.attachInfoVos} />
        </Spin>
    </DetailContent>
}