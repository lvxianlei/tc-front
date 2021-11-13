import React, { useImperativeHandle, forwardRef } from "react"
import { Spin, Form } from 'antd'
import { DetailContent, BaseInfo, formatData } from '../../common'
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
    const [baseForm] = Form.useForm()
    const invoiceTypeEnum = (ApplicationContext.get().dictionaryOption as any)["1210"].map((item: { id: string, name: string }) => ({ value: item.id, label: item.name }))
    const pleasePayTypeEnum = (ApplicationContext.get().dictionaryOption as any)["1212"].map((item: { id: string, name: string }) => ({ value: item.id, label: item.name }))
    const paymentMethodEnum = (ApplicationContext.get().dictionaryOption as any)["1211"].map((item: { id: string, name: string }) => ({ value: item.id, label: item.name }))

    const { data: deptData } = useRequest<{ [key: string]: any }>(() => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(`/sinzetech-user/department`)
            resole(result.map((item: any) => ({ label: item.name, value: item.id })))
        } catch (error) {
            reject(error)
        }
    }))

    const { loading, data } = useRequest<{ [key: string]: any }>(() => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(`/tower-supply/applyPayment/${id}`)
            baseForm.setFieldsValue(formatData(ApplicationList, {
                ...result,
                relatednotes: {
                    value: result.applyPaymentInvoiceVos?.map((item: any) => item.billNumber).join(","),
                    records: result.applyPaymentInvoiceVos?.map((item: any) => ({
                        invoiceId: item.invoiceId,
                        billNumber: item.billNumber
                    })) || []
                }
            }))
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: type === "new", refreshDeps: [id] })

    const { run: saveRun } = useRequest<{ [key: string]: any }>((data: any, saveType?: "save" | "saveAndApply") => new Promise(async (resole, reject) => {
        try {
            if (saveType === "saveAndApply") {
                const result: { [key: string]: any } = await RequestUtil[type === "new" ? "post" : "put"](`/tower-supply/applyPayment/saveAndStartApplyPayment`, data)
                resole(result)
                return
            } else {
                const result: { [key: string]: any } = await RequestUtil[type === "new" ? "post" : "put"](`/tower-supply/applyPayment`, data)
                resole(result)
                return
            }
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    const onSubmit = (saveType?: "save" | "saveAndApply") => new Promise(async (resolve, reject) => {
        try {
            const baseData = await baseForm.validateFields()
            const postData = type === "new" ? {
                ...baseData,
                supplierId: baseData.supplierName?.id || data?.supplierId,
                supplierName: baseData.supplierName?.value || data?.supplierName,
                applyPaymentInvoiceDtos: baseData.relatednotes.records?.map((item: any) => ({
                    invoiceId: item.invoiceId,
                    billNumber: item.billNumber
                })) || data?.applyPaymentInvoiceVos
            } : {
                ...baseData,
                id: data?.id,
                supplierId: baseData.supplierName?.id || data?.supplierId,
                supplierName: baseData.supplierName?.value || data?.supplierName,
                applyPaymentInvoiceDtos: baseData.relatednotes.records?.map((item: any) => ({
                    invoiceId: item.invoiceId,
                    billNumber: item.billNumber
                })) || data?.applyPaymentInvoiceVos.map((item: any) => ({
                    invoiceId: item.invoiceId,
                    billNumber: item.billNumber
                }))
            }
            await saveRun(postData, saveType)
            resolve(true)
        } catch (error) {
            reject(false)
        }
    })

    useImperativeHandle(ref, () => ({ onSubmit, resetFields }), [ref, onSubmit])

    const resetFields = () => {
        baseForm.resetFields()
    }

    const handleBaseInfoChange = (fields: any) => {
        if (fields.relatednotes) {
            let pleasePayAmount = 0
            fields.relatednotes.records.forEach((item: any) => {
                pleasePayAmount = Number(pleasePayAmount + parseFloat(item.invoiceAmount || "0").toFixed(2))
            })
            baseForm.setFieldsValue({
                pleasePayAmount,
                receiptNumbers: fields.relatednotes.value
            })
        }
        if (fields.supplierName) {
            baseForm.setFieldsValue({
                openBank: fields.supplierName.records[0]?.bankDeposit,
                openBankNumber: fields.supplierName.records[0]?.bankAccount
            })
        }
    }

    return <DetailContent>
        <Spin spinning={loading}>
            <BaseInfo form={baseForm} onChange={handleBaseInfoChange} columns={ApplicationList.map((item: any) => {
                switch (item.dataIndex) {
                    case "relatednotes":
                        return ({
                            ...item,
                            columns: item.columns.map((item: any) => item.dataIndex === "invoiceType" ? ({
                                ...item,
                                type: "select",
                                enum: invoiceTypeEnum
                            }) : item)
                        })
                    case "pleasePayType":
                        return ({ ...item, enum: pleasePayTypeEnum })
                    case "paymentMethod":
                        return ({ ...item, type: "select", enum: paymentMethodEnum })
                    case "pleasePayOrganization":
                        return ({ ...item, enum: deptData })
                    default:
                        return item
                }
            })} col={3} dataSource={{}} edit />
        </Spin>
    </DetailContent>
})