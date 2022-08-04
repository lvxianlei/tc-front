import React from "react"
import { Spin, Row } from "antd"
import { BaseInfo, DetailTitle, Attachment, CommonTable } from "../common"
import { contractOverview, materialOverview, freightOverview, stevedoringOverview } from "./contract.json"
import useRequest from '@ahooksjs/use-request'
import RequestUtil from '../../utils/RequestUtil'
import { deliverywayOptions, settlementModeOptions, transportationTypeOptions } from "../../configuration/DictionaryOptions"

interface OverviewProps {
    id: string
}
const deliveryMethodEnum = deliverywayOptions?.map((item: { id: string, name: string }) => ({ value: item.id, label: item.name }))
const transportMethodEnum = transportationTypeOptions?.map((item: { id: string, name: string }) => ({ value: item.id, label: item.name }))
const settlementModeEnum = settlementModeOptions?.map((item: { id: string, name: string | number }) => ({ value: item.id, label: item.name }))

export default function Overview({ id }: OverviewProps): JSX.Element {
    const { loading, data } = useRequest<{ [key: string]: any }>(() => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(`/tower-supply/materialContract/${id}`)
            result["operatorName"] = `${result.operatorDeptName}-${result.operatorName}`
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { refreshDeps: [id] })

    return <Spin spinning={loading}>
        <DetailTitle title="合同基本信息" />
        <BaseInfo
            col={2}
            columns={contractOverview.map((item: any) => {
                switch (item.dataIndex) {
                    case "deliveryMethod":
                        return ({ ...item, enum: deliveryMethodEnum })
                    case "transportMethod":
                        return ({ ...item, enum: transportMethodEnum })
                    case "settlementMode":
                        return ({ ...item, enum: settlementModeEnum })
                    default:
                        return item
                }
            })}
            dataSource={data || {}} />
        <p style={{ fontSize: '16px', color: '#181818', marginRight: '30px', fontWeight: '700', margin: 0 }}>运费信息
            <p style={{ fontSize: '14px', color: 'rgba(0, 0, 0, 0.85)', margin: 0 }}>
                <span style={{ fontWeight: 400 }}>运费：含税金额合计（元）：<span style={{ color: '#FF8C00', marginRight: 12 }}>{data?.transportBearVo?.transportTaxTotalAmount}</span>
                    不含税金额合计（元）<span style={{ color: '#FF8C00' }}>{data?.transportBearVo?.transportTotalAmount}</span>
                </span>
            </p>
        </p>
        <BaseInfo col={2} columns={freightOverview} dataSource={data?.transportBearVo || {}} />
        <p style={{ fontSize: '16px', color: '#181818', marginRight: '30px', fontWeight: '700', margin: 0 }}>装卸费信息
            <p style={{ fontSize: '14px', color: 'rgba(0, 0, 0, 0.85)', margin: 0 }}>
                <span style={{ fontWeight: 400 }}>装卸费：含税金额合计（元）：<span style={{ color: '#FF8C00', marginRight: 12 }}>{data?.unloadBearVo?.unloadTaxTotalAmount}</span>
                    不含税金额合计（元）<span style={{ color: '#FF8C00' }}>{data?.unloadBearVo?.unloadTotalAmount}</span>
                </span>
            </p>
        </p>
        <BaseInfo col={2} columns={stevedoringOverview} dataSource={data?.unloadBearVo || {}} />
        <p style={{ fontSize: '16px', color: '#181818', marginRight: '30px', fontWeight: '700', margin: 0 }}>原材料信息
            <p style={{ fontSize: '14px', color: 'rgba(0, 0, 0, 0.85)', margin: 0 }}>
                <span style={{ fontWeight: 400 }}>重量合计（吨）：<span style={{ color: '#FF8C00' }}>{data?.totalWeight}</span> 含税金额合计（元）：<span style={{ color: '#FF8C00', marginRight: 12 }}>{data?.totalTaxAmount}</span>
                    不含税金额合计（元）<span style={{ color: '#FF8C00' }}>{data?.totalAmount}</span>
                </span>
            </p>
        </p>
        <CommonTable style={{ paddingBottom: 0 }} columns={materialOverview} dataSource={data?.materialContractDetailVos || []} />
        <Attachment style={{ margin: 0 }} dataSource={data?.materialContractAttachInfoVos || []} />
    </Spin>
}