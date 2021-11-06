import React, { useState, forwardRef, useImperativeHandle } from "react"
import { Form, Select, Row } from 'antd'
import useRequest from '@ahooksjs/use-request'
import RequestUtil from '../../utils/RequestUtil'
interface OverviewProps {
    id: string
}
export default forwardRef(function ({ id }: OverviewProps, ref) {
    const [form] = Form.useForm()
    const [deptId, setDeptId] = useState<string>("")
    const { data: deptData } = useRequest<{ [key: string]: any }>(() => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(`/sinzetech-user/department`)
            resole(result)
        } catch (error) {
            reject(error)
        }
    }))

    const { run: getUser, data: userData } = useRequest<{ [key: string]: any }>((id: string) => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(`/sinzetech-user/user?departmentId=${id}`)
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    const { run: saveRun } = useRequest<{ [key: string]: any }>((postData: any) => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.put(`/tower-supply/materialPurchaseTask/taskAssignments`, { ...postData, id })
            resole(result)
        } catch (error) {
            reject(false)
        }
    }), { manual: true })

    useImperativeHandle(ref, () => ({
        onSubmit,
        resetFields
    }), [ref])

    const resetFields = () => {
        form.resetFields()
    }

    const onSubmit = async () => {
        const data = await form.validateFields()
        console.log(data)
        await saveRun({ ...data })
    }

    return <Form form={form} labelAlign="right" layout="inline">
        <Row>
            <Form.Item name="batcherDeptId" label="配料人" rules={[{ required: true, message: "请选择配料部门..." }]}>
                <Select style={{ width: 200 }} onChange={(value: string) => {
                    setDeptId(value)
                    getUser(value)
                }}>
                    {deptData?.map((item: any) => <Select.Option value={item.id} key={item.id}>{item.name}</Select.Option>)}
                </Select>
            </Form.Item>
            <Form.Item name="batcherId" rules={[{ required: true, message: "请选择配料人..." }]}>
                <Select
                    disabled={!deptId}
                    style={{ width: 200 }}
                >{userData?.records?.map((item: any) => <Select.Option value={item.id} key={item.id}>{item.name}</Select.Option>)}</Select>
            </Form.Item>
        </Row>
        <Row>
            <Form.Item name="purchaserDeptId" label="采购人" rules={[{ required: true, message: "请选择采购部门..." }]}>
                <Select style={{ width: 200 }} onChange={(value: string) => {
                    setDeptId(value)
                    getUser(value)
                }}>
                    {deptData?.map((item: any) => <Select.Option value={item.id} key={item.id}>{item.name}</Select.Option>)}
                </Select>
            </Form.Item>
            <Form.Item name="purchaserId" rules={[{ required: true, message: "请选择采购人..." }]}>
                <Select
                    disabled={!deptId}
                    style={{ width: 200 }}
                >{userData?.records?.map((item: any) => <Select.Option value={item.id} key={item.id}>{item.name}</Select.Option>)}</Select>
            </Form.Item>
        </Row>
    </Form >
})