import React, { forwardRef, useImperativeHandle, useRef, useState } from "react"
import { Form, message, Modal, Spin } from "antd"
import { BaseInfo, DetailTitle } from "../../../common"
import Attachment from "./Attach"
import useRequest from "@ahooksjs/use-request"
import RequestUtil from "@utils/RequestUtil"
import { edit } from "./data.json"
import { useHistory } from "react-router-dom"
interface EditProps {
    id: "create" | string
}

export default forwardRef(function Edit({ id }: EditProps, ref) {
    const attachRef = useRef<any>()
    const history = useHistory()
    const [form] = Form.useForm()
    const [modalForm] = Form.useForm()
    const [visible, setVisible] = useState<boolean>(false)
    const [versionType, setVersionType] = useState<1 | 2>(1)
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
            if (id !== "create") {
                setVisible(true)
                return
            }
            const postData = id === "create" ? saveData : {
                ...saveData,
                id
            }
            await saveRun({
                ...postData,
                versionType,
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
                fileIds: attachRef.current?.getDataSource()?.map((item: any) => item.id)
            })
            message.success("保存成功...")
            resove(true)
            history.go(0)
        } catch (error) {
            console.log(error)
            reject(error)
        }
    })

    useImperativeHandle(ref, () => ({ confirmLoading, onSave: handleSave }), [confirmLoading, handleSave])

    const handleModalOk = async () => {
        const vision = await modalForm.validateFields()
        const saveData = await form.validateFields()
        const postData = id === "create" ? saveData : {
            ...saveData,
            id
        }
        await saveRun({
            ...postData,
            versionType,
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
            fileIds: attachRef.current?.getDataSource()?.map((item: any) => item.id)
        })
        await message.success("保存成功...")
        setVersionType(vision.versionType)
        setVisible(false)
    }

    return <>
        <Modal
            title="选择版本类型"
            visible={visible}
            width={550}
            destroyOnClose
            onCancel={() => setVisible(false)}
            onOk={handleModalOk}
        >
            <BaseInfo
                form={modalForm}
                edit
                col={2}
                columns={[
                    {
                        "title": "版本类型",
                        "dataIndex": "versionType",
                        "required": true,
                        "type": "select",
                        "enum": [
                            {
                                "label": "大版本",
                                "value": 2
                            },
                            {
                                "label": "小版本",
                                "value": 1
                            }
                        ]
                    }]}
                dataSource={{ versionType: 1 }} />
        </Modal>
        <Spin spinning={loading}>
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
                    if (item.dataIndex === "tag") {
                        return ({
                            ...item,
                            transformData: (data: any) => data.map((item: any) => ({
                                value: item,
                                label: item
                            }))
                        })
                    }
                    if (item.dataIndex === "approvalProcessId") {
                        return ({
                            ...item,
                            transformData: (data: any) => data?.records?.map((item: any) => ({
                                label: item.name,
                                value: item.code
                            }))
                        })
                    }
                    return item
                })}
                dataSource={{
                    ...data,
                    tag: data?.tag ? data?.tag.split(",") : [],
                    drafterId: {
                        id: data?.drafterId,
                        value: data?.drafterName
                    },
                    receiveIds: {
                        id: data?.receiveIds,
                        value: data?.receiveNames,
                        records: data?.receiveIds?.split(",").map((item: string, index: number) => ({
                            userId: item,
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
            <Attachment edit ref={attachRef} dataSource={data?.attachInfoVos} />
        </Spin>
    </>
})