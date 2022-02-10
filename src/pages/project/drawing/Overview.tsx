import React from "react"
import { Spin } from 'antd'
import { BaseInfo, Attachment } from '../../common'
import useRequest from '@ahooksjs/use-request'
import RequestUtil from '../../../utils/RequestUtil'
import { setting } from "./drawing.json"
interface OverviewProps {
    id: string
}
export default function Overview({ id }: OverviewProps) {
    const { loading, data } = useRequest<{ [key: string]: any }>(() => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(`/tower-market/drawingConfirmation/${id}`)
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { refreshDeps: [id] })

    return <Spin spinning={loading}>
        <BaseInfo columns={setting} col={2} dataSource={data || {}} />
        <Attachment title="附件" dataSource={data?.fileSources || []} />
    </Spin>
}