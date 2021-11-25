import React from "react"
import { Button, message, Spin } from 'antd'
import { useHistory, useParams } from 'react-router-dom'
import { DetailContent, DetailTitle, BaseInfo, CommonTable, Attachment } from '../common'
import { invoicingInfoHead, billingHead } from "./InvoicingData.json"
import useRequest from '@ahooksjs/use-request'
import RequestUtil from '../../utils/RequestUtil'
import ApplicationContext from "../../configuration/ApplicationContext"
export default function Edit() {
    const history = useHistory()
    const params = useParams<{ invoicingId: string }>()
    const productType: any = (ApplicationContext.get().dictionaryOption as any)["101"]
    const { loading, data } = useRequest<{ [key: string]: any }>(() => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(`/tower-finance/invoicing/getInvoicingInfo/${params.invoicingId}`)
            resole(result)
        } catch (error) {
            reject(error)
        }
    }))
    return <DetailContent operation={[<Button key="cancel" onClick={() => history.go(-1)}>返回</Button>]}>
        <Spin spinning={loading}>
            <DetailTitle title="开票信息" />
            <BaseInfo columns={invoicingInfoHead.map((item: any) => {
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
            <DetailTitle title="开票明细" />
            <CommonTable columns={billingHead} dataSource={data?.invoicingDetailVos || []} />
            <Attachment dataSource={data?.attachInfoVos} />
        </Spin>
    </DetailContent>
}