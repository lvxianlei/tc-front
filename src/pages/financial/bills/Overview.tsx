import React, { useState } from "react"
import { Spin } from 'antd'
import { DetailTitle, BaseInfo, Attachment, OperationRecord, CommonTable } from '../../common'
import { billinformation, material } from "../financialData.json"
import useRequest from '@ahooksjs/use-request'
import RequestUtil from '../../../utils/RequestUtil'
import { invoiceTypeOptions } from "../../../configuration/DictionaryOptions"
interface OverviewProps {
    id: string
}
export default function Overview({ id }: OverviewProps) {
    const [numData, setNumData] = useState<any>({});
    const [popDataList, setPopDataList] = useState<any>([]);
    const invoiceTypeEnum = invoiceTypeOptions?.map((item: { id: string, name: string }) => ({
        value: item.id,
        label: item.name
    }))
    const { loading, data } = useRequest<{ [key: string]: any }>(() => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(`/tower-supply/invoice/${id}`)
            setPopDataList(result?.receiptVos)
            const totalNum = result?.receiptVos.reduce((pre: any,cur: { num: any; })=>{
                return parseFloat(pre!==null?pre:0) + parseFloat(cur.num!==null?cur.num:0) 
            },0)
            const totalWeight = result?.receiptVos.reduce((pre: any,cur: { totalWeight: any; })=>{
                return (parseFloat(pre!==null?pre:0) + parseFloat(cur.totalWeight!==null?cur.totalWeight:0)).toFixed(5) 
            },0)
            const taxPrice = result?.receiptVos.reduce((pre: any,cur: { taxPrice: any; })=>{
                return (parseFloat(pre!==null?pre:0 )+ parseFloat(cur.taxPrice!==null?cur.taxPrice:0 )).toFixed(2)
            },0)
            const unTaxPrice = result?.receiptVos.reduce((pre: any,cur: { totalPrice: any; })=>{
                return (parseFloat(pre!==null?pre:0) + parseFloat(cur.totalPrice!==null?cur.totalPrice:0)).toFixed(2)
            },0) 
            setNumData({
                totalNum,
                totalWeight,
                taxPrice,
                unTaxPrice
            })
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { refreshDeps: [id] })

    return <Spin spinning={loading}>
        <DetailTitle title="票据信息"/>
        <BaseInfo columns={billinformation.map((item: any) => {
            if (item.dataIndex === "invoiceType") {
                return ({ ...item, type: "select", enum: invoiceTypeEnum })
            }
            return item
        })} col={2} dataSource={data || {}} />
        <DetailTitle title="材料明细" />
        <span>
            数量合计：<span style={{ color: "#FF8C00", marginRight: 12 }}>{numData?.totalNum||0}</span>
            重量合计(吨)：<span style={{ color: "#FF8C00", marginRight: 12 }}>{numData?.totalWeight||0}</span>
            含税金额合计(元)：<span style={{ color: "#FF8C00", marginRight: 12 }}>{numData?.taxPrice||0}</span>
            不含税金额合计（元）：<span style={{ color: "#FF8C00", marginRight: 12 }}>{ numData?.unTaxPrice ||0}</span>
        </span>
        <CommonTable
            style={{ padding: "0" }}
            rowKey='entryStockDetailId'
            columns={[
                {
                    key: 'index',
                    title: '序号',
                    dataIndex: 'index',
                    fixed: "left",
                    width: 50,
                    render: (_a: any, _b: any, index: number): React.ReactNode => {
                        return (
                            <span>
                                {index + 1}
                            </span>
                        )
                    }
                },
                ...material]}
            pagination={false}
            dataSource={popDataList} />
        <Attachment dataSource={data?.invoiceAttachInfoVos || []}/>
        <OperationRecord serviceId={id} serviceName="tower-supply" operateTypeEnum="OPERATION" />
    </Spin>
}