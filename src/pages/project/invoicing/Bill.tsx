import React, { forwardRef, useEffect, useState } from "react"
import { Spin } from 'antd'
import { DetailTitle, BaseInfo, CommonTable, formatDataType } from '../../common'
import { baseInfoHead, invoiceHeadDetail, billingHeadOverView, batchHead } from "./InvoicingData.json"
import { contractPlanStatusOptions, currencyTypeOptions, productTypeOptions } from "../../../configuration/DictionaryOptions"
import AuthUtil from "@utils/AuthUtil"
import "./Bill.less"

export default forwardRef(function Bill({ loading, data }: any, ref) {
    const productType: any = productTypeOptions
    const [billData, setBillData] = useState<any>(data)
    const baseInfoHeadColumns = baseInfoHead.map((item: any) => {
        if (item.dataIndex === "productTypeId") {
            return ({
                ...item,
                enum: productType?.map((product: any) => ({
                    value: product.id,
                    label: product.name
                }))
            })
        }
        // 开票货币类型
        if (item.dataIndex === "currencyType") {
            return {
                ...item,
                enum: currencyTypeOptions?.map((product: any) => ({
                    value: product.id,
                    label: product.name
                }))
            }
        }
        if (item.dataIndex === "voltage") {
            return ({
                ...item,
                type: "string"
            })
        }
        if (item.dataIndex === "contractType") {
            return ({
                ...item,
                enum: contractPlanStatusOptions?.map(item => ({
                    value: item.id,
                    label: item.name
                }))
            })
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
            <span style={{ width: "50%", display: "inline-block", textAlign: "right" }}>审批编号：{billData?.invoicingCode}</span>
        </div>
        <Spin spinning={loading}>
            <ul className="base">
                {baseInfoHeadColumns?.map((item: any, index: number, arr: any) => {
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
                {invoiceHeadDetail?.map((item: any, index: number, arr: any) => {
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
                columns={billingHeadOverView}
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