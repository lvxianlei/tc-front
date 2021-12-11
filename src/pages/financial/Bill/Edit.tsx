import React, { useImperativeHandle, forwardRef, useRef, useState } from "react"
import { Spin, Form } from 'antd'
import { DetailTitle, BaseInfo, Attachment, AttachmentRef } from '../../common'
import { bilinformation } from "../financialData.json"
import RequestUtil from '../../../utils/RequestUtil'
import useRequest from '@ahooksjs/use-request'
import { invoiceTypeOptions } from "../../../configuration/DictionaryOptions"
interface EditProps {
    type: "new" | "edit",
    id: string
}

export default forwardRef(function Edit({ type, id }: EditProps, ref) {
    const invoiceTypeEnum = invoiceTypeOptions?.map((item: { id: string, name: string }) => ({
        value: item.id,
        label: item.name
    }))
    const [bilinformationCoumns, setBilinformation] = useState<any[]>(bilinformation.map((item: any) => {
        if (item.dataIndex === "invoiceType") {
            return ({ ...item, type: "select", enum: invoiceTypeEnum })
        }
        return item
    }))
    const attchsRef = useRef<AttachmentRef>()
    const [baseForm] = Form.useForm()
    const { loading, data } = useRequest<{ [key: string]: any }>(() => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(`/tower-supply/invoice/${id}`)
            baseForm.setFieldsValue({
                ...result,
                receiptVos: result.receiptVos.map((item: any) => item.receiptNumber).join(",")
            })
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: type === "new", refreshDeps: [id] })

    const { run: saveRun } = useRequest<{ [key: string]: any }>((postData: any) => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil[type === "new" ? "post" : "put"](`/tower-supply/invoice`, { ...postData, id: data?.id })
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
                supplierName: baseData.supplierName.value || data?.supplierName,
                supplierId: baseData.supplierName.id || data?.supplierId,
                receiptDtos: baseData.receiptVos.records?.map((item: any) => ({
                    receiptId: item.id,
                    receiptNumber: item.receiveNumber
                })) || data?.receiptVos.map((item: any) => ({
                    receiptId: item.receiptId,
                    receiptNumber: item.receiptNumber,
                })),
                fileIds: attchsRef.current?.getDataSource().map(item => item.id)
            })
            resolve(true)
        } catch (error) {
            reject(false)
        }
    })
    const resetFields = () => {
        baseForm.resetFields()
        attchsRef.current?.resetFields()
    }
    const handleBaseInfoChange = (fields: any) => {
        if (fields.supplierName) {
            setBilinformation(bilinformationCoumns.map((item: any) => {
                if (item.dataIndex === "receiptVos") {
                    return ({ ...item, path: `${item.path}?supplierId=${fields.supplierName.id}` })
                }
                return item
            }))
        }
    }
    useImperativeHandle(ref, () => ({ onSubmit, resetFields }), [ref, onSubmit, resetFields])
    return <Spin spinning={loading}>
        <DetailTitle title="票据信息" />
        <BaseInfo form={baseForm} onChange={handleBaseInfoChange} columns={bilinformationCoumns} col={3} dataSource={{}} edit />
        <Attachment ref={attchsRef} edit />
    </Spin>
})