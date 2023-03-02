import React from "react"
import { Button, Form, message, Spin } from 'antd'
import { useHistory, useParams } from 'react-router-dom'
import { DetailContent, DetailTitle, BaseInfo, Attachment, EditableTable, CommonTable } from '../common'
import { baseInfoHead, invoiceHead, billingHeader, saleInvoice, transferHead } from "./InvoicingData.json"
import useRequest from '@ahooksjs/use-request'
import RequestUtil from '../../utils/RequestUtil'
import { currencyTypeOptions, productTypeOptions } from "../../configuration/DictionaryOptions"
export default function Overview() {
    const history = useHistory()
    const params = useParams<{ invoicingId: string }>()
    const [transferForm] = Form.useForm()
    const [saleInvoiceForm] = Form.useForm()
    const productType: any = productTypeOptions
    const { loading, data } = useRequest<{ [key: string]: any }>(() => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(`/tower-finance/invoicing/getTaskInfo/${params.invoicingId}`)
            resole(result)
        } catch (error) {
            reject(error)
        }
    }))

    const { loading: saving, run: saveRun } = useRequest<{ [key: string]: any }>((data: any) => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.put(`/tower-finance/invoicing/sale`, {
                ...data,
                id: params.invoicingId
            })
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    const invoiceTableChange = async (fields: any, allFields: any) => {
        if (fields.submit.length - 1 >= 0) {
            saleInvoiceForm.setFieldsValue({
                submit: allFields.submit?.map((el: any) => ({
                    ...el,
                    taxAmount: (parseFloat(el.moneyCount || "0") - (parseFloat(el.moneyCount || "0") / (1 + parseFloat(el.taxRate || "0") * 0.01))).toFixed(2),
                    untaxPrice: (parseFloat(el.moneyCount || "0") / (1 + parseFloat(el.taxRate || "0") * 0.01)).toFixed(2)
                }))
            })
        }
    }

    const handleSubmit = async (saveType: 1 | 2) => {
        const transferData = await transferForm.validateFields()
        const saleInvoiceData = await saleInvoiceForm.validateFields()
        await saveRun({
            ...transferData,
            invoicingSaleDTOS: saleInvoiceData?.submit?.map((item: any) => ({
                ...item,
                currencyType: item.currencyType?.value,
                currencyName: item.currencyType?.label,
            })),
            saveType
        })
        await message.success(`${saveType === 1 ? "保存" : "保存并提交"}成功...`)
        history.goBack()
    }

    return <DetailContent
        operation={[
            <Button
                loading={saving}
                key="save"
                onClick={() => handleSubmit(1)}
                type="primary"
                style={{ marginRight: 16 }}
            >保存</Button>,
            <Button
                loading={saving}
                key="saveAndSubmit"
                onClick={() => handleSubmit(2)}
                type="primary"
                style={{ marginRight: 16 }}
            >保存并提交</Button>,
            <Button key="cancel" onClick={() => history.go(-1)}>返回</Button>
        ]}>
        <Spin spinning={loading}>
            <DetailTitle title="基本信息" />
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
                    if (parseFloat(data?.weigh) > parseFloat(data?.reasonWeight)) {
                        return ({ ...item, contentStyle: { backgroundColor: "red" } })
                    }
                    return item
                }
                return item
            })} dataSource={data || {}} />

            <DetailTitle title="发票信息" />
            <BaseInfo columns={invoiceHead} dataSource={data?.invoicingInfoVo || []} />

            <DetailTitle title="开票明细" />
            <CommonTable columns={billingHeader} dataSource={data?.invoicingDetailVos || []} />

            <DetailTitle title="移交信息" />
            <BaseInfo
                form={transferForm}
                columns={transferHead}
                dataSource={data || {}} edit />

            <DetailTitle title="销售发票" />
            <EditableTable
                form={saleInvoiceForm}
                addData={{ ticketType: data?.ticketType }}
                onChange={invoiceTableChange}
                columns={saleInvoice.map((item: any) => {
                    if (item.dataIndex === "currencyType") {
                        return ({
                            ...item,
                            type: "select",
                            labelInValue: true,
                            enum: currencyTypeOptions?.map((product: any) => ({
                                value: product.id,
                                label: product.name
                            }))
                        })
                    }
                    return item
                })}
                dataSource={data?.invoicingSaleVos?.map((item: any) => ({
                    ...item,
                    ticketType: data?.ticketType,
                    currencyType: { label: item.currencyName, value: item.currencyType }
                })) || []} />

            <Attachment dataSource={data?.attachInfoVos} />
        </Spin>
    </DetailContent>
}