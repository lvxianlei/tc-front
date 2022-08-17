import React, { forwardRef, useState, useImperativeHandle, useRef } from "react"
import { useParams } from "react-router-dom"
import { Form, Spin, InputNumber } from "antd"
import { addPriceHead, supplier } from "./enquiry.json"
import { BaseInfo, CommonTable, DetailTitle, Attachment, AttachmentRef } from "../../common"
import useRequest from '@ahooksjs/use-request'
import RequestUtil from '../../../utils/RequestUtil'
import { qualityAssuranceOptions } from "../../../configuration/DictionaryOptions"
interface AddPriceProps {
    id: string,
    type: "new" | "edit"
    materialLists: any[]
}
export default forwardRef(function ({ id, type, materialLists }: AddPriceProps, ref): JSX.Element {
    const [materials, setMaterials] = useState<any[]>(materialLists.map((item: any) => ({
        ...item,
        taxOffer: [-1, "-1"].includes(item.taxOffer) ? 1 : item.taxOffer,
        offer: [-1, "-1"].includes(item.offer) ? 1 : item.offer
    })) || [])
    const [form] = Form.useForm()
    const attachRef = useRef<AttachmentRef>()
    const params = useParams<{ id: string }>()
    const qualityAssuranceEnum = qualityAssuranceOptions?.map((item: { id: string, name: string }) => ({ value: item.id, label: item.name }))
    const { loading, data } = useRequest<{ [key: string]: any }>(() => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(`/tower-supply/inquiryQuotation/${id}`)
            form.setFieldsValue({ supplier: { id: result.supplierId, value: result.supplierName } })
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
            const result: { [key: string]: any } = await RequestUtil[type === "new" ? "post" : "put"](`/tower-supply/inquiryQuotation`, type === "new" ? data : ({ id, ...data }))
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
                supplierId: formData.supplier?.id || data?.supplierId,
                supplierName: formData.supplier?.value || data?.supplierName,
                inquiryQuotationOfferDtos: materials.map((item: any) => {
                    type === "new" && delete item.id
                    return item
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

    const handleChange = (id: string, value: number, name: string) => {
        console.log(id, materials, materials)
        // 不含税报价 = 含税报价 - （含税报价 * 材料税率）
        // 材料税率 目前是写死 13%
        setMaterials(materials.map((item: any) => item.id === id ?
            ({
                ...item,
                [name]: value,
                offer: value - (value * 0.13),
            }) : item))
    }

    return <Spin spinning={loading}>
        <DetailTitle title="询比价基本信息" />
        <BaseInfo classStyle={"overall-form-class-padding0"} form={form} col={1} columns={supplier.map((item: any) => {
            if (item.dataIndex === 'supplier') {
                return ({
                    ...item, search: item.search.map((res: any) => {
                        if (res.dataIndex === 'qualityAssurance') {
                            return ({
                                ...res,
                                enum: qualityAssuranceEnum
                            })
                        }
                        return res
                    })
                })
            }
            return item
        })} dataSource={{}} edit />
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