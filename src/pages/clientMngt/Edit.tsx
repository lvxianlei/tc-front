import React from "react"
import { Button, Form, message, Spin } from "antd"
import { useHistory, useParams } from "react-router"
import { BaseInfo, DetailContent, DetailTitle } from "../common"
import useRequest from "@ahooksjs/use-request"
import RequestUtil from "../../utils/RequestUtil"
import { setting, invoice } from "./clientMegt.json"
import { clientTypeOptions } from "../../configuration/DictionaryOptions"
interface EditProps {
    type: "new" | "edit",
    id: string
}
export default function Edit(): JSX.Element {
    const history = useHistory()
    const { type, id } = useParams<EditProps>()
    const [baseForm] = Form.useForm()
    const [invoiceForm] = Form.useForm()
    const { loading, data } = useRequest<{ [key: string]: any }>(() => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(`/tower-customer/customer/${id}`)
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: type === "new", refreshDeps: [id] })

    const { loading: saveLoading, run: saveRun } = useRequest<{ [key: string]: any }>((postData: any) => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil[type === "new" ? "post" : "put"](`/tower-customer/customer`, { ...postData, id: data?.id })
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    const onSubmit = () => new Promise(async (resolve, reject) => {
        try {
            const baseData = await baseForm.validateFields()
            await saveRun({
                ...baseData
            })
            message.success("保存成功...")
            history.goBack()
            resolve(true)
        } catch (error) {
            reject(false)
        }
    })
    return <DetailContent operation={[
        <Button
            key="save"
            type="primary"
            style={{ marginRight: 16 }}
            loading={saveLoading}
            onClick={onSubmit}>保存</Button>,
        <Button key="cancel" type="primary" style={{ marginRight: 16 }} onClick={() => history.goBack()}>取消</Button>,
    ]}>
        <Spin spinning={loading}>
            <DetailTitle title="基本信息" />
            <BaseInfo form={baseForm} columns={setting.map((item: any) => {
                if (item.dataIndex === "type") {
                    return ({
                        ...item,
                        enum: clientTypeOptions?.map(item => ({
                            value: item.id,
                            label: item.name
                        }))
                    })
                }
                return item
            })} dataSource={data || {}} edit />
            <DetailTitle title="发票信息" />
            <BaseInfo form={invoiceForm} columns={invoice} dataSource={data || {}} edit />
        </Spin>
    </DetailContent>
}