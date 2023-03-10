import React, { forwardRef, useImperativeHandle } from "react"
import { Form } from "antd"
import useRequest from "@ahooksjs/use-request"
import RequestUtil from "@utils/RequestUtil"
import { edit } from "./data.json"
import { BaseInfo } from "../../common"
export interface RowData {
    productTypeName?: string,
    id?: string
}

interface EditProps {
    data: RowData
}

export default forwardRef(function Edit({ data }: EditProps, ref) {
    const [form] = Form.useForm()

    const { loading: confirmLoading, run: saveRun } = useRequest((params: any) => new Promise(async (resole, reject) => {

        const result: any = await RequestUtil[data.id ? "put" : "post"](`/tower-system/productType`, params)
        resole(result)
    }), { manual: true })

    const handleSave = async () => {
        const saveData = await form.validateFields()
        const postData = data.id ? {
            ...saveData,
            id: data.id
        } : saveData
        await saveRun(postData)
    }

    useImperativeHandle(ref, () => ({ confirmLoading, onSave: handleSave }), [confirmLoading, handleSave])

    return <BaseInfo
        form={form}
        col={2}
        edit
        columns={edit.base}
        dataSource={data || {}}
    />
})