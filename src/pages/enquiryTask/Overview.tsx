import React, { forwardRef, useImperativeHandle, useState } from "react"
import { Spin, Form, Modal, Input } from 'antd'
import { BaseInfo, CommonTable, DetailTitle, Attachment, OperationRecord } from '../common'
import { overviewBaseInfo, enquiryTaskAction } from "./enquiryTask.json"
import useRequest from '@ahooksjs/use-request'
import RequestUtil from '../../utils/RequestUtil'
interface OverviewProps {
    id: string
}
const rejectionStatusPromise: { [key: string]: any } = {}
export default forwardRef(function Overview({ id }: OverviewProps, ref) {
    const [form] = Form.useForm()
    const [visible, setVisible] = useState<boolean>(false)
    const { loading, data } = useRequest<{ [key: string]: any }>(() => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(`/tower-supply/inquiryTask/${id}`)
            resole(result)
        } catch (error) {
            reject(false)
        }
    }), { refreshDeps: [id] })

    const { run: receiveRun } = useRequest<{ [key: string]: any }>(() => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.put(`/tower-supply/inquiryTask/taskReceive/${id}`)
            resole(result)
        } catch (error) {
            reject(false)
        }
    }), { manual: true })

    const { run: rejectRun } = useRequest<{ [key: string]: any }>((postData: any) => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.put(`/tower-supply/inquiryTask/taskRejection`, { ...postData, id })
            resole(result)
        } catch (error) {
            reject(false)
        }
    }), { manual: true })

    useImperativeHandle(ref, () => ({ onReceive, onRejection }), [ref])

    const onReceive = () => new Promise(async (resove, reject) => {
        try {
            const result = await receiveRun()
            resove(true)
        } catch (error) {
            reject(false)
        }
    })

    const onRejection = () => new Promise((resove, reject) => {
        rejectionStatusPromise.resove = resove
        rejectionStatusPromise.reject = reject
        setVisible(true)
    })

    const handleRejection = () => new Promise(async (resove, reject) => {
        try {
            const description = await form.validateFields()
            const result = await rejectRun(description)
            resove(true)
            rejectionStatusPromise.resove(true)
            setVisible(false)
        } catch (error) {
            reject(false)
            rejectionStatusPromise.reject(false)
        }
    })

    return <Spin spinning={loading}>
        <Modal title="拒绝"
            visible={visible}
            onOk={handleRejection}
            onCancel={async () => {
                await form.resetFields()
                setVisible(false)
            }}>
            <Form form={form}>
                <Form.Item name="description" label="拒绝原因" rules={[
                    { required: true, message: "请输入拒绝原因..." }
                ]}><Input.TextArea /></Form.Item>
            </Form>
        </Modal>
        <DetailTitle title="基础信息" />
        <BaseInfo columns={overviewBaseInfo} dataSource={data || {}} col={2} classStyle={"overall-form-class-padding0"}/>
        <Attachment title="相关附件" dataSource={data?.projectAttachList} />
        <OperationRecord serviceId={id} serviceName="tower-supply" />
    </Spin>
})