import React, {useState, useRef} from "react"
import {Button, Input, DatePicker, Select, Modal, message} from 'antd'
import {useHistory} from 'react-router-dom'
import {Page} from '../../common'
import Edit from "./Edit"
import Overview from "./Overview"
import AttachFile from "./AttachFile"
import {ApplicationForPayment} from "../financialData.json"
import useRequest from '@ahooksjs/use-request'
import RequestUtil from '../../../utils/RequestUtil'

interface EditRefProps {
    onSubmit: () => void
}

export default function ApplyPayment() {
    const history = useHistory()
    const editRef = useRef<EditRefProps>()
    const fileRef = useRef<EditRefProps>()
    const [visible, setVisible] = useState<boolean>(false)
    const [type, setType] = useState<"new" | "edit">("new")
    const [detailVisible, setDetailVisible] = useState<boolean>(false)
    const [successVisible, setSuccessVisible] = useState<boolean>(false)
    const [detailId, setDetailId] = useState<string>("")
    const {run: deleteRun} = useRequest<{ [key: string]: any }>((id: string) => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.delete(`/tower-supply/applyPayment?id=${id}`)
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), {manual: true})

    const {run: cancelRun} = useRequest<{ [key: string]: any }>((id: string) => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.post(`/tower-supply/applyPayment/recallApply?id=${id}`)
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), {manual: true})

    const {run: approvalRun} = useRequest<{ [key: string]: any }>((id: string) => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.post(`/tower-supply/applyPayment/initiateApproval?id=${id}`)
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), {manual: true})
    const {run: successRun} = useRequest<{ [key: string]: any }>((id: string) => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.post(`/tower-supply/applyPayment/initiateApproval?id=${id}`)
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), {manual: true})

    const onFilterSubmit = (value: any) => {
        if (value.updateStartTime) {
            const formatDate = value.updateStartTime.map((item: any) => item.format("YYYY-MM-DD"))
            value.updateStartTime = formatDate[0]
            value.updateEndTime = formatDate[1]
        }
        return value
    }
    const handleModalOk = () => new Promise(async (resove, reject) => {
        const isClose = await editRef.current?.onSubmit()
        if (isClose) {
            message.success("票据创建成功...")
            setVisible(false)
            history.go(0)
            resove(true)
        }
    })

    const handleDelete = (id: string) => {
        Modal.confirm({
            title: "删除",
            content: "确定删除此请款申请吗？",
            onOk: () => new Promise(async (resove, reject) => {
                try {
                    resove(await deleteRun(id))
                    message.success("删除成功...")
                    history.go(0)
                } catch (error) {
                    reject(error)
                }
            })
        })
    }

    const handleCancel = (id: string) => {
        Modal.confirm({
            title: "撤回请款申请",
            content: "确定撤回此请款申请吗？",
            onOk: () => new Promise(async (resove, reject) => {
                try {
                    resove(await cancelRun(id))
                    message.success("撤回成功...")
                    history.go(0)
                } catch (error) {
                    reject(error)
                }
            })
        })
    }

    const handleApprovalRun = (id: string) => {
        Modal.confirm({
            title: "发起请款申请",
            content: "发起此请款申请吗？",
            onOk: () => new Promise(async (resove, reject) => {
                try {
                    resove(await approvalRun(id))
                    message.success("撤回成功...")
                    history.go(0)
                } catch (error) {
                    reject(error)
                }
            })
        })
    }

    const handleSuccessRun = async () => {
        const result = await fileRef.current?.onSubmit()
        message.success("成功完成...")
        setSuccessVisible(false)
        history.go(0)
    }

    return <>
        <Modal style={{padding: 0}} visible={visible} width={1011} title={type === "new" ? "创建" : "编辑"}
               onOk={handleModalOk} onCancel={() => setVisible(false)}>
            <Edit type={type} ref={editRef} id={detailId}/>
        </Modal>
        <Modal
            visible={detailVisible} width={1011}
            footer={<Button type="primary" onClick={() => setDetailVisible(false)}>确认</Button>}
            title="详情"
            onCancel={() => setDetailVisible(false)}>
            <Overview id={detailId}/>
        </Modal>
        <Modal visible={successVisible} width={1011}
               title="附件上传"
               onCancel={() => {
                   setSuccessVisible(false)
                   history.go(0)
               }}
               onOk={() => handleSuccessRun()}
        >
            <AttachFile id={detailId} ref={fileRef}/>
        </Modal>
        <Page
            path="/tower-supply/applyPayment"
            columns={[
                ...ApplicationForPayment,
                {
                    title: "操作",
                    dataIndex: "opration",
                    fixed: "right",
                    width: 100,
                    render: (_: any, record: any) => {
                        return <>
                            <a onClick={() => {
                                setDetailId(record.id)
                                setDetailVisible(true)
                            }}>详情</a>
                            <Button
                                type="link"
                                disabled={![0, 3].includes(record.applyStatus)}
                                onClick={() => {
                                    setType("edit")
                                    setDetailId(record.id)
                                    setVisible(true)
                                }}>编辑</Button>
                            {[0].includes(record.applyStatus) && <a onClick={() => handleApprovalRun(record.id)}>发起</a>}
                            <Button type="link" disabled={![1].includes(record.applyStatus)}
                                    onClick={() => handleCancel(record.id)}>撤回</Button>
                            {[0, 3].includes(record.applyStatus) && <a onClick={() => handleDelete(record.id)}>删除</a>}
                            <Button type="link" onClick={() => {
                                setDetailId(record.id)
                                setSuccessVisible(true)
                            }}>完成</Button>
                        </>
                    }
                }]}
            extraOperation={<>
                <Button type="primary" ghost>导出</Button>
                <Button type="primary" ghost onClick={() => {
                    setType("new")
                    setVisible(true)
                }}>申请</Button>
            </>}
            onFilterSubmit={onFilterSubmit}
            searchFormItems={[
                {
                    name: 'updateStartTime',
                    label: '最近状态变更时间',
                    children: <DatePicker.RangePicker format="YYYY-MM-DD"/>
                },
                {
                    name: 'applyStatus',
                    label: '审批状态',
                    children: <Select style={{width: 200}}>
                        <Select.Option value="0">未发起</Select.Option>
                        <Select.Option value="1">待审批</Select.Option>
                        <Select.Option value="2">已拒绝</Select.Option>
                        <Select.Option value="3">已撤回</Select.Option>
                        <Select.Option value="4">已通过</Select.Option>
                    </Select>
                },
                {
                    name: 'pleasePayStatus',
                    label: '请款状态',
                    children: <Select style={{width: 200}}>
                        <Select.Option value="1">已创建</Select.Option>
                        <Select.Option value="2">待付款</Select.Option>
                        <Select.Option value="3">已付款</Select.Option>
                    </Select>
                },
                {
                    name: 'contractType',
                    label: '请款类别',
                    children: <Select style={{width: 200}}>
                        <Select.Option value="1">不下计划</Select.Option>
                        <Select.Option value="2">未下计划</Select.Option>
                        <Select.Option value="3">未下完计划</Select.Option>
                        <Select.Option value="4">未发完货</Select.Option>
                        <Select.Option value="5">已发完货</Select.Option>
                    </Select>
                },
                {
                    label: '查询',
                    name: 'fuzzyQuery',
                    children: <Input placeholder="请款编号/关联票据/供应商/请款机构" style={{width: 300}}/>
                },
                {
                    name: 'contractType',
                    label: '供应商',
                    children: <Select style={{width: 200}}>
                        <Select.Option value="1">不下计划</Select.Option>
                        <Select.Option value="2">未下计划</Select.Option>
                        <Select.Option value="3">未下完计划</Select.Option>
                        <Select.Option value="4">未发完货</Select.Option>
                        <Select.Option value="5">已发完货</Select.Option>
                    </Select>
                }

            ]}
        />
    </>
}
