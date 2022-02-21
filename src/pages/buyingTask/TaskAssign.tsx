import React, { useState, forwardRef, useImperativeHandle } from "react"
import { Form, Select, Row, Col } from 'antd'
import useRequest from '@ahooksjs/use-request'
import RequestUtil from '../../utils/RequestUtil'
import { IntgSelect } from "../common"
interface OverviewProps {
    id: string
}
export default forwardRef(function ({ id }: OverviewProps, ref) {
    const [form] = Form.useForm()

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
        await saveRun({
            batcherDeptId: data.batcherDeptId.first,
            batcherId: data.batcherDeptId.second,
            purchaserDeptId: data.purchaserDeptId.first,
            purchaserId: data.purchaserDeptId.second
        })
    }

    return <Form form={form} labelAlign="right" layout="inline">
        <Row style={{ width: "100%" }}>
            <Col span={20}>
                <Form.Item name="batcherDeptId" label="配料人" rules={[{ required: true, message: "请选择配料部门..." }]}>
                    <IntgSelect width={"100%"} />
                </Form.Item>
            </Col>
        </Row>
        <Row style={{ width: "100%" }}>
            <Col span={20}>
                <Form.Item name="purchaserDeptId" label="采购人" rules={[{ required: true, message: "请选择采购部门..." }]}>
                    <IntgSelect width={"100%"} />
                </Form.Item>
            </Col>
        </Row>
    </Form >
})