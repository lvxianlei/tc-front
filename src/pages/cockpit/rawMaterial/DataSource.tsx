import React from "react"
import { CommonTable } from "../../common"
import { dataSource } from "./rawMaterial.json"
import useRequest from '@ahooksjs/use-request'
import RequestUtil from '../../../utils/RequestUtil'
interface DataSourceProps {
    id: string
}
export default function DataSource({ id }: DataSourceProps): JSX.Element {

    const { loading, data } = useRequest<any[]>(() => new Promise(async (resove, reject) => {
        try {
            const result: any[] = await RequestUtil.get(`/tower-supply/materialPrice/priceSource/${id}`)
            resove(result)
        } catch (error) {
            reject(error)
        }
    }))

    return <CommonTable loading={loading} columns={dataSource} dataSource={data || []} />
}