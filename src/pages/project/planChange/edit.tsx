import React, { forwardRef, useImperativeHandle } from "react"
import { Button, Form, Row, Spin } from "antd"
import { BaseInfo, DetailContent, DetailTitle, EditableTable } from "../../common"
import { edit } from "./data.json"
import useRequest from "@ahooksjs/use-request"
import RequestUtil from "@utils/RequestUtil"
interface EditProps {
    id: string
    type: 1 | 2 | 3
}

export default forwardRef(function Edit({ id, type }: EditProps, ref) {
    const [editForm] = Form.useForm()
    const [contentForm] = Form.useForm()
    const [suspendForm] = Form.useForm()
    const { loading, data: planData } = useRequest<{ [key: string]: any }>(() => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(`/tower-market/editNotice/detail?id=${id}`)
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: id === "create" })

    const { run: saveRun } = useRequest((postData) => new Promise(async (resolve, reject) => {
        try {
            const result: any = await RequestUtil[id === "create" ? "post" : "put"]("/tower-market/editNotice", postData)
            resolve(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    const handleEditChange = (fields: any) => {
        if (fields.taskNoticeId) {
            const taskNotice = fields.taskNoticeId.records[0]
            editForm.setFieldsValue({
                internalNumber: taskNotice.internalNumber,
                orderProjectName: taskNotice.orderProjectName,
                editBaseNum: taskNotice.editBaseNum,
                editWeight: taskNotice.editWeight,
                ascriptionName: taskNotice.ascriptionName,
                region: taskNotice.region
            })
        }
    }

    const handleSubmit = async () => {
        const postData = await editForm.validateFields()
        await saveRun({
            editType: type,
            taskNoticeId: postData.taskNoticeId?.id
        })
    }

    useImperativeHandle(ref, () => ({ handleSubmit }), [])

    return <Spin spinning={loading}>
        <DetailContent>
            <DetailTitle title="基础信息" />
            <BaseInfo
                col={4}
                edit
                form={editForm}
                columns={edit.base}
                onChange={handleEditChange}
                dataSource={planData || {}}
            />
            {type === 1 && <EditableTable form={contentForm} columns={edit.content} dataSource={[]} />}
            {[2, 3].includes(type) && <>
                <Row>
                    <Button type="primary" ghost>选择杆塔</Button>
                </Row>
                <EditableTable haveNewButton={false} form={suspendForm} columns={edit.suspend} dataSource={[]} />
            </>}
        </DetailContent>
    </Spin>
})