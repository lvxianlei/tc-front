import React, { useState, useRef } from "react"
import { Button, Input, DatePicker, Select, Modal, message, Form } from 'antd'
import { useHistory } from 'react-router-dom'
import { IntgSelect, Page } from '../../common'
import { baseInfo } from "./shortageListData.json"
import useRequest from '@ahooksjs/use-request'
import RequestUtil from '../../../utils/RequestUtil'
import Overview from "./Overview"
import PurchasePlan from "./PurchasePlan"
export default function Invoicing() {
    const history = useHistory()
    const [filterValue, setFilterValue] = useState<any>({})
    const [visible, setVisible] = useState<boolean>(false)
    const [cancelVisible, setCancelVisible] = useState<boolean>(false)
    const [cancelId, setCancelId] = useState<string>("")
    const [form] = Form.useForm()
    const purChasePlanRef = useRef<{ onSubmit: () => void }>({ onSubmit: () => { } })
    const [generateVisible, setGenerateVisible] = useState<boolean>(false)
    const [generateIds, setGenerateIds] = useState<string[]>([])
    const { run: cancelRun } = useRequest<{ [key: string]: any }>((data: any) => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.put(`/tower-supply/materialShortage`, { ...data })
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    const onFilterSubmit = (value: any) => {
        if (value.startRefundTime) {
            const formatDate = value.startRefundTime.map((item: any) => item.format("YYYY-MM-DD"))
            value.updateStartTime = `${formatDate[0]} 00:00:00`
            value.updateEndTime = `${formatDate[1]} 23:59:59`
            delete value.startRefundTime
        }
        if (value.handlerId) {
            // value.handlerDept = value.handlerId.first
            value.handlerId = value.handlerId.second
        }
        // setFilterValue({ ...filterValue, ...value })
        return value
    }

    const handleCancel = () => new Promise(async (resove, reject) => {
        try {
            const formData = await form.validateFields()
            await cancelRun({ id: cancelId, reason: formData.reason })
            message.success("取消成功...")
            resove(true)
            history.go(0)
        } catch (error) {
            reject(false)
        }
    })
    const handlePurChasePlan = () => new Promise(async (resove, reject) => {
        try {
            const result = await purChasePlanRef.current?.onSubmit()
            resove(true)
            history.go(0)
        } catch (error) {
            reject(false)
        }
    })
    return <>
        <Modal title="操作信息"
            visible={visible}
            width={1011}
            onCancel={() => setVisible(false)}
            footer={<Button onClick={() => setVisible(false)}>关闭</Button>}
        >
            <Overview id={cancelId} />
        </Modal>
        <Modal title="取消" visible={cancelVisible} onOk={handleCancel} onCancel={() => {
            setCancelVisible(false)
            form.resetFields()
        }}>
            <Form form={form}>
                <Form.Item rules={[{ required: true, message: "请填写取消原因..." }]} label="取消原因"
                   name="reason"><Input.TextArea maxLength={400}/></Form.Item>
            </Form>
        </Modal>
        <Modal title="生成采购计划" visible={generateVisible} width={1011} onOk={handlePurChasePlan} onCancel={() => setGenerateVisible(false)}>
            <PurchasePlan ids={generateIds} ref={purChasePlanRef} />
        </Modal>
        <Page
            path="/tower-supply/materialShortage"
            exportPath={"/tower-supply/materialShortage"}
            filterValue={filterValue}
            columns={[
                { title: "序号", dataIndex: "index", width: 50, render: (_: any, _a: any, index) => <>{index + 1}</> },
                ...baseInfo,
                {
                    title: "操作",
                    dataIndex: "opration",
                    fixed: "right",
                    width: 100,
                    render: (_: any, record: any) => {
                        return <>
                            <Button type="link" className="btn-operation-link" onClick={() => {
                                setCancelId(record.id)
                                setVisible(true)
                            }}>查看</Button>
                            <Button
                                type="link"
                                className="btn-operation-link"
                                disabled={![1].includes(record.shortageStatus)}
                                onClick={() => {
                                    setCancelId(record.id)
                                    setCancelVisible(true)
                                }}
                            >取消</Button>
                        </>
                    }
                }]}
            extraOperation={<>
                {/* <Button type="primary" ghost>导出</Button> */}
                <Button type="primary" ghost onClick={() => {
                    if (!generateIds || generateIds.length <= 0) {
                        message.warning("必须选择任务才能生成采购计划...")
                        return
                    } else {
                        setGenerateVisible(true)
                    }
                }}>生成采购计划</Button>
            </>}
            onFilterSubmit={onFilterSubmit}
            tableProps={{
                rowSelection: {
                    type: "checkbox",
                    selectedRowKeys: generateIds,
                    onChange: (selectedRowKeys: any[]) => {
                        setGenerateIds(selectedRowKeys)
                    },
                    getCheckboxProps: (record: object[]) => ({
                        disabled: false
                    })
                }
            }}
            searchFormItems={[
                {
                    name: 'startRefundTime',
                    label: '最新状态变更时间',
                    children: <DatePicker.RangePicker format="YYYY-MM-DD" />
                },
                {
                    name: 'shortageStatus',
                    label: '状态',
                    children: <Select style={{ width: 200 }}>
                        <Select.Option value="1">待处理</Select.Option>
                        <Select.Option value="2">已处理</Select.Option>
                        <Select.Option value="3">已完成</Select.Option>
                        <Select.Option value="4">已取消</Select.Option>
                    </Select>
                },
                {
                    name: 'handlerId',
                    label: '处理人',
                    children: <IntgSelect width={400} />
                },
                {
                    name: 'fuzzyQuery',
                    label: "模糊查询项",
                    children: <Input placeholder="生产批次/采购计划编号/材质/规格" style={{ width: 300 }} />
                }
            ]}
        />
    </>
}
