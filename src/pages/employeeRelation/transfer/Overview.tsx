import React from "react"
import { Button, Spin } from 'antd'
import { useHistory, useParams } from 'react-router-dom'
import { DetailContent, DetailTitle, BaseInfo, CommonTable, Attachment } from '../../common'
import { setting, auditRecords } from "./transfer.json"
import useRequest from '@ahooksjs/use-request'
import RequestUtil from '../../../utils/RequestUtil'
export default function Overview() {
    const history = useHistory()
    const params = useParams<{ transferId: string }>()
    const { loading, data } = useRequest<{ [key: string]: any }>(() => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(`/tower-hr/employeeTransfer/detail?id=${params.transferId}`)
            resole(result)
        } catch (error) {
            reject(error)
        }
    }))
    return <DetailContent operation={[<Button key="cancel" onClick={() => history.go(-1)}>返回</Button>]}>
        <Spin spinning={loading}>
            <DetailTitle title="员工调动管理" />
            <BaseInfo columns={setting} dataSource={data || {}} />
            <Attachment dataSource={data?.fileVos} />
            <DetailTitle title="审批记录" />
            <CommonTable columns={auditRecords} dataSource={[]} />
        </Spin>
    </DetailContent>
}