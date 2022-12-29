import React from "react"
import { useParams } from "react-router-dom"
import { Spin } from 'antd'
import { BaseInfo, Attachment, CommonTable, DetailTitle } from '../../common'
import useRequest from '@ahooksjs/use-request'
import RequestUtil from '../../../utils/RequestUtil'
import { setting } from "./drawing.json"
import { productGroupDetail } from "./drawing.json"
interface OverviewProps {
    id: string
}
export default function Overview() {
    const { id } = useParams<{ id: string }>()
    const { loading, data } = useRequest<{ [key: string]: any }>(() => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(`/tower-market/drawingConfirmation/${id}`)
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { refreshDeps: [id] })
    const { loading: tableLoading, data: tableDataSource } = useRequest<any>(() => new Promise(async (resole, reject) => {
        const data: any = await RequestUtil.get(`/tower-market/drawingConfirmation/getDrawingAssist?id=${id}`)
        resole(data);
    }))

    return <Spin spinning={loading}>
        <BaseInfo columns={setting} col={2} dataSource={data || {}} />
        <DetailTitle title="杆塔明细" />
        <CommonTable
            loading={tableLoading}
            columns={productGroupDetail}
            rowKey="id"
            dataSource={tableDataSource?.records || []}
            pagination={false} />
        <Attachment title="附件" dataSource={data?.fileSources || []} />
    </Spin>
}