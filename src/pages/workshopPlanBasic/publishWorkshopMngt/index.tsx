import useRequest from "@ahooksjs/use-request"
import { Button, Form, message, Space, Spin } from "antd"
import React, { useCallback, useState } from "react"
import RequestUtil from "../../../utils/RequestUtil"
import { DetailContent, EditableTable, CommonAliTable } from "../../common"
import { pageTable } from "./data.json"
export default function Index(): React.ReactElement {
    const [form] = Form.useForm()
    const [edit, setEdit] = useState<boolean>(false)
    const handleEditClick = useCallback(() => setEdit(true), [setEdit])
    const { loading, data } = useRequest<any>(() => new Promise(async (resole, reject) => {
        try {
            const result: any = await RequestUtil.get(`/tower-aps/workshop/config/list`);
            resole(result)
        } catch (error) {
            reject(error)
        }
    }))

    const { loading: saveLoading, run: saveRun } = useRequest<any>(() => new Promise(async (resole, reject) => {
        try {
            const result: any = await RequestUtil.post(`/tower-aps/workshop/config`);
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    const handleSubmit = async () => {
        const submitData = await form.validateFields()
        const groupIds = data?.records.filter((item: any) => !submitData.submit.map((sItem: any) => sItem.id).includes(item.id))
        await saveRun({
            groupIds,
            workshopConfigs: submitData.submit.map((item: any) => {
                delete item.id;
                return item
            })
        })
        message.success("保存成功...")
        setEdit(false)
    }

    return <DetailContent>
        <Spin spinning={loading}>
            {edit && <EditableTable
                form={form}
                opration={[
                    <Button type="primary" loading={saveLoading} key="edit" onClick={handleSubmit}>保存</Button>
                ]}
                columns={pageTable}
                haveIndex={false}
                dataSource={data?.records}
            />}
            {!edit && <>
                <Space size={16} style={{ marginBottom: 16 }}>
                    <Button type="primary" onClick={handleEditClick}>编辑</Button>
                </Space>
                <CommonAliTable columns={pageTable} dataSource={data?.records} />
            </>}
        </Spin>
    </DetailContent>
}