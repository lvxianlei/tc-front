import React, { useRef } from "react"
import { Button, Spin, Input, Form } from 'antd'
import { useHistory, useParams } from 'react-router-dom'
import { DetailContent, DetailTitle, BaseInfo, Attachment, AttachmentRef } from '../../common'
import ChooseDept from "./ChooseDept"
import { setting } from "./transfer.json"
import useRequest from '@ahooksjs/use-request'
import RequestUtil from '../../../utils/RequestUtil'
export default function Edit() {
    const history = useHistory()
    const attachRef = useRef<AttachmentRef>()
    const params = useParams<{ transferId: string }>()
    const [form] = Form.useForm()
    const { loading, data } = useRequest<{ [key: string]: any }>(() => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(`/tower-hr/employeeTransfer/detail/${params.transferId}`)
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: !params.transferId })

    const { loading: saveLoading } = useRequest<{ [key: string]: any }>(() => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.post(`/tower-hr/employeeTransfer/save`)
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    const handleSave = async (type: "save" | "saveAndSubmit") => {
        try {
            const postData = await form.validateFields()
            console.log(postData)
        } catch (error) {
            console.log(error)
        }
    }

    return <DetailContent operation={[
        <Button key="save" onClick={() => handleSave("save")} type="primary" style={{ marginRight: 16 }}>保存</Button>,
        <Button key="saveAndSubmit" onClick={() => handleSave("saveAndSubmit")} type="primary" style={{ marginRight: 16 }} >保存并提交</Button>,
        <Button key="cancel" onClick={() => history.go(-1)}>取消</Button>
    ]}>
        <Spin spinning={loading}>
            <DetailTitle title="员工调动管理" />
            <BaseInfo
                form={form}
                columns={setting.map(item => {
                    if (item.dataIndex === "newDepartmentName") {
                        return ({
                            ...item,
                            render: (columnItem: any, props: any) => <ChooseDept data={columnItem} {...props} />
                        })
                    }
                    return item
                })}
                dataSource={data || {}} edit />
            <Attachment dataSource={data?.fileVos} edit ref={attachRef} />
        </Spin>
    </DetailContent>
}