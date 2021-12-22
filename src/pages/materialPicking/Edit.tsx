import React, { useImperativeHandle, forwardRef } from "react"
import { Button, Form, Spin } from 'antd'
import { useParams } from 'react-router-dom'
import { DetailTitle, BaseInfo, CommonTable, PopTable } from '../common'
import { setting, materialInfo, chooseMaterial } from "./picking.json"
import RequestUtil from '../../utils/RequestUtil'
import useRequest from '@ahooksjs/use-request'
export interface EditProps {
    type: "new" | "edit",
    ref?: React.RefObject<{ onSubmit: () => Promise<any> }>
    id: string
}

export default forwardRef(function Edit({ type, id }: EditProps, ref) {
    const params = useParams<{ id: string }>()
    const [baseForm] = Form.useForm()
    const { loading, data } = useRequest<{ [key: string]: any }>(() => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(`/tower-market/invoicing/getInvoicingInfo/${params.id}`)
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: type === "new" })

    const { run: saveRun } = useRequest<{ [key: string]: any }>((id) => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(`/tower-market/taskNotice/getLogicWeightByContractId?contractId=
            ${id}`)
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    const onSubmit = (saveType?: "save" | "saveAndApply") => new Promise(async (resolve, reject) => {
        try {
            const baseData = await baseForm.validateFields()
            const postData = type === "new" ? {
                ...baseData,

            } : {
                ...baseData
            }
            await saveRun(postData, saveType)
            resolve(true)
        } catch (error) {
            reject(false)
        }
    })

    const handleBaseInfoChange = async (fields: any) => {
        if (fields.contractCode) {
            const contractValue = fields.contractCode.records[0]
            baseForm.setFieldsValue({

            })
        }
    }

    useImperativeHandle(ref, () => ({ onSubmit }), [ref, onSubmit])

    return <Spin spinning={loading}>
        <PopTable data={chooseMaterial as any} />
        <DetailTitle title="基础信息" />
        <BaseInfo
            onChange={handleBaseInfoChange}
            form={baseForm}
            columns={setting}
            col={3}
            dataSource={{}} edit />
        <DetailTitle title="原材料信息" operation={[
            <Button type="primary" ghost>选择原材料</Button>
        ]} />
        <CommonTable columns={materialInfo} dataSource={[]} />
    </Spin>
})