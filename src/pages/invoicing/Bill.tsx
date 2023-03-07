import React, { forwardRef, useState, useEffect } from "react"
import { Spin } from 'antd'
import { DetailTitle, BaseInfo, CommonTable } from '../common'
import { baseInfoHead, invoiceHead, billingHeader, opration } from "./InvoicingData.json"
import { productTypeOptions } from "../../configuration/DictionaryOptions"
import "./Bill.less"
import AuthUtil from "@utils/AuthUtil"
export default forwardRef(function Bill({ loading, data, ...props }: any, ref) {
    const productType: any = productTypeOptions
    const [billData, setBillData] = useState<any>(data)
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
            <BaseInfo columns={baseInfoHead.map((item: any) => {
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
            })} dataSource={billData || {}} col={2} />

            <DetailTitle title="发票信息" />
            <BaseInfo columns={invoiceHead} dataSource={billData?.invoicingInfoVo || []} col={2} />

            <DetailTitle title="开票明细" />
            <CommonTable
                pagination={false}
                columns={billingHeader}
                dataSource={billData?.invoicingDetailVos || []}
            />

            <DetailTitle title="审批流程" style={{ paddingTop: 5 }} />
            <CommonTable
                pagination={false}
                columns={opration}
                dataSource={billData?.invoicingDetailVos || []}
            />
        </Spin>
    </div>


})