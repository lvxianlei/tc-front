import React from "react"
import { Button, Spin } from 'antd'
import { useHistory, useParams } from 'react-router-dom'
import { DetailContent, DetailTitle, BaseInfo, CommonTable, Attachment } from '../../common'
import { paymentList, paymentdetail } from "./payment.json"
import { auditIdRecord } from "../../approval-mngt/approvalHeadData.json"
import useRequest from '@ahooksjs/use-request'
import RequestUtil from '../../../utils/RequestUtil'
import { costTypeOptions } from "../../../configuration/DictionaryOptions"

export default function Edit() {
    const history = useHistory()
    const params = useParams<{ id: string }>()
    const costTypeOption = costTypeOptions?.map((item)=>{
         return{
             label:item.name,
             value:item.id
         }
    })
    console.log(costTypeOption)
    
    const { loading, data } = useRequest<{ [key: string]: any }>(() => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(`/tower-market/payApply/${params.id}`)
            resole(result)
        } catch (error) {
            reject(error)
        }
    }))

    return <DetailContent operation={[
        <Button key="cancel" onClick={() => history.go(-1)}>返回</Button>
    ]}>
        <Spin spinning={loading}>
            <DetailTitle title="请款单信息" />
            <BaseInfo columns={paymentList.map((item: any) => {
                if (item.dataIndex === "costType") {
                    return ({
                        ...item,
                        enum: costTypeOption
                    })
                }
                return item
            })} dataSource={(data as any) || {}} />
            <DetailTitle title={data?.payType === 0 ? "请款明细" : "报销明细"} />
            <CommonTable columns={[
                ...paymentdetail,
                ...(data?.payType === 1 ? [
                    {
                        "title": "发票号",
                        "dataIndex": "invoiceNo"
                    },
                    {
                        "title": "发票时间",
                        "dataIndex": "invoiceTime",
                        "type": "date",
                        "format": "YYYY-MM-DD"
                    },
                ] as any : [])
            ]} dataSource={data?.payInfoVOList || []} />
            <Attachment dataSource={data?.attachVos || []} />
            <DetailTitle title="审批记录" />
            <CommonTable haveIndex columns={auditIdRecord} dataSource={data?.payInfoVOList || []} />
        </Spin>
    </DetailContent>
}