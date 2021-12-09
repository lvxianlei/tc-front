import React from "react"
import { Spin } from "antd"
import { CommonTable } from '../../common'
import useRequest from '@ahooksjs/use-request'
import RequestUtil from '../../../utils/RequestUtil'
import { baseInfo, SeeList } from './TaskTower.json';
interface OverviewProps {
    id: string
}
export default function Overview({ id }: OverviewProps): JSX.Element {
    const { loading, data } = useRequest<{ [key: string]: any }>(() => new Promise(async (resole, reject) => {
        try {
            // const result: any[] = await RequestUtil.get(`/tower-supply/purchaseBatchingScheme/batcher/${id}`)
            // resole(result)
        } catch (error) {
            reject(error)
        }
    }), { refreshDeps: [id] })

    return (
        <Spin spinning={false}>
            <CommonTable
                columns={baseInfo}
                dataSource={[]}
                onRow={ (record: Record<string, any>, index: number) => {
                    console.log("点击一行")
                }}
            />
            <CommonTable haveIndex columns={SeeList} dataSource={[]} />
        </Spin>
    )
}