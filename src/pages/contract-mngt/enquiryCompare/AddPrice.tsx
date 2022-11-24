import React, { forwardRef, useState, useImperativeHandle, useRef } from "react"
import { useParams } from "react-router-dom"
import { Form, Spin, InputNumber } from "antd"
import { addPriceHead, supplier } from "./enquiry.json"
import { BaseInfo, CommonTable, DetailTitle, Attachment, AttachmentRef } from "../../common"
import useRequest from '@ahooksjs/use-request'
import RequestUtil from '../../../utils/RequestUtil'
import * as calcObj from '@utils/calcUtil'

interface AddPriceProps {
    id: string,
    comparisonPriceId: string
    type: "new" | "edit"
    materialLists: any[]
}
export default forwardRef(function ({ id, comparisonPriceId, type, materialLists }: AddPriceProps, ref): JSX.Element {
    const [materials, setMaterials] = useState<any[]>(materialLists.map((item: any) => ({
        ...item,
        taxOffer: [-1, "-1"].includes(item.taxOffer) ? 1 : item.taxOffer,
        offer: [-1, "-1"].includes(item.offer) ? 1 : item.offer
    })) || [])
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
            setMaterials(result?.inquiryQuotationOfferVos.map((item: any) => ({
                ...item,
                taxOffer: [-1, "-1"].includes(item.taxOffer) ? 1 : item.taxOffer,
                offer: [-1, "-1"].includes(item.offer) ? 1 : item.offer
            })))
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: type === "new" })

    const { run: saveRun } = useRequest<{ [key: string]: any }>((data: any) => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil[type === "new" ? "post" : "put"](
                `/tower-supply/inquiryQuotation`,
                type === "new" ? data : ({ id, ...data })
            )
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    const resetFields = () => {
        form.resetFields()
        attachRef.current?.resetFields()
        setMaterials([])
    }

    const onSubmit = () => new Promise(async (resove, reject) => {
        try {
            const formData = await form.validateFields()
            await saveRun({
                manufacturer: formData.manufacturer,
                supplierId: formData.supplier?.value || data?.supplierId,
                supplierName: formData.supplier?.label || data?.supplierName,
                inquiryQuotationOfferDtos: materials.map((item: any) => ({
                    ...item,
                    comparisonPriceDetailId: item.comparisonPriceDetailId?item.comparisonPriceDetailId:item.id
                })),
                comparisonPriceId: params.id,
                fileIds: attachRef.current?.getDataSource().map(item => item.id)
            })
            resove(true)
        } catch (error) {
            reject(false)
        }
    })
    useImperativeHandle(ref, () => ({ onSubmit, resetFields }), [ref, onSubmit, resetFields])

    const handleChange = (id: string, value: number, name: string) => {
        setMaterials(materials.map((item: any) => item.id === id ?
            ({
                ...item,
                [name]: value,
                offer: calcObj.unTaxPrice(value, materialData?.taxVal)
            }) : item))
    }

    return <Spin spinning={loading && suplierLoading && materialLoading}>
        <DetailTitle title="询比价基本信息" />
        <BaseInfo
            classStyle="overall-form-class-padding0"
            form={form}
            col={2}
            columns={supplier.map((item: any) => {
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
                    label: data?.supplierName,
                    value: data?.supplierId
                } : undefined,
                manufacturer: data?.manufacturer
            }} edit />
        <DetailTitle title="询价原材料" />
        <CommonTable columns={addPriceHead.map((item: any) => {
            if (item.dataIndex === "taxOffer") {
                return ({
                    ...item,
                    render: (value: number, records: any) =>
                        <div style={{ padding: "2px 0" }}>
                            <InputNumber style={{ height: 28 }}
                                min={1} max={999999.99} step={0.01}
                                value={value}
                                key={records.materialCode}
                                onChange={(value: number) =>
                                    handleChange(records?.id, value, "taxOffer")
                                } />
                        </div>
                })
            }
            return item
        })}
            dataSource={materials} />
        <Attachment dataSource={data?.inquiryQuotationAttachInfoVos || []} ref={attachRef} edit />
    </Spin>
})