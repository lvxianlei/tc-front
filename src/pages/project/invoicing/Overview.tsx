import React, { useState } from "react"
import { Button, message, Radio, Spin } from 'antd'
import { useHistory, useParams } from 'react-router-dom'
import { DetailContent, DetailTitle, BaseInfo, CommonTable, Attachment } from '../../common'
import { baseInfoHead, invoiceHeadDetail, billingHeadOverView, batchHead, saleInvoiceOverView, invoicingStatistics } from "./InvoicingData.json"
import useRequest from '@ahooksjs/use-request'
import RequestUtil from '../../../utils/RequestUtil'
import { contractPlanStatusOptions, currencyTypeOptions, productTypeOptions } from "../../../configuration/DictionaryOptions"
export default function Edit() {
    const history = useHistory()
    const params = useParams<{ id: string, processId: string }>()
    const productType: any = productTypeOptions
    const [tab, setTab] = useState<string>("a")
    const handleRadioChange = (e: any) => {
        setTab(e.target.value)
    }
    const { loading, data } = useRequest<{ [key: string]: any }>(() => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(`/tower-market/invoicing/getInvoicingInfo?id=${params.id}`)
            /**获取工作流流转记录 */
            const process: { [key: string]: any } = params.processId !== "null" ? await RequestUtil.get(`/tower-workflow/workflow/Engine/FlowBefore/${params.processId}`) : {}
            resole({
                ...result,
                invoicingBatchVOS: process?.flowTaskOperatorRecordList || []
            })
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
                // 开票货币类型
                if (item.dataIndex === "currencyType") {
                    return {
                        ...item,
                        enum: currencyTypeOptions?.map((product: any) => ({
                            value: product.id,
                            label: product.name
                        }))
                    }
                }
                if (item.dataIndex === "voltage") {
                    return ({
                        ...item,
                        type: "string"
                    })
                }
                if (item.dataIndex === "contractType") {
                    return ({
                        ...item,
                        enum: contractPlanStatusOptions?.map(item => ({
                            value: item.id,
                            label: item.name
                        }))
                    })
                }
                return item
            })} dataSource={data || {}} />

            <DetailTitle title="发票信息" />
            <BaseInfo columns={invoiceHeadDetail} dataSource={data?.invoicingInfoVo || []} />

            <Radio.Group value={tab} onChange={handleRadioChange} style={{ margin: "12px 0" }}>
                <Radio.Button value="a">开票明细</Radio.Button>
                <Radio.Button value="b">累计开票</Radio.Button>
                <Radio.Button value="c">销售发票</Radio.Button>
            </Radio.Group>
            {
                tab === "a" ? <CommonTable columns={billingHeadOverView} dataSource={data?.invoicingDetailVos || []} /> :
                    tab === "b" ? <CommonTable columns={invoicingStatistics} dataSource={data?.invoicingStatisticsVOS || []} /> :
                        tab === "c" ? <CommonTable columns={saleInvoiceOverView} dataSource={data?.invoicingSaleVOS || []} /> : <></>
            }


            <Attachment dataSource={data?.attachInfoVos} />

            <DetailTitle title="审批记录" />
            <CommonTable columns={batchHead} dataSource={data?.invoicingBatchVos || []} />
        </DetailContent>
    </Spin>
}