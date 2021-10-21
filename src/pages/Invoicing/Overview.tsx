import React from "react"
import { Button, Spin } from 'antd'
import { useHistory, useParams } from 'react-router-dom'
import { DetailContent, DetailTitle, BaseInfo, CommonTable } from '../common'
import { baseInfoHead, invoiceHead, billingHead, batchHead } from "./InvoicingData.json"
import { enclosure } from '../project/managementDetailData.json'
import useRequest from '@ahooksjs/use-request'
import RequestUtil from '../../utils/RequestUtil'
import { downLoadFile } from "../../utils"
export default function Edit() {
    const history = useHistory()
    const params = useParams<{ id: string }>()

    const { loading, data } = useRequest<{ [key: string]: any }>(() => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(`/tower-market/invoicing/getInvoicingInfo/${params.id}`)
            resole(result)
        } catch (error) {
            reject(error)
        }
    }))

    return <DetailContent title={[
        <Button type="primary" key="ab">发起审批</Button>
    ]} operation={[
        <Button key="cancel" onClick={() => history.go(-1)}>返回</Button>
    ]}>
        <Spin spinning={loading}>
            <DetailTitle title="基本信息" />
            <BaseInfo columns={baseInfoHead} dataSource={data || {}} />

            <DetailTitle title="发票信息" />
            <BaseInfo columns={invoiceHead} dataSource={data?.invoicingInfoVo || []} />

            <DetailTitle title="开票明细" />

            <CommonTable columns={billingHead} dataSource={data?.invoicingDetailVos || []} />

            <DetailTitle title="附件" />

            <CommonTable columns={[{
                title: "操作", dataIndex: "opration",
                render: (_: any, record: any) => (<>
                    <Button type="link" onClick={() => downLoadFile(record.link || record.filePath)}>下载</Button>
                </>)
            }, ...enclosure]} dataSource={data?.attachInfoVos || []} />

            <DetailTitle title="审批记录" />

            <CommonTable columns={batchHead} dataSource={data?.invoicingBatchVos || []} />
        </Spin>
    </DetailContent>
}