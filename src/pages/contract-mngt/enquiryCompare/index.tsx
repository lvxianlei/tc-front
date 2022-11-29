// 合同管理-询比价
import React, { useState, useRef } from 'react'
import { useHistory, Link } from "react-router-dom"
import { IntgSelect, SearchTable as Page } from "../../common"
import { Select, Input, Button, Modal, DatePicker, message, Form, Popconfirm } from 'antd'
import { comparison } from "./enquiry.json"
import useRequest from '@ahooksjs/use-request'
import RequestUtil from '../../../utils/RequestUtil'
import Edit from "./Edit"
import OprationInfo from "./OprationInfo"

import "./price.less"
interface EditRef {
    onSubmit: () => void
    resetFields: () => void
}
export default function ContractMngt() {
    const history = useHistory()
    const editRef = useRef<EditRef>({ onSubmit: () => { }, resetFields: () => { } })
    const [filterValue, setFilterValue] = useState<{ [key: string]: any }>({})
    const [visible, setVisible] = useState<boolean>(false)
    const [oprationVisible, setOprationVisible] = useState<boolean>(false)
    const [cancelVisible, setCancelVisible] = useState<boolean>(false)
    const [detailId, setDetailId] = useState<string>("")
    const [oprationType, setOprationType] = useState<"new" | "edit">("new")
    const [form] = Form.useForm()

    const { run: deleteRun } = useRequest<{ [key: string]: any }>((id: string) => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.delete(`/tower-supply/comparisonPrice?id=${id}`)
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    const { run: cancelRun } = useRequest<{ [key: string]: any }>((data: any) => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.post(`/tower-supply/comparisonPrice/cancelComparisonPrice`, { ...data })
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    const onFilterSubmit = (value: any) => {
        if (value.createTimeOrder) {
            const formatDate = value.createTimeOrder.map((item: any) => item.format("YYYY-MM-DD"))
            value.createStartTime = formatDate[0] + " 00:00:00"
            value.createEndTime = formatDate[1] + " 23:59:59"
        }
        if (value.comparisonPersonId) {
            value.comparisonPersonId = value.comparisonPersonId.value
        }
        setFilterValue({ ...value })
        return ({ ...value })
    }

    const handleAddOk = () => new Promise(async (resove, reject) => {
        try {
            await editRef.current?.onSubmit()
            message.success("询比价保存成功...")
            setVisible(false)
            resove(true)
            history.go(0)
        } catch (error) {
            reject(false)
        }
    })
    const handleCancel = () => new Promise(async (resove, reject) => {
        try {
            const formData = await form.validateFields()
            await cancelRun({ id: detailId, reason: formData.reason })
            message.success("取消成功...")
            resove(true)
            history.go(0)
        } catch (error) {
            reject(false)
        }
    })

    return (
        <div className='enquiryComareWrapper'>
            <Modal destroyOnClose title={oprationType === "new" ? "创建" : "编辑"} width={1011} visible={visible} onOk={handleAddOk} onCancel={() => {
                editRef.current?.resetFields()
                setVisible(false)
            }}>
                <Edit id={detailId} type={oprationType} ref={editRef} />
            </Modal>
            <Modal destroyOnClose title="操作信息" width={1011}
                visible={oprationVisible}
                onCancel={() => setOprationVisible(false)}
                footer={[<Button key="close" onClick={() => setOprationVisible(false)}>关闭</Button>]}>
                <OprationInfo id={detailId} />
            </Modal>
            <Modal destroyOnClose title="取消" visible={cancelVisible} onOk={handleCancel} onCancel={() => {
                form.resetFields()
                setCancelVisible(false)
            }}>
                <Form form={form}>
                    <Form.Item rules={[{ required: true, message: "请填写取消原因..." }]} label="取消原因"
                        name="reason"><Input.TextArea /></Form.Item>
                </Form>
            </Modal>
            <Page
                path="/tower-supply/comparisonPrice"
                exportPath={"/tower-supply/comparisonPrice"}
                columns={[
                    {
                        "title": "序号",
                        "dataIndex": "index",
                        "width": 50,
                        render: (_a: any, _b: any, index: number): React.ReactNode => (<span>{index + 1}</span>)
                    },
                    ...comparison as any,
                    {
                        title: "操作",
                        dataIndex: "opration",
                        fixed: "right",
                        width: 270,
                        render: (_: any, records: any) => <>
                            <Link className="btn-operation-link" to={`/contract-mngt/enquiryCompare/enquiry/${records.id}/${records?.approval}`}>询价信息</Link>
                            <Button disabled={records.comparisonStatus !== 1 } type="link" className="btn-operation-link" onClick={() => {
                                setDetailId(records.id)
                                setCancelVisible(true)
                            }}>取消</Button>
                            <Popconfirm
                                title="确定删除吗？"
                                disabled={  records.isRelate!==0 }
                                onConfirm={async () => {
                                    await deleteRun(records?.id)
                                    message.success("删除成功...")
                                    history.go(0)
                                }}
                                okText="确认"
                                cancelText="取消"
                            >
                                <Button
                                    type="link"
                                    size="small"
                                    className="btn-operation-link"
                                    disabled={records.isRelate!==0}
                                >删除</Button>
                            </Popconfirm>
                            <Button disabled={records.comparisonStatus !== 1||records.approval===1} type="link" className="btn-operation-link" onClick={() => {
                                setDetailId(records.id)
                                setOprationType("edit")
                                setVisible(true)
                            }}>编辑</Button>
                            <Button type="link" className="btn-operation-link" onClick={() => {
                                setDetailId(records.id)
                                setOprationVisible(true)
                            }}>操作信息</Button>
                        </>
                    }
                ]}
                extraOperation={<>
                    <Button type="primary" ghost onClick={() => {
                        setOprationType("new")
                        setVisible(true)
                    }}>创建</Button>
                </>}
                filterValue={filterValue}
                onFilterSubmit={onFilterSubmit}
                searchFormItems={[
                    {
                        name: 'createTimeOrder',
                        label: '创建日期',
                        children: <DatePicker.RangePicker style={{ width: "200px" }} format="YYYY-MM-DD" />
                    },
                    {
                        name: 'comparisonStatus',
                        label: '状态',
                        children: <Select defaultValue="全部" style={{ width: "100px" }}>
                            <Select.Option value="">全部</Select.Option>
                            <Select.Option value={1}>询价中</Select.Option>
                            <Select.Option value={2}>已询价</Select.Option>
                            <Select.Option value={3}>已取消</Select.Option>
                        </Select>
                    },
                    {
                        name: 'comparisonPersonId',
                        label: '询价人',
                        children: <IntgSelect width={200} />
                    },
                    {
                        name: 'approval',
                        label: '审批状态',
                        children: <Select placeholder="请选择" style={{ width: "100px" }}>
                            <Select.Option value="0">待发起</Select.Option>
                            <Select.Option value="1">审批中</Select.Option>
                            <Select.Option value="2">审批通过</Select.Option>
                            <Select.Option value="3">审批驳回</Select.Option>
                            <Select.Option value="4">已撤销</Select.Option>
                        </Select>
                    },
                    {
                        name: 'fuzzyQuery',
                        label: "模糊查询项",
                        children: <Input style={{ width: "150px" }} placeholder="询比价编号/用途" />
                    }
                ]}
            />
        </div>
    )
}