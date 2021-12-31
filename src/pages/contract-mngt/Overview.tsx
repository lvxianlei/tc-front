import React, {forwardRef, useImperativeHandle} from "react"
import {Spin, Row} from "antd"
import {BaseInfo, DetailTitle, Attachment, CommonTable} from "../common"
import {contractOverview, material, freightOverview, stevedoringOverview} from "./contract.json"
import useRequest from '@ahooksjs/use-request'
import RequestUtil from '../../utils/RequestUtil'
import { deliverywayOptions, materialStandardOptions, transportationTypeOptions } from "../../configuration/DictionaryOptions"

interface OverviewProps {
    id: string
}

export default function Overview({id}: OverviewProps): JSX.Element {
    const materialStandardEnum = materialStandardOptions?.map((item: { id: string, name: string }) => ({
        value: item.id,
        label: item.name
    }))
    const deliveryMethodEnum = deliverywayOptions?.map((item: { id: string, name: string }) => ({
        value: item.id,
        label: item.name
    }))
    const transportMethodEnum = transportationTypeOptions?.map((item: { id: string, name: string }) => ({
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
                case "deliveryMethod":
                    return ({...item, enum: deliveryMethodEnum})
                case "transportMethod":
                    return ({...item, enum: transportMethodEnum})
                default:
                    return item
            }
        })} dataSource={data || {}}/>
        <p style={{ fontSize: '16px', color: '#181818', marginRight: '30px', fontWeight: '700', padding: '0px 0px 8px' }}>运费信息
            <p style={{ fontSize: '18px', color: '#FF8C00' }}>
                <span>运费：含税金额合计（元）：{data?.transportBearVo?.transportTaxTotalAmount}   
                    不含税金额合计（元）{data?.transportBearVo?.transportTotalAmount}
                </span>
            </p>
        </p>
        <BaseInfo col={4} columns={freightOverview} dataSource={data?.transportBearVo || {}} />
        <p style={{ fontSize: '16px', color: '#181818', marginRight: '30px', fontWeight: '700', padding: '0px 0px 8px' }}>装卸费信息
            <p style={{ fontSize: '18px', color: '#FF8C00' }}>
                <span>装卸费：含税金额合计（元）：{data?.unloadBearVo?.unloadTaxTotalAmount}
                    不含税金额合计（元）{data?.unloadBearVo?.unloadTotalAmount}
                </span>
            </p>
        </p>
        <BaseInfo col={4} columns={stevedoringOverview} dataSource={data?.unloadBearVo || {}} />
        <p style={{ fontSize: '16px', color: '#181818', marginRight: '30px', fontWeight: '700', padding: '0px 0px 8px' }}>原材料信息
            <p style={{ fontSize: '18px', color: '#FF8C00' }}>
                <span>重量合计（吨）：{data?.totalWeight} 含税金额合计（元）：{data?.totalTaxAmount}
                    不含税金额合计（元）{data?.totalAmount}
                </span>
            </p>
        </p>
        <Row></Row>
        <CommonTable columns={material} dataSource={data?.materialContractDetailVos || []}/>
        <Attachment dataSource={data?.materialContractAttachInfoVos || []}/>
    </Spin>
}