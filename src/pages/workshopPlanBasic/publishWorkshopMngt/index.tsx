import useRequest from "@ahooksjs/use-request"
import { Button, Form, Space, Spin } from "antd"
import React, { useCallback, useState } from "react"
import RequestUtil from "../../../utils/RequestUtil"
import { DetailContent, EditableTable, CommonTable } from "../../common"
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

    const {  } = useRequest<any>(() => new Promise(async (resole, reject) => {
        try {
            const result: any = await RequestUtil.get(`/tower-aps/workshop/config/list`);
            resole(result)
        } catch (error) {
            reject(error)
        }
    }))

    const handleSubmit = async () => {
        const submitData = await form.validateFields()
        console.log(submitData, "--------")
    }

    return <DetailContent>
        <Spin spinning={loading}>
            {edit && <EditableTable
                form={form}
                opration={[
                    <Button type="primary" key="edit" onClick={handleSubmit}>保存</Button>
                ]}
                columns={pageTable}
                haveIndex={false}
                dataSource={data?.records}
            />}
            {!edit && <>
                <Space size={16} style={{ marginBottom: 16 }}>
                    <Button type="primary" onClick={handleEditClick}>编辑</Button>
                </Space>
                <CommonTable columns={pageTable} dataSource={data?.records} />
            </>}
        </Spin>
    </DetailContent>
}