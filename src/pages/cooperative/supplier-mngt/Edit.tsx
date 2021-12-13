import React, { forwardRef, useImperativeHandle } from "react"
import { Spin, Form, Select } from "antd"
import { DetailTitle, BaseInfo, CommonTable } from "../../common"
import { editColums, oprationInfo, supplierFormHead } from "./supplier.json"
import RequestUtil from '../../../utils/RequestUtil'
import useRequest from '@ahooksjs/use-request'
import ApplicationContext from "../../../configuration/ApplicationContext"
import { bankTypeOptions, qualityAssuranceOptions, supplierTypeOptions, supplyProductsOptions } from "../../../configuration/DictionaryOptions"
interface EditProps {
    id: string
    type: "new" | "edit"
}
export default forwardRef(function Edit({ id, type }: EditProps, ref): JSX.Element {
    const [baseInfo] = Form.useForm()
    const [supplierForm] = Form.useForm()
    const supplierTypeEnum = supplierTypeOptions?.map((item: { id: string, name: string }) => ({ value: item.id, label: item.name }))
    const qualityAssuranceEnum = qualityAssuranceOptions?.map((item: { id: string, name: string }) => ({ value: item.id, label: item.name }))
    const supplyProductsEnum = supplyProductsOptions?.map((item: { id: string, name: string }) => ({ value: item.id, label: item.name }))
    const { loading } = useRequest<{ [key: string]: any }>((data: any) => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(`/tower-supply/supplier/${id}`)
            baseInfo.setFieldsValue({ ...result, supplyProducts: result.supplyProducts.split(",") })
            supplierForm.setFieldsValue({ ...result, bankDepositId: result.bankDepositId + ',' + result.bankDepositName})
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
                ...supplierFormData,
                supplyProducts: baseData.supplyProducts.join(","),
                bankDepositId: supplierFormData.bankDepositId.split(',')[0],
                bankDepositName: supplierFormData.bankDepositId.split(',')[1]
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
            switch (item.dataIndex) {
                case "supplierType":
                    return ({
                        ...item,
                        type: "select",
                        enum: supplierTypeEnum
                    })
                case "supplyProducts":
                    return ({
                        ...item,
                        type: "select",
                        mode: "tags",
                        enum: supplyProductsEnum,
                        maxTagCount: 'responsive'
                    })
                case "qualityAssurance":
                    return ({
                        ...item,
                        type: "select",
                        enum: qualityAssuranceEnum
                    })
                default:
                    return item
            }
        })} dataSource={{}} edit />
        <DetailTitle title="供应商账户信息" />
        <BaseInfo col={2} form={supplierForm} columns={supplierFormHead.map((item: any) => {
            switch (item.dataIndex) {
                case "bankDepositId":
                    return ({ ...item, render: (data: any, props: any) => {
                        return <Form.Item name="bankDepositId">
                            <Select placeholder="请选择">
                                { bankTypeOptions && bankTypeOptions.map(({ id, name }, index) => {
                                    return <Select.Option key={index} value={id + ',' +name}>
                                        {name}
                                    </Select.Option>
                                }) }
                            </Select>
                        </Form.Item>
                    } })
                default:
                    return item
            }
        })} dataSource={{}} edit />
        <DetailTitle title="操作信息" />
        <CommonTable columns={oprationInfo} dataSource={[]} />
    </Spin>
})