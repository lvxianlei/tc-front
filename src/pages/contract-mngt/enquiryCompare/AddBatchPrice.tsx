import React, { forwardRef, useImperativeHandle, useRef } from "react"
import { useParams } from "react-router-dom"
import { Form, Spin } from "antd"
import { batchSupplier } from "./enquiry.json"
import { BaseInfo, DetailTitle, Attachment, AttachmentRef } from "../../common"
import useRequest from '@ahooksjs/use-request'
import RequestUtil from '../../../utils/RequestUtil'
import * as calcObj from '@utils/calcUtil'
interface AddPriceProps {
    id: string,
    type: "batch_new" | "batch_edit"
    comparisonPriceId: string
    materialLists: any[]
}
export default forwardRef(function ({ id, type, materialLists, comparisonPriceId }: AddPriceProps, ref): JSX.Element {
    const [form] = Form.useForm()
    const attachRef = useRef<AttachmentRef>()
    const params = useParams<{ id: string }>()
    const { loading: suplierLoading, data: suplier } = useRequest<{ [key: string]: any }>(() => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(`/tower-supply/comparisonPrice/getSuppliersById/${comparisonPriceId}`)
            resole(result.map((item: any) => ({ label: item.supplierName, value: item.id })))
        } catch (error) {
            reject(error)
        }
    }))

    const { loading: materialLoading, data: materialData } = useRequest<{ [key: string]: any }>(() => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(`/tower-storage/tax/taxMode/material`)
            resole(result)
        } catch (error) {
            reject(error)
        }
    }))

    const { loading, data } = useRequest<{ [key: string]: any }>(() => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(`/tower-supply/inquiryQuotation/${id}`)
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: type === "batch_new" })

    const { run: saveRun } = useRequest<{ [key: string]: any }>((data: any) => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil[type === "batch_new" ? "post" : "put"](`/tower-supply/inquiryQuotation`, type === "batch_new" ? data : ({ id, ...data }))
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    const resetFields = () => {
        form.resetFields()
        attachRef.current?.resetFields()
    }

    const onSubmit = () => new Promise(async (resove, reject) => {
        try {
            const formData = await form.validateFields()
            await saveRun({
                manufacturer: formData.manufacturer,
                taxOffer: formData.taxOffer,
                supplierId: formData.supplier?.value || data?.supplierId,
                supplierName: formData.supplier?.label || data?.supplierName,
                inquiryQuotationOfferDtos: materialLists.map((item: any) => {
                    return ({
                        ...item,
                        comparisonPriceDetailId: item.comparisonPriceDetailId?item.comparisonPriceDetailId:item.id,
                        taxOffer: formData.taxOffer,
                        offer: calcObj.unTaxPrice(formData.taxOffer, materialData?.taxVal)
                    })
                }),
                comparisonPriceId: params.id,
                fileIds: attachRef.current?.getDataSource().map(item => item.id)
            })
            resove(true)
        } catch (error) {
            reject(false)
        }
    })

    useImperativeHandle(ref, () => ({ onSubmit, resetFields }), [ref, onSubmit, resetFields])

    return <Spin spinning={loading && suplierLoading && materialLoading}>
        <DetailTitle title="询比价基本信息" />
        <BaseInfo
            classStyle="overall-form-class-padding0"
            form={form}
            col={2}
            columns={batchSupplier.map((item: any) => {
                if (item.dataIndex === 'supplier') {
                    return ({
                        ...item,
                        enum: suplier
                    })
                }
                return item
            })}
            dataSource={{
                supplier: data?.supplierId ? {
                    value: data?.supplierId,
                    label: data?.supplierName
                } : undefined
            }} edit />
        <Attachment dataSource={data?.inquiryQuotationAttachInfoVos || []} ref={attachRef} edit />
    </Spin>
})