import React, { forwardRef, useImperativeHandle } from "react"
import { Spin, Form } from "antd"
import { DetailTitle, BaseInfo, CommonTable } from "../common"
import { editColums, oprationInfo, supplierFormHead } from "./supplier.json"
import RequestUtil from '../../utils/RequestUtil'
import useRequest from '@ahooksjs/use-request'
import ApplicationContext from "../../configuration/ApplicationContext"
interface EditProps {
    id: string
    type: "new" | "edit"
}
export default forwardRef(function Edit({ id, type }: EditProps, ref): JSX.Element {
    const [baseInfo] = Form.useForm()
    const [supplierForm] = Form.useForm()
    const supplierTypeEnum = (ApplicationContext.get().dictionaryOption as any)["144"].map((item: { id: string, name: string }) => ({ value: item.id, label: item.name }))
    const qualityAssuranceEnum = (ApplicationContext.get().dictionaryOption as any)["145"].map((item: { id: string, name: string }) => ({ value: item.id, label: item.name }))
    const { loading } = useRequest<{ [key: string]: any }>((data: any) => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(`/tower-supply/supplier/${id}`)
            baseInfo.setFieldsValue(result)
            supplierForm.setFieldsValue(result)
            resole(result)
        } catch (error) {
            reject(false)
        }
    }), { manual: type === "new", refreshDeps: [id] })

    const { run: saveRun } = useRequest<{ [key: string]: any }>((data: any) => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil[type === "new" ? "post" : "put"]("/tower-supply/supplier", type === "new" ? data : ({ ...data, id }))
            resole(result)
        } catch (error) {
            reject(false)
        }
    }), { manual: true })

    const onSubmit = () => new Promise(async (resove, reject) => {
        try {
            const baseData = await baseInfo.validateFields()
            const supplierFormData = await supplierForm.validateFields()
            await saveRun({
                ...baseData,
                ...supplierFormData
            })
            resove(true)
        } catch (error) {
            reject(false)
        }
    })
    useImperativeHandle(ref, () => ({ onSubmit }), [ref, onSubmit])
    return <Spin spinning={loading}>
        <DetailTitle title="供应商基础信息" />
        <BaseInfo form={baseInfo} columns={editColums.map((item: any) => {
            if (item.dataIndex === "supplierType") {
                return ({
                    ...item,
                    type: "select",
                    enum: supplierTypeEnum
                })
            }
            if (item.dataIndex === "qualityAssurance") {
                return ({
                    ...item,
                    type: "select",
                    enum: qualityAssuranceEnum
                })
            }
            return item
        })} dataSource={{}} edit />
        <DetailTitle title="供应商账户信息" />
        <BaseInfo col={2} form={supplierForm} columns={supplierFormHead} dataSource={{}} edit />
        <DetailTitle title="操作信息" />
        <CommonTable columns={oprationInfo} dataSource={[]} />
    </Spin>
})