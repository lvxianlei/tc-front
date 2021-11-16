import React, { forwardRef, useState, useImperativeHandle, useRef } from "react"
import { useParams } from "react-router-dom"
import { Form, Spin, InputNumber } from "antd"
import { addPriceHead } from "./enquiry.json"
import { BaseInfo, CommonTable, DetailTitle, Attachment, AttachmentRef } from "../../common"
import useRequest from '@ahooksjs/use-request'
import RequestUtil from '../../../utils/RequestUtil'
interface AddPriceProps {
    id: string,
    type: "new" | "edit"
    materialLists: any[]
}
export default forwardRef(function ({ id, type, materialLists }: AddPriceProps, ref): JSX.Element {
    const [materials, setMaterials] = useState<any[]>(materialLists || [])
    const [form] = Form.useForm()
    const attachRef = useRef<AttachmentRef>()
    const params = useParams<{ id: string }>()
    const { loading, data } = useRequest<{ [key: string]: any }>(() => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(`/tower-supply/inquiryQuotation/${id}`)
            form.setFieldsValue({ supplier: result.supplierName })
            setMaterials(result?.inquiryQuotationOfferVos)
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
                inquiryQuotationAttachInfoDtos: attachRef.current?.getDataSource()
            })
            resove(true)
        } catch (error) {
            reject(false)
        }
    })
    useImperativeHandle(ref, () => ({ onSubmit, resetFields }), [ref, onSubmit])
    const handleChange = (id: string, value: number, name: string) => {
        setMaterials(materials.map((item: any) => item.materialCode === id ? ({ ...item, [name]: value }) : item))
    }

    return <Spin spinning={loading}>
        <DetailTitle title="询比价基本信息" />
        <BaseInfo form={form} col={1} columns={[{
            "title": "供应商",
            "dataIndex": "supplier",
            "type": "popTable",
            "path": "/tower-supply/supplier",
            "width": 1011,
            "value": "supplierName",
            "dependencies": true,
            "readOnly": true,
            "columns": [
                {
                    "title": "供应商编号",
                    "dataIndex": "supplierCode"
                },
                {
                    "title": "供应商名称",
                    "dataIndex": "supplierName"
                },
                {
                    "title": "联系人",
                    "dataIndex": "contactMan"
                },
                {
                    "title": "联系电话",
                    "dataIndex": "contactManTel"
                },
                {
                    "title": "供货产品",
                    "dataIndex": "supplyProductsName"
                }
            ],
            "rules": [
                {
                    "required": true,
                    "message": "请选择供应商..."
                }
            ]
        }]} dataSource={{}} edit />
        <DetailTitle title="询价原材料" />
        <CommonTable columns={addPriceHead.map((item: any) => {
            if (item.dataIndex === "taxOffer") {
                return ({ ...item, render: (value: number, records: any) => <InputNumber min={1} max={999999.99} step={0.01} value={[-1, "-1"].includes(value) ? 1 : value} key={records.materialCode} onChange={(value: number) => handleChange(records.materialCode, value, "taxOffer")} /> })
            }
            if (item.dataIndex === "offer") {
                return ({ ...item, render: (value: number, records: any) => <InputNumber min={1} max={999999.99} step={0.01} value={[-1, "-1"].includes(value) ? 1 : value} key={records.materialCode} onChange={(value: number) => handleChange(records.materialCode, value, "offer")} /> })
            }
            return item
        })} dataSource={materials} />
        <Attachment dataSource={data?.inquiryQuotationAttachInfoVos || []} ref={attachRef} edit />
    </Spin>
})