import React, { forwardRef, useImperativeHandle } from "react"
import { Form, Spin } from "antd"
import { Attachment, BaseInfo, DetailTitle } from "../../../common"
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
            const data: { [key: string]: any } = await RequestUtil.get(`/tower-system/doc/detail`, { id })
            resole(data)
        } catch (error) {
            console.log(error)
            reject(error)
        }
    }), { manual: id === "create" })

    const { loading: confirmLoading, run: saveRun } = useRequest((params: any) => new Promise(async (resole, reject) => {
        const data: any = await RequestUtil[id === "create" ? "post" : "put"](`/tower-system/doc`, params)
        resole(data)
    }), { manual: true })

    const handleSave = () => new Promise(async (resove, reject) => {
        try {
            const saveData = await form.validateFields()
            const postData = id === "create" ? saveData : {
                ...saveData,
                id
            }

            await saveRun({
                ...postData,
                tag: postData.tag?.map((item: any) => item.value).join(","),
                typeId: postData.typeId?.value,
                typeName: postData.typeId?.label,

                approvalProcessId: postData.approvalProcessId?.value,
                approvalProcessName: postData.approvalProcessId?.label,

                drafterId: postData.drafterId?.id,
                drafterName: postData.drafterId?.value,

                receiveIds: postData.receiveIds?.id,
                receiveNames: postData.receiveIds?.value,

                useDept: postData.useDept?.records?.map((item: any) => item.id).join(","),
                useDeptNames: postData.useDept?.records?.map((item: any) => item.name).join(","),
            })
        } catch (error) {
            console.log(error)
            reject(error)
        }
    })

    useImperativeHandle(ref, () => ({ confirmLoading, onSave: handleSave }), [confirmLoading, handleSave])

    return <Spin spinning={loading}>
        <DetailTitle title="基本信息" />
        <BaseInfo
            form={form}
            col={3}
            edit
            columns={edit.base.map((item: any) => {
                if (item.dataIndex === "typeId") {
                    return ({
                        ...item,
                        transformData: (data: any) => data?.records?.map((item: any) => ({
                            label: item.name,
                            value: item.id
                        }))
                    })
                }
                if (item.dataIndex === "approvalProcessId") {
                    return ({
                        ...item,
                        transformData: (data: any) => data?.records?.map((item: any) => ({
                            label: item.name,
                            value: item.id
                        }))
                    })
                }
                return item
            })}
            dataSource={{
                ...data,
                drafterId: {
                    id: data?.drafterId,
                    value: data?.drafterName
                },
                receiveIds: {
                    id: data?.receiveIds,
                    value: data?.receiveNames,
                    records: data?.receiveIds?.split(",").map((item: string, index: number) => ({
                        id: item,
                        name: data?.receiveNames.split(",")[index]
                    })) || []
                },
                useDept: {
                    id: data?.useDept,
                    value: data?.useDeptNames,
                    records: data?.useDept?.split(",").map((item: string) => ({
                        id: item
                    })) || []
                },
                typeId: data?.typeId ? {
                    value: data?.typeId,
                    label: data?.typeName,
                } : undefined,
                approvalProcessId: data?.approvalProcessId ? {
                    value: data?.approvalProcessId,
                    label: data?.approvalProcessName,
                } : undefined
            }}
        />
        <Attachment />
    </Spin>
})