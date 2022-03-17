import React, { useState, forwardRef, useImperativeHandle } from "react"
import { Form, Select, DatePicker, TreeSelect } from 'antd'
import useRequest from '@ahooksjs/use-request'
import RequestUtil from '../../utils/RequestUtil'
interface OverviewProps {
    id: string
}
export default forwardRef(function ({ id }: OverviewProps, ref) {
    const [form] = Form.useForm()
    const generateTreeNode: (data: any) => any[] = (data: any[]) => {
        return data.map((item: any) => ({
            title: item.name,
            value: item.id,
            disabled: item.type === 2 || item.parentId === '0',
            children: item.children ? generateTreeNode(item.children) : []
        }))
    }
    const { data: deptData } = useRequest<{ [key: string]: any }>(() => new Promise(async (resole, reject) => {
        try {
            const result: any[] = await RequestUtil.get(`/tower-system/department`)
            resole(generateTreeNode(result))
        } catch (error) {
            reject(error)
        }
    }))

    const { run: getUser, data: userData } = useRequest<{ [key: string]: any }>((id: string) => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(`/tower-system/employee?dept=${id}&size=1000`)
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

    const handleFirstChange = (val: string) => {
        // 当切换部门的时候，对人员进行清空处理
        form.setFieldsValue({
            inquirerId: undefined
        })
        // 获取人员列表
        getUser(val)
    }

    return <Form
        form={form}
        labelAlign="right"
        layout="inline"
    >
        <Form.Item name="deptId" label="部门" rules={[{ required: true, message: "请选择部门..." }]}>
            <TreeSelect
                placeholder="部门"
                style={{ width: 200 }}
                onChange={handleFirstChange}
                treeData={(deptData as any) || []}
            />
        </Form.Item>
        <Form.Item name="inquirerId" label="人员" rules={[{ required: true, message: "请选择人员..." }]}>
            <Select
                placeholder="人员"
                style={{ width: 200 }}
            >
                {userData?.records?.map((item: any) => <Select.Option
                    value={item.userId}
                    key={item.id}
                >
                    {item.name}
                </Select.Option>)}
            </Select>
        </Form.Item>
        <Form.Item name="plannedDeliveryTime" label="计划交付时间" rules={[{ required: true, message: "请选择计划交付时间..." }]}>
            <DatePicker format="YYYY-MM-DD" />
        </Form.Item>
    </Form >
})