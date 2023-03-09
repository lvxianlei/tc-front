import React, { forwardRef, useState, useEffect } from "react"
import { Spin } from 'antd'
import { DetailTitle, CommonTable, formatDataType } from '../common'
import { baseInfoHead, invoiceHead, billingHeader, batchHead } from "./InvoicingData.json"
import { productTypeOptions } from "../../configuration/DictionaryOptions"
import "./Bill.less"
import AuthUtil from "@utils/AuthUtil"
const productType: any = productTypeOptions
export default forwardRef(function Bill({ loading, data, ...props }: any, ref) {
    const [billData, setBillData] = useState<any>(data)
    const baseColumns = baseInfoHead.map((item: any) => {
        if (item.dataIndex === "productTypeId") {
            return ({
                ...item,
                type: "select",
                enum: productType.map((product: any) => ({
                    value: product.id,
                    label: product.name
                }))
            })
        }
        if (item.dataIndex === "weigh") {
            if (parseFloat(billData?.weigh) > parseFloat(billData?.reasonWeight)) {
                return ({ ...item, contentStyle: { backgroundColor: "red" } })
            }
            return item
        }
        return item
    })
    useEffect(() => {
        setBillData(data)
    })

    return <div ref={ref as any} className="bill">
        <div className="title">开票申请</div>
        <div className="sub_title">
            <span style={{ width: "50%", display: "inline-block" }}>{AuthUtil.getTenantName()}</span>
            <span style={{ width: "50%", display: "inline-block", textAlign: "right" }}>审批编号：{billData?.invoicingNumber}</span>
        </div>
        <Spin spinning={loading}>
            <ul className="base">
                {baseColumns?.map((item: any, index: number, arr: any) => {
                    let flagClass = false
                    if ((arr.length % 2 === 0) && [arr.length - 1, arr.length - 2].includes(index)) {
                        flagClass = true
                    } else if ((arr.length % 2 !== 0) && (index === arr.length - 1)) {
                        flagClass = true
                    }
                    return (<li className="baseItem" key={index} style={flagClass ? { borderBottom: "none" } : {}}>
                        <span>{item.title}</span>
                        <span>{billData ? formatDataType(item, billData) : ""}</span>
                    </li>)
                })}
            </ul>

            <DetailTitle title="发票信息" />
            <ul className="base">
                {invoiceHead?.map((item: any, index: number, arr: any) => {
                    let flagClass = false
                    if ((arr.length % 2 === 0) && [arr.length - 1, arr.length - 2].includes(index)) {
                        flagClass = true
                    } else if ((arr.length % 2 !== 0) && (index === arr.length - 1)) {
                        flagClass = true
                    }
                    return (<li className="baseItem" key={index} style={flagClass ? { borderBottom: "none" } : {}}>
                        <span>{item.title}</span>
                        <span>{billData ? formatDataType(item, billData?.invoicingInfoVo) : ""}</span>
                    </li>)
                })}
            </ul>
            <DetailTitle title="开票明细" />
            <CommonTable
                pagination={false}
                columns={billingHeader}
                dataSource={billData?.invoicingDetailVos || []}
            />

            <DetailTitle title="审批记录" style={{ paddingTop: 5 }} />
            <CommonTable
                pagination={false}
                columns={batchHead}
                dataSource={billData?.invoicingBatchVOS || []}
            />
        </Spin>
    </div>


})