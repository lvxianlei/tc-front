import React from "react"
import { Spin } from "antd"
import { CommonTable } from '../../common'
import useRequest from '@ahooksjs/use-request'
import RequestUtil from '../../../utils/RequestUtil'
import { baseInfo } from './TaskTower.json';
interface OverviewProps {
    id: string
}
export default function Overview({ id }: OverviewProps): JSX.Element {
    // 配料方案
    const { loading, data } = useRequest<{ [key: string]: any }>(() => new Promise(async (resole, reject) => {
        try {
            const result: any[] = await RequestUtil.get(`/tower-supply/purchaseBatchingScheme/batcher/statistics/${id}`)
            resole(result)
            // 默认掉用第一条
            if (result.length > 0) {
                getUser(result[0].schemeIds)
            }
        } catch (error) {
            reject(error)
        }
    }), { refreshDeps: [id] })

    // 方案明细
    const { run: getUser, data: userData } = useRequest<{ [key: string]: any }>((schemeIds: string) => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(`/tower-supply/purchaseBatchingScheme/batcher/info/${schemeIds}`)
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    return (
        <Spin spinning={loading}>
            <CommonTable
                columns={baseInfo}
                dataSource={(data as any) || []}
                onRow={(record: any) => {
                    return {
                      onClick: async (event: any) => {
                          getUser(record.schemeIds)
                      }, // 点击行
                    };
                }}
            />
            <CommonTable haveIndex columns={userData?.headerColumnVos || []} dataSource={userData?.schemeData || []} />
        </Spin>
    )
}