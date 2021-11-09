import React from "react"
import { Spin } from "antd"
import { DetailContent, DetailTitle, CommonTable } from '../../common'
import useRequest from '@ahooksjs/use-request'
import RequestUtil from '../../../utils/RequestUtil'
interface OverviewProps {
    id: string
}
export default function Overview({ id }: OverviewProps): JSX.Element {
    const { loading, data } = useRequest<{ [key: string]: any }>(() => new Promise(async (resole, reject) => {
        try {
            const result: any[] = await RequestUtil.get(`/tower-supply/purchaseBatchingScheme/batcher/${id}`)
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { refreshDeps: [id] })

    return <Spin spinning={loading}>
        <CommonTable haveIndex columns={data?.headerColumnVos || []} dataSource={data?.schemeData || []} />
    </Spin>
}