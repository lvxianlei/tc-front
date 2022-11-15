import { Form, Spin } from "antd"
import React, { forwardRef, useImperativeHandle } from "react"
import { BaseInfo, DetailTitle } from "../../../common"
import useRequest from "@ahooksjs/use-request"
import RequestUtil from "@utils/RequestUtil"
import { edit } from "./data.json"
interface ParentData {
    code: string,
    title: string,
    id: string
}

interface EditProps {
    id: "create" | string
    parent?: ParentData
}

export default forwardRef(function Edit({ id, parent }: EditProps, ref) {
    const [form] = Form.useForm()

    const { loading, data } = useRequest<{ [key: string]: any }>(() => new Promise(async (resole, reject) => {
        try {
            const data: { [key: string]: any } = await RequestUtil.get(`/tower-system/docType/${id}`)
            resole(data)
        } catch (error) {
            console.log(error)
            reject(error)
        }
    }), { manual: id === "create" })

    const { loading: confirmLoading, run: saveRun } = useRequest((params: any) => new Promise(async (resole, reject) => {
        const data: any = await RequestUtil[id === "create" ? "post" : "put"](`/tower-system/docType`, params)
        resole(data)
    }), { manual: true })

    const handleSave = async () => {
        const saveData = await form.validateFields()
        const postData = id === "create" ? saveData : {
            ...saveData,
            id
        }
        await saveRun({
            ...postData,
            parentId: data?.parentId || parent?.id,
            parentName: data?.parentId || parent?.title,
        })
    }

    useImperativeHandle(ref, () => ({ confirmLoading, onSave: handleSave }), [confirmLoading, handleSave])

    return <Spin spinning={loading}>
        <DetailTitle title="基本信息" />
        <BaseInfo
            form={form}
            col={2}
            edit
            columns={edit.base}
            dataSource={data || {}}
        />
    </Spin>
})