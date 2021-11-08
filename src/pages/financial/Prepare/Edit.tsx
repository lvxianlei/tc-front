import React, { useState, useImperativeHandle, forwardRef } from "react"
import { Spin, Form } from 'antd'
import { DetailContent, DetailTitle, BaseInfo } from '../../common'
import { ApplicationList } from "../financialData.json"
import RequestUtil from '../../../utils/RequestUtil'
import useRequest from '@ahooksjs/use-request'
import ApplicationContext from "../../../configuration/ApplicationContext"
interface EditProps {
    type: "new" | "edit",
    ref?: React.RefObject<{ onSubmit: () => Promise<any> }>
    id: string
}

export default forwardRef(function Edit({ type, id }: EditProps, ref) {
    const invoiceTypeEnum = (ApplicationContext.get().dictionaryOption as any)["1210"].map((item: { id: string, name: string }) => ({
        value: item.id,
        label: item.name
    }))
    const pleasePayTypeEnum = (ApplicationContext.get().dictionaryOption as any)["1212"].map((item: { id: string, name: string }) => ({
        value: item.id,
        label: item.name
    }))
    const paymentMethodEnum = (ApplicationContext.get().dictionaryOption as any)["1211"].map((item: { id: string, name: string }) => ({
        value: item.id,
        label: item.name
    }))
    const [baseForm] = Form.useForm()

    const { loading, data } = useRequest<{ [key: string]: any }>(() => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(`/tower-supply/applyPayment/${id}`)
            baseForm.setFieldsValue({
                ...result,
                relatednotes: result.applyPaymentInvoiceVos?.map((item: any) => item.billNumber).join(",")
            })
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: type === "new", refreshDeps: [id] })

    const { run: saveRun } = useRequest<{ [key: string]: any }>((data: any) => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.post(`/tower-supply/applyPayment`, data)
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    const onSubmit = () => new Promise(async (resolve, reject) => {
        try {
            const baseData = await baseForm.validateFields()
            await saveRun({
                ...baseData,
                supplierId: baseData.supplierName?.id || data?.supplierId,
                supplierName: baseData.supplierName?.value || data?.supplierName,
                applyPaymentInvoiceDtos: baseData.relatednotes.records?.map((item: any) => ({
                    invoiceId: item.id, billNumber: item.billNumber
                })) || data?.applyPaymentInvoiceVos
            })
            resolve(true)
        } catch (error) {
            console.log(error)
            reject(false)
        }
    })

    useImperativeHandle(ref, () => ({ onSubmit, resetFields }), [ref, onSubmit])

    const resetFields = () => {
        baseForm.resetFields()
    }

    const handleBaseInfoChange = (fields: any) => {
        if (fields.relatednotes) {
            console.log(fields.records)
        }
    }

    return <DetailContent>
        <Spin spinning={loading}>
            <BaseInfo form={baseForm} onChange={handleBaseInfoChange} columns={ApplicationList.map((item: any) => {
                if (item.dataIndex === "relatednotes") {
                    return ({
                        ...item,
                        columns: item.columns.map((item: any) => item.dataIndex === "invoiceType" ? ({ ...item, enum: invoiceTypeEnum }) : item)
                    })
                }

                if (item.dataIndex === "pleasePayType") {
                    return ({ ...item, type: "select", enum: pleasePayTypeEnum });
                }
                if (item.dataIndex === "paymentMethod") {
                    return ({ ...item, type: "select", enum: paymentMethodEnum });
                }
                return item;
            })} col={3} dataSource={{}} edit />
        </Spin>
    </DetailContent>
})