import React from "react"
import { Button, message, Spin } from 'antd'
import { useHistory, useParams } from 'react-router-dom'
import { DetailContent, DetailTitle, BaseInfo, CommonTable, Attachment } from '../../common'
import { baseInfoHead, invoiceHead, billingHead, batchHead } from "./InvoicingData.json"
import useRequest from '@ahooksjs/use-request'
import RequestUtil from '../../../utils/RequestUtil'
import { productTypeOptions } from "../../../configuration/DictionaryOptions"
export default function Edit() {
    const history = useHistory()
    const params = useParams<{ id: string }>()
    const productType: any = productTypeOptions
    const { loading, data } = useRequest<{ [key: string]: any }>(() => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(`/tower-market/invoicing/getInvoicingInfo/${params.id}`)
            resole(result)
        } catch (error) {
            reject(error)
        }
    }))
    const { loading: approvalLoading, run } = useRequest<{ [key: string]: any }>((data: any) => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.post(`/tower-market/invoicing/approval`, { ...data, invoicingId: params.id })
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    const handleApproval = async () => {
        try {
            const result = await run({
                approver: data?.approver,
                batchResult: data?.batchResult,
                batchTime: data?.batchTime,
                department: data?.department,
                opinion: data?.opinion,
                position: data?.position
            })
            message.success("已成功发起审批")
        } catch (err0r) {
            message.error("发起审批失败...")
        }
    }

    return <Spin spinning={loading}>
        <DetailContent operation={[
            <Button type="primary" key="ab" onClick={handleApproval} loading={approvalLoading}>发起审批</Button>,
            <Button key="cancel" onClick={() => history.go(-1)} style={{ marginLeft: 12 }}>返回</Button>
        ]}>

            <DetailTitle title="基本信息" />
            <BaseInfo columns={baseInfoHead.map((item: any) => {
                if (item.dataIndex === "productTypeId") {
                    return ({
                        ...item,
                        enum: productType?.map((product: any) => ({
                            value: product.id,
                            label: product.name
                        }))
                    })
                }
                if (item.dataIndex === "voltage") {
                    return ({
                        ...item,
                        type: "string"
                    })
                }
                return item
            })} dataSource={data || {}} />

            <DetailTitle title="发票信息" />
            <BaseInfo columns={invoiceHead} dataSource={data?.invoicingInfoVo || []} />

            <DetailTitle title="开票明细" />
            <CommonTable columns={billingHead} dataSource={data?.invoicingDetailVos || []} />
            <Attachment dataSource={data?.attachInfoVos} />
            <DetailTitle title="审批记录" />
            <CommonTable columns={batchHead} dataSource={data?.invoicingBatchVos || []} />
        </DetailContent>
    </Spin>
}