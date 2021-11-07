import React, { useState, useImperativeHandle, forwardRef } from "react"
import { Button, Upload, Form } from 'antd'
import { DetailContent, DetailTitle, BaseInfo, CommonTable } from '../../common'
import { ApplicationList } from "../financialData.json"
import RequestUtil from '../../../utils/RequestUtil'
import AuthUtil from "../../../utils/AuthUtil"
import { downLoadFile } from "../../../utils"
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
    const [attchs, setAttachs] = useState<any[]>([])

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
    }), { manual: type === "new" })

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
                supplierId: baseData.supplierName.id,
                supplierName: baseData.supplierName.value,
                applyPaymentInvoiceDtos: baseData.relatednotes.records.map((item: any) => ({ invoiceId: item.id, billNumber: item.billNumber }))
            })
            resolve(true)
        } catch (error) {
            reject(false)
        }
    })

    useImperativeHandle(ref, () => ({ onSubmit }), [ref, onSubmit])

    const uploadChange = (event: any) => {
        if (event.file.status === "done") {
            if (event.file.response.code === 200) {
                const dataInfo = event.file.response.data
                const fileInfo = dataInfo.name.split(".")
                setAttachs([...attchs, {
                    id: "",
                    uid: attchs.length,
                    link: dataInfo.link,
                    name: dataInfo.originalName.split(".")[0],
                    description: "",
                    filePath: dataInfo.name,
                    fileSize: dataInfo.size,
                    fileSuffix: fileInfo[fileInfo.length - 1],
                    userName: dataInfo.userName,
                    fileUploadTime: dataInfo.fileUploadTime
                }])
            }
        }
    }
    const handleBaseInfoChange = (fields: any) => {
        if (fields.relatednotes) {
            console.log(fields.records)
        }
    }
    const deleteAttachData = (id: number) => {
        setAttachs(attchs.filter((item: any) => item.uid ? item.uid !== id : item.id !== id))
    }

    return <DetailContent>
        <DetailTitle title="申请信息" />
        <BaseInfo form={baseForm} onChange={handleBaseInfoChange} columns={ApplicationList.map((item: any) => {
            if (item.dataIndex === "relatednotes") {
                return ({
                    ...item,
                    columns: item.columns.map((item: any) => item.dataIndex === "invoiceType" ? ({ ...item, enum: invoiceTypeEnum }) : item)
                })
            }

            if(item.dataIndex==="pleasePayType"){
                return ({...item,type:"select",enum:pleasePayTypeEnum});
            }
            if(item.dataIndex==="paymentMethod"){
                return ({...item,type:"select",enum:paymentMethodEnum});
            }
            return item;
        })} col={3} dataSource={{}} edit />
        <CommonTable columns={[
            {
                title: "附件名称",
                dataIndex: "name"
            },
            {
                title: "操作",
                dataIndex: "opration",
                render: (_: any, record: any) => (<>
                    <Button type="link" onClick={() => deleteAttachData(record.uid || record.id)}>删除</Button>
                    <Button type="link" onClick={() => downLoadFile(record.link || record.filePath)}>下载</Button>
                </>)
            }]} dataSource={attchs} />
    </DetailContent>
})