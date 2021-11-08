import React from "react"
import { CommonTable } from "../../common"
import { message, Result } from "antd"
import { operation } from "./enquiry.json"
import useRequest from '@ahooksjs/use-request'
import RequestUtil from '../../../utils/RequestUtil'

interface OpreationProps {
    id: string
}

export default function Opreation({ id }: OpreationProps): JSX.Element {

    const { loading, data } = useRequest<any[]>(() => new Promise(async (resole, reject) => {
        try {
            // const result: any[] = await RequestUtil.get(``)
            // message.warning("服务端暂未开发...")
            resole([])
        } catch (error) {
            reject(error)
        }
    }), { refreshDeps: [id] })
    if (data?.length === 0) {
        return <Result title="功能假设中..." status="500" />
    }
    return <CommonTable loading={loading} columns={operation} dataSource={data || []} />
}