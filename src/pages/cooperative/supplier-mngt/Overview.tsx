import React from "react"
import { Spin } from "antd"
import { DetailTitle, BaseInfo, CommonTable } from "../../common"
import { editColums, oprationInfo, supplierFormHead } from "./supplier.json"
import RequestUtil from '../../../utils/RequestUtil'
import useRequest from '@ahooksjs/use-request'
import ApplicationContext from "../../../configuration/ApplicationContext"
interface OverviewProps {
    id: string
}
export default function Overview({ id }: OverviewProps) {
    const supplierTypeEnum = (ApplicationContext.get().dictionaryOption as any)["144"].map((item: { id: string, name: string }) => ({ value: item.id, label: item.name }))
    const qualityAssuranceEnum = (ApplicationContext.get().dictionaryOption as any)["145"].map((item: { id: string, name: string }) => ({ value: item.id, label: item.name }))
    const supplyProductsEnum = (ApplicationContext.get().dictionaryOption as any)["148"].map((item: { id: string, name: string }) => ({ value: item.id, label: item.name }))
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
        <BaseInfo columns={editColums.map((item: any) => {
            switch (item.dataIndex) {
                case "supplierType":
                    return ({
                        ...item,
                        type: "select",
                        enum: supplierTypeEnum
                    })
                case "supplyProducts":
                    return ({
                        ...item,
                        dataIndex: "supplyProductsName"
                    })
                case "qualityAssurance":
                    return ({
                        ...item,
                        type: "select",
                        enum: qualityAssuranceEnum
                    })
                default:
                    return item
            }
        })} dataSource={data || {}} />
        <DetailTitle title="供应商账户信息" />
        <BaseInfo columns={supplierFormHead} dataSource={data || {}} />
        <DetailTitle title="操作信息" />
        <CommonTable columns={oprationInfo} dataSource={[]} />
    </Spin>
}