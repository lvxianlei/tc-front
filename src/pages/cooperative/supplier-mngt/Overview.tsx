import React from "react"
import { Spin } from "antd"
import { DetailTitle, BaseInfo, CommonTable, OperationRecord } from "../../common"
import { editColums, oprationInfo, supplierFormHead } from "./supplier.json"
import RequestUtil from '../../../utils/RequestUtil'
import useRequest from '@ahooksjs/use-request'
import { bankTypeOptions, qualityAssuranceOptions, supplierTypeOptions } from "../../../configuration/DictionaryOptions"
interface OverviewProps {
    id: string
}
export default function Overview({ id }: OverviewProps) {
    const supplierTypeEnum = supplierTypeOptions?.map((item: { id: string, name: string }) => ({ value: item.id, label: item.name }))
    const qualityAssuranceEnum = qualityAssuranceOptions?.map((item: { id: string, name: string }) => ({ value: item.id, label: item.name }))
    const bankTypeOptionsEnum = bankTypeOptions?.map((item: { id: string, name: string }) => ({ value: item.id, label: item.name }))
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
        <OperationRecord serviceId={id} serviceName="tower-supply" />
    </Spin>
}