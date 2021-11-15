import React from "react"
import { CommonTable } from '../../common'
import { BatchingScheme } from "./productionData.json"
import RequestUtil from '../../../utils/RequestUtil'
import useRequest from '@ahooksjs/use-request'
interface EditProps {
    id: string
}
export default function Edit({ id }: EditProps): JSX.Element {
    const { loading, data } = useRequest<any[]>(() => new Promise(async (resole, reject) => {
        try {
            const result: any[] = await RequestUtil.get(`/tower-supply/produceIngredients/programme/${id}`)
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { refreshDeps: [id] })

    return <CommonTable loading={loading} columns={BatchingScheme} dataSource={data || []} />
}