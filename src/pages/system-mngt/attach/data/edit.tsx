import React, { forwardRef, useImperativeHandle, useRef, useState } from "react"
import { useHistory } from "react-router-dom"
import { Form, message, Modal, Spin } from "antd"
import { BaseInfo, DetailTitle, EditableTable } from "../../../common"
import Attachment from "./Attach"
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
    const attachRef = useRef<any>()
    const history = useHistory()
    const [form] = Form.useForm()
    const [modalForm] = Form.useForm()
    const [visible, setVisible] = useState<boolean>(false)
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
                tag: postData.tag?.map((item: any) => item.value).join(","),

                typeCode: postData.typeCode?.value,
                typeName: postData.typeCode?.label,

                approvalProcessCode: postData.approvalProcessCode?.value,
                approvalProcessName: postData.approvalProcessCode?.label,

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

    const handleModalOk = () => new Promise(async (resove, reject) => {
        const version = await modalForm.validateFields()
        const saveData = await form.validateFields()
        const postData = id === "create" ? saveData : {
            ...saveData,
            id
        }
        await saveRun({
            ...postData,
            versionType: version.versionType,
            tag: postData.tag?.map((item: any) => item.value).join(","),
            typeCode: postData.typeCode?.value,
            typeName: postData.typeCode?.label,

            approvalProcessCode: postData.approvalProcessCode?.value,
            approvalProcessName: postData.approvalProcessCode?.label,

            drafterId: postData.drafterId?.id,
            drafterName: postData.drafterId?.value,

            receiveIds: postData.receiveIds?.id,
            receiveNames: postData.receiveIds?.value,

            useDept: postData.useDept?.records?.map((item: any) => item.id).join(","),
            useDeptNames: postData.useDept?.records?.map((item: any) => item.name).join(","),
            fileIds: attachRef.current?.getDataSource()?.map((item: any) => item.id)
        })
        await message.success("保存成功...")
        setVisible(false)
        resove(true)
        history.go(0)
    })

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
                                "value": 1
                            },
                            {
                                "label": "小版本",
                                "value": 2
                            }
                        ]
                    }]}
                dataSource={{ versionType: 2 }} />
        </Modal>
        <Spin spinning={loading}>
            <DetailTitle title="基本信息" />
            <BaseInfo
                form={form}
                col={3}
                edit
                columns={edit.base.map((item: any) => {
                    if (item.dataIndex === "typeCode") {
                        return ({
                            ...item,
                            transformData: (data: any) => data?.records?.map((item: any) => ({
                                label: item.name,
                                value: item.code
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
                    if (item.dataIndex === "approvalProcessCode") {
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
                    tag: data?.tag ? data?.tag.split(",").map((item: string) => ({
                        label: item,
                        value: item
                    })) : [],

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
                    typeCode: {
                        value: data?.typeCode || parent?.code,
                        label: data?.typeName || parent?.title
                    },
                    approvalProcessCode: data?.approvalProcessCode ? {
                        value: data?.approvalProcessCode,
                        label: data?.approvalProcessName,
                    } : undefined
                }}
            />
            <DetailTitle title="信息提醒" />
            <EditableTable columns={edit.messageWarn.map((item: any) => {
                if (item.type === "addUser") {
                    return ({
                        ...item,
                        render: (value: any, _record: any, index: number) => <Form.Item
                            style={{ margin: 0 }}
                            name={['submit', index, item.dataIndex]}>
                            
                        </Form.Item>
                    })
                }
                return item
            })} dataSource={[]} />
            <Attachment edit ref={attachRef} dataSource={data?.attachInfoVos} />
        </Spin>
    </>
})