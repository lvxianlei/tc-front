import React, {forwardRef, useImperativeHandle} from "react"
import {Spin, Row} from "antd"
import {BaseInfo, DetailTitle, Attachment, CommonTable} from "../common"
import {contractOverview, material,comparison} from "./contract.json"
import ApplicationContext from "../../configuration/ApplicationContext"
import useRequest from '@ahooksjs/use-request'
import RequestUtil from '../../utils/RequestUtil'

interface OverviewProps {
    id: string
}

export default function Overview({id}: OverviewProps): JSX.Element {
    const materialStandardEnum = (ApplicationContext.get().dictionaryOption as any)["104"].map((item: { id: string, name: string }) => ({
        value: item.id,
        label: item.name
    }))
    const deliveryMethodEnum = (ApplicationContext.get().dictionaryOption as any)["128"].map((item: { id: string, name: string }) => ({
        value: item.id,
        label: item.name
    }))
    const transportMethodEnum = (ApplicationContext.get().dictionaryOption as any)["129"].map((item: { id: string, name: string }) => ({
        value: item.id,
        label: item.name
    }))

    const {loading, data} = useRequest<{ [key: string]: any }>(() => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(`/tower-supply/materialContract/${id}`)
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), {refreshDeps: [id]})
    return <Spin spinning={loading}>
        <DetailTitle title="合同基本信息"/>
        <BaseInfo columns={contractOverview.map((item: any) => {
            switch (item.dataIndex) {
                case "materialStandard":
                    return ({...item, enum: materialStandardEnum})
                case "deliveryMethod":
                    return ({...item, enum: deliveryMethodEnum})
                case "transportMethod":
                    return ({...item, enum: transportMethodEnum})
                default:
                    return item
            }
        })} dataSource={data || {}}/>
        <DetailTitle title="询比价信息"/>
        <BaseInfo col={1} columns={comparison} dataSource={{comparisonPrice:data?.comparisonPriceNumber}}/>
        <Attachment dataSource={data?.materialContractAttachInfoVos || []}/>
        <DetailTitle title="原材料信息"/>
        <Row></Row>
        <CommonTable columns={material} dataSource={data?.materialContractDetailVos || []}/>
    </Spin>
}