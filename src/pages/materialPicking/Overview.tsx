import React from "react"
import { Button, Spin } from 'antd'
import { useHistory } from 'react-router-dom'
import { DetailContent, DetailTitle, BaseInfo, CommonTable } from '../common'
import { setting, materialInfo } from "./picking.json"
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
        <BaseInfo columns={setting} dataSource={data || {}} />

        <DetailTitle title="原材料信息" />
        <CommonTable columns={materialInfo} dataSource={data?.materialPickingInfoVOS || []} />
    </Spin>
}