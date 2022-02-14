import React from "react"
import { Spin } from 'antd'
import { useHistory } from 'react-router-dom'
import { DetailTitle, BaseInfo, CommonTable } from '../common'
import { settingDetail, materialInfoDetail } from "./picking.json"
import useRequest from '@ahooksjs/use-request'
import RequestUtil from '../../utils/RequestUtil'
interface OverviewProps {
    id: string
}
export default function Overview({ id }: OverviewProps): JSX.Element {
    const history = useHistory()
    const { loading, data } = useRequest<{ [key: string]: any }>(() => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(`/tower-supply/materialPicking/${id}`)
            resole(result)
        } catch (error) {
            reject(error)
        }
    }))

    return <Spin spinning={loading}>
        <DetailTitle title="基础信息" />
        <BaseInfo col={2} columns={settingDetail} dataSource={data || {}} />

        <DetailTitle title="原材料信息" />
        <CommonTable columns={materialInfoDetail} dataSource={data?.materialPickingInfoVOS || []} />
    </Spin>
}