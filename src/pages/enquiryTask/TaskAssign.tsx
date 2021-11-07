import React, { useState, forwardRef, useImperativeHandle } from "react"
import { Form, Select, DatePicker } from 'antd'
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
            const result: { [key: string]: any } = await RequestUtil.put(`/tower-supply/inquiryTask/taskAssignments`, { ...postData, id })
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
        return saveRun(data)
    }

    return <Form
        form={form}
        labelAlign="right"
        layout="inline"
    >
        <Form.Item name="deptId" label="部门" rules={[{ required: true, message: "请选择部门..." }]}>
            <Select style={{ width: 200 }} onChange={(value: string) => {
                setDeptId(value)
                getUser(value)
            }}>
                {deptData?.map((item: any) => <Select.Option value={item.id} key={item.id}>{item.name}</Select.Option>)}
            </Select>
        </Form.Item>
        <Form.Item name="inquirerId" label="人员" rules={[{ required: true, message: "请选择人员..." }]}>
            <Select
                disabled={!deptId}
                style={{ width: 200 }}
            >{userData?.records?.map((item: any) => <Select.Option value={item.id} key={item.id}>{item.name}</Select.Option>)}</Select>
        </Form.Item>
        <Form.Item name="plannedDeliveryTime" label="计划交付时间" rules={[{ required: true, message: "请选择计划交付时间..." }]}>
            <DatePicker format="YYYY-MM-DD" />
        </Form.Item>
    </Form >
})