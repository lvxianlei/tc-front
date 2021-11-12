import React from "react"
import { Spin } from "antd"
import { DetailTitle, BaseInfo, CommonTable } from "../common"
import { editColums, oprationInfo, supplierFormHead } from "./supplier.json"
import RequestUtil from '../../utils/RequestUtil'
import useRequest from '@ahooksjs/use-request'
interface OverviewProps {
    id: string
}
export default function Overview({ id }: OverviewProps) {
    const { loading, data } = useRequest<{ [key: string]: any }>((data: any) => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(`/tower-supply/supplier/${id}`)
            resole(result)
        } catch (error) {
            reject(false)
        }
    }), { refreshDeps: [id] })
    return <Spin spinning={loading}>
        <DetailTitle title="供应商基础信息" />
        <BaseInfo columns={editColums} dataSource={data || {}} />
        <DetailTitle title="供应商账户信息" />
        <BaseInfo columns={supplierFormHead} dataSource={data || {}} />
        <DetailTitle title="操作信息" />
        <CommonTable columns={oprationInfo} dataSource={[]} />
    </Spin>
}