import React from "react"
import { useHistory, useParams } from "react-router"
import { Spin, Form, Button, message } from 'antd'
import { DetailTitle, BaseInfo, DetailContent } from '../common'
import RequestUtil from '../../utils/RequestUtil'
import useRequest from '@ahooksjs/use-request'
import { setting, payInfo } from "./clientMngt.json"
import { clientTypeOptions, bankTypeOptions } from "../../configuration/DictionaryOptions"
interface EditProps {
    type: "new" | "edit",
    id: string
}

export default function Edit() {
    const history = useHistory()
    const { type, id } = useParams<EditProps>()
    const [baseForm] = Form.useForm()
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
            await saveRun(baseData)
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
        <Button key="cancel" type="primary" ghost onClick={() => history.goBack()}>取消</Button>
    ]}>
        <Spin spinning={loading}>
            <DetailTitle title="基础信息" />
            <BaseInfo
                form={baseForm}
                columns={setting.map((item: any) => {
                    if (item.dataIndex === "type") {
                        return ({
                            ...item,
                            enum: clientTypeOptions?.map(item => ({
                                label: item.name,
                                value: item.id
                            }))
                        })
                    }
                    if (item.dataIndex === "phone") {
                        return ({
                            ...item,
                            rules: [
                                ...item.rules,
                                {
                                    pattern: /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/,
                                    message: "联系电话不合法..."
                                }]
                        })
                    }
                    return item
                })}
                dataSource={data || {}}
                edit
            />
            <DetailTitle title="发票信息" />
            <BaseInfo
                form={baseForm}
                columns={payInfo.map((item: any) => {
                    if (item.dataIndex === "openBankName") {
                        return ({
                            ...item,
                            enum: bankTypeOptions?.map(item => ({
                                value: item.id,
                                label: item.name
                            }))
                        })
                    }
                    return item
                })}
                dataSource={data || {}}
                edit
            />
        </Spin>
    </DetailContent>
}