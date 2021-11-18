/*
 * @Descripttion: 
 * @version: 
 * @Author: wangxindong
 * @email: wxd93917787@163.com
 * @Date: 2021-11-12 13:56:51
 * @LastEditors: wangxindong
 * @LastEditTime: 2021-11-17 18:36:04
 */
import React from "react"
import { Button, message, Spin } from 'antd'
import { useHistory, useParams } from 'react-router-dom'
import { DetailContent, DetailTitle, BaseInfo, CommonTable,Attachment } from '../common'
import { baseInfoHead, invoiceHead, billingHead, batchHead } from "./InvoicingData.json"
import { enclosure } from '../project/managementDetailData.json'
import useRequest from '@ahooksjs/use-request'
import RequestUtil from '../../utils/RequestUtil'
import { downLoadFile } from "../../utils"
import ApplicationContext from "../../configuration/ApplicationContext"
export default function Edit() {
    const history = useHistory()
    const params = useParams<{ id: string }>()
    const productType: any = (ApplicationContext.get().dictionaryOption as any)["101"]
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

    return <DetailContent title={[
        <Button type="primary" key="ab" onClick={handleApproval} loading={approvalLoading}>发起审批</Button>
    ]} operation={[<Button key="cancel" onClick={() => history.go(-1)}>返回</Button>]}>
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
            <Attachment showHeader columns={[...enclosure]}  dataSource={data?.attachInfoVos || []} />
            <DetailTitle title="审批记录" />
            <CommonTable columns={batchHead} dataSource={data?.invoicingBatchVos || []} />
        </Spin>
    </DetailContent>
}