import React from "react"
import { Spin } from "antd"
import { useHistory } from 'react-router-dom'
import { CommonTable } from '../../common'
import { BatchingScheme } from "./productionData.json"
import RequestUtil from '../../../utils/RequestUtil'
import useRequest from '@ahooksjs/use-request'
interface EditProps {
    id: string
}
export default function Edit({ id }: EditProps): JSX.Element {
    const history = useHistory()
    const { loading, data } = useRequest<any[]>(() => new Promise(async (resole, reject) => {
        try {
            const result: any[] = await RequestUtil.get(`/tower-supply/produceIngredients/programme/${id}`)
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { refreshDeps: [id] })

    return <Spin spinning={loading}>
        <CommonTable columns={BatchingScheme} dataSource={[]} />
    </Spin>
}