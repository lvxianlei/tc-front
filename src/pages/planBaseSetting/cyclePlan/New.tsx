import React from "react"
import { Form, Modal } from "antd"
import { BaseInfo } from "../../common"
import { setting } from "./data.json"
interface NewAddProps {
    visible: boolean
}
export default function NewAdd({ visible }: NewAddProps) {
    const [form] = Form.useForm()
    return <Modal visible={visible} title="新增周期计划">
        <BaseInfo form={form} columns={setting} dataSource={{}} edit col={1} />
    </Modal>
}