import React, { forwardRef, useImperativeHandle } from "react"
import { Form, Spin } from "antd"
import { BaseInfo, DetailTitle } from "../../../common"
import useRequest from "@ahooksjs/use-request"
import RequestUtil from "@utils/RequestUtil"
import { edit } from "./data.json"
interface EditProps {
    id: "create" | string
}

export default forwardRef(function Edit({ id }: EditProps, ref) {
    const [form] = Form.useForm()

    const { loading, data } = useRequest<{ [key: string]: any }>(() => new Promise(async (resole, reject) => {
        try {
            const data: { [key: string]: any } = await RequestUtil.get(`/tower-system/unit/${id}`)
            resole(data)
        } catch (error) {
            console.log(error)
            reject(error)
        }
    }), { manual: id === "create" })

    const { loading: confirmLoading, run: saveRun } = useRequest((params: any) => new Promise(async (resole, reject) => {
        const data: any = await RequestUtil[id === "create" ? "post" : "put"](`/tower-system/unit`, params)
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
            unitTypeId: postData.unitTypeId?.value,
            unitTypeName: postData.unitTypeId?.label,
        })
    }

    useImperativeHandle(ref, () => ({ confirmLoading, onSave: handleSave }), [confirmLoading, handleSave])

    return <Spin spinning={loading}>
        <DetailTitle title="基本信息" />
        <BaseInfo
            form={form}
            col={2}
            edit
            columns={edit.base.map((item: any) => {
                if (item.dataIndex === "unitTypeId") {
                    return ({
                        ...item,
                        transformData: (data: any) => data.records.map((item: any) => ({
                            label: item.name,
                            value: item.id
                        }))
                    })
                }
                return item
            })}
            dataSource={{
                ...data,
                unitTypeId: data?.unitTypeId ? {
                    value: data?.unitTypeId,
                    label: data?.unitTypeName
                } : undefined
            }}
        />
    </Spin>
})