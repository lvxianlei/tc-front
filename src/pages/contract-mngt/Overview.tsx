import React, { useState } from "react"
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
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { refreshDeps: [id] })
    const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([]);
    const [selectedRows, setSelectedRows] = useState<any[]>([]);
    const [numData, setNumData] = useState<any>({});
    const SelectChange = (selectedRowKeys: React.Key[], selectedRows: any[]): void => {
        setSelectedKeys(selectedRowKeys);
        setSelectedRows(selectedRows);
        const totalNum = selectedRows.reduce((pre: any,cur: { num: any; })=>{
            return parseFloat(pre!==null?pre:0) + parseFloat(cur.num!==null?cur.num:0) 
        },0)
        const totalWeight = selectedRows.reduce((pre: any,cur: { totalWeight: any; })=>{
            return (parseFloat(pre!==null?pre:0) + parseFloat(cur.totalWeight!==null?cur.totalWeight:0)).toFixed(5) 
        },0)
        const taxPrice = selectedRows.reduce((pre: any,cur: { taxTotalAmount: any; })=>{
            return (parseFloat(pre!==null?pre:0 )+ parseFloat(cur.taxTotalAmount!==null?cur.taxTotalAmount:0 )).toFixed(2)
        },0)
        const unTaxPrice = selectedRows.reduce((pre: any,cur: { totalAmount: any; })=>{
            return (parseFloat(pre!==null?pre:0) + parseFloat(cur.totalAmount!==null?cur.totalAmount:0)).toFixed(2)
        },0) 
        setNumData({
            totalNum,
            totalWeight,
            taxPrice,
            unTaxPrice
        })
    }

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
                {/* <span style={{ fontWeight: 400 }}>重量合计（吨）：<span style={{ color: '#FF8C00' }}>{data?.totalWeight}</span> 含税金额合计（元）：<span style={{ color: '#FF8C00', marginRight: 12 }}>{data?.totalTaxAmount}</span>
                    不含税金额合计（元）<span style={{ color: '#FF8C00' }}>{data?.totalAmount}</span>
                </span> */}
                <span style={{ fontWeight: 400 }}>
                    数量合计：<span style={{ color: "#FF8C00", marginRight: 12 }}>{numData?.totalNum||0}</span>
                    重量合计(吨)：<span style={{ color: "#FF8C00", marginRight: 12 }}>{numData?.totalWeight||0}</span>
                    含税金额合计(元)：<span style={{ color: "#FF8C00", marginRight: 12 }}>{numData?.taxPrice||0}</span>
                    不含税金额合计（元）：<span style={{ color: "#FF8C00", marginRight: 12 }}>{ numData?.unTaxPrice ||0}</span>
                </span>
            </p>
        </p>
        <CommonTable style={{ paddingBottom: 0 }} columns={[{
            key: 'index',
            title: '序号',
            dataIndex: 'index',
            width: '5%',
            render: (_a: any, _b: any, index: number): React.ReactNode => {
                return (
                    <span>
                        {index + 1}
                    </span>
                )
            }
        }, ...materialOverview]} dataSource={data?.materialContractDetailVos || []}  
        rowSelection={{
            selectedRowKeys: selectedKeys,
            type: "checkbox",
            onChange: SelectChange,
        }}/>
        <Attachment style={{ margin: 0 }} dataSource={data?.materialContractAttachInfoVos || []} />
    </Spin>
}