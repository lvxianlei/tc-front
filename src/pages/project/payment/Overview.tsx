import React from "react"
import { Button, Spin } from 'antd'
import { useHistory, useParams } from 'react-router-dom'
import { DetailContent, DetailTitle, BaseInfo, CommonTable, Attachment } from '../../common'
import { paymentList, paymentdetail, auditIdRecord } from "./payment.json"
import useRequest from '@ahooksjs/use-request'
import RequestUtil from '../../../utils/RequestUtil'

export default function Edit() {
    const history = useHistory()
    const params = useParams<{ id: string }>()

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
            <BaseInfo columns={paymentList} dataSource={(data as any) || {}} />
            <DetailTitle title="请款明细" />
            <CommonTable columns={paymentdetail} dataSource={data?.payInfoVOList || []} />
            <Attachment dataSource={data?.attachVos || []} />
            <DetailTitle title="审批记录" />
            <CommonTable haveIndex columns={auditIdRecord} dataSource={data?.approveRecordVOList || []} />
        </Spin>
    </DetailContent>
}