import React from "react"
import { Spin, Row } from "antd"
import { BaseInfo, DetailTitle, Attachment, CommonTable } from "../common"
import { contractOverview, material, freightOverview, stevedoringOverview } from "./contract.json"
import useRequest from '@ahooksjs/use-request'
import RequestUtil from '../../utils/RequestUtil'
import { deliverywayOptions, materialStandardOptions, transportationTypeOptions } from "../../configuration/DictionaryOptions"

interface OverviewProps {
    id: string
}

export default function Overview({ id }: OverviewProps): JSX.Element {
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

    const { loading, data } = useRequest<{ [key: string]: any }>(() => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(`/tower-supply/materialContract/${id}`)
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { refreshDeps: [id] })
    return <Spin spinning={loading}>
        <DetailTitle title="合同基本信息" />
        <BaseInfo columns={contractOverview.map((item: any) => {
            switch (item.dataIndex) {
                case "deliveryMethod":
                    return ({ ...item, enum: deliveryMethodEnum })
                case "transportMethod":
                    return ({ ...item, enum: transportMethodEnum })
                default:
                    return item
            }
        })} dataSource={data || {}} col={2} />
        <p style={{ fontSize: '16px', color: '#181818', marginRight: '30px', fontWeight: '700' }}>运费信息
            <p style={{ fontSize: '18px', color: 'rgba(0, 0, 0, 0.85)', margin: 0 }}>
                <span>运费：含税金额合计（元）：<span style={{ color: '#FF8C00' }}>{data?.transportBearVo?.transportTaxTotalAmount}</span>
                    不含税金额合计（元）<span style={{ color: '#FF8C00' }}>{data?.transportBearVo?.transportTotalAmount}</span>
                </span>
            </p>
        </p>
        <BaseInfo col={2} columns={freightOverview} dataSource={data?.transportBearVo || {}} />
        <p style={{ fontSize: '16px', color: '#181818', marginRight: '30px', fontWeight: '700' }}>装卸费信息
            <p style={{ fontSize: '18px', color: 'rgba(0, 0, 0, 0.85)', margin: 0 }}>
                <span>装卸费：含税金额合计（元）：<span style={{ color: '#FF8C00' }}>{data?.unloadBearVo?.unloadTaxTotalAmount}</span>
                    不含税金额合计（元）<span style={{ color: '#FF8C00' }}>{data?.unloadBearVo?.unloadTotalAmount}</span>
                </span>
            </p>
        </p>
        <BaseInfo col={2} columns={stevedoringOverview} dataSource={data?.unloadBearVo || {}} />
        <p style={{ fontSize: '16px', color: '#181818', marginRight: '30px', fontWeight: '700' }}>原材料信息
            <p style={{ fontSize: '18px', color: 'rgba(0, 0, 0, 0.85)', margin: 0 }}>
                <span>重量合计（吨）：<span style={{ color: '#FF8C00' }}>{data?.totalWeight}</span> 含税金额合计（元）：<span style={{ color: '#FF8C00' }}>{data?.totalTaxAmount}</span>
                    不含税金额合计（元）<span style={{ color: '#FF8C00' }}>{data?.totalAmount}</span>
                </span>
            </p>
        </p>
        <Row></Row>
        <CommonTable columns={material} dataSource={data?.materialContractDetailVos || []} />
        <Attachment dataSource={data?.materialContractAttachInfoVos || []} />
    </Spin>
}