import React, { useRef, useState } from 'react'
import { Button, Input, DatePicker, Select, Modal, message } from 'antd'
import { Link, useHistory } from 'react-router-dom'
import { Page, PopTableContent } from '../../common'
import RequestUtil from '../../../utils/RequestUtil'
import useRequest from '@ahooksjs/use-request'
import { drawing, connectContract } from './drawing.json'
import Edit from "./Edit"
import Overview from "./Overview"
interface EditRefProps {
    onSubmit: (type: 1 | 2) => void
}
export default function Drawing(): React.ReactNode {
    const history = useHistory()
    const [filterValue, setFilterValue] = useState({})
    const [visible, setVisible] = useState<boolean>(false)
    const [detailVisible, setDetailVisible] = useState<boolean>(false)
    const [connectVisible, setConnectVisible] = useState<boolean>(false)
    const [detailedId, setDetailedId] = useState<string>("")
    const [type, setType] = useState<"new" | "edit">("new")
    const [conenctData, setConenctData] = useState<{ [key: string]: any }>({})
    const editRef = useRef<EditRefProps>()
    const { run: deleteRun } = useRequest<{ [key: string]: any }>((id: string) => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.delete(`/tower-market/drawingConfirmation?id=${id}`)
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    const { run: cancelRun } = useRequest<{ [key: string]: any }>((id: string) => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.delete(`/tower-market/drawingConfirmation/withdraw?id=${id}`)
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    const { loading: connectLoading, run: connectRun } = useRequest<{ [key: string]: any }>(() => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.post(`/tower-market/drawingConfirmation/relationContract`, {
                id: detailedId,
                contractId: conenctData.id,
                contractName: conenctData.contractName,
                customerCompany: conenctData.customerCompany,
                internalNumber: conenctData.internalNumber,
                projectId: conenctData.projectId
            })
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    const onFilterSubmit = (value: any) => {
        if (value.startRefundTime) {
            const formatDate = value.startRefundTime.map((item: any) => item.format("YYYY-MM-DD"))
            value.startRefundTime = formatDate[0] + " 00:00:00"
            value.endRefundTime = formatDate[1] + " 23:59:59"
        }
        setFilterValue(value)
        return value
    }

    const handleModalOk = (type: 1 | 2) => new Promise(async (resove, reject) => {
        try {
            await editRef.current?.onSubmit(type)
            message.success(`${type === 1 ? "保存" : "保存并提交"}成功...`)
            setVisible(false)
            resove(true)
            history.go(0)
        } catch (error) {
            reject(false)
        }
    })

    const handleDelete = (id: string) => {
        Modal.confirm({
            title: "删除",
            content: "确定删除此任务吗？",
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
            title: "撤销",
            content: "确定撤销此任务吗？",
            onOk: () => new Promise(async (resove, reject) => {
                try {
                    resove(await cancelRun(id))
                    message.success("撤销成功...")
                    history.go(0)
                } catch (error) {
                    reject(error)
                }
            })
        })
    }

    return <>
        <Modal
            visible={connectVisible}
            width={1011}
            destroyOnClose
            title="选择相关合同"
            confirmLoading={connectLoading}
            onOk={async () => {
                await connectRun()
                message.success("成功关联合同...")
                setDetailedId("")
                setConenctData({})
                setConnectVisible(false)
                history.go(0)
            }}
            onCancel={() => {
                setDetailedId("")
                setConnectVisible(false)
            }}
        >
            <PopTableContent data={connectContract as any} onChange={(records: any) => setConenctData(records[0])} />
        </Modal>
        <Modal
            destroyOnClose
            visible={visible}
            width={1011}
            title="图纸确认任务"
            onCancel={() => {
                setDetailedId("")
                setVisible(false)
            }}
            footer={[
                <Button key="save" type="primary" ghost onClick={() => handleModalOk(1)}>保存</Button>,
                <Button key="saveAndSubmit" type="primary" ghost onClick={() => handleModalOk(2)}>保存并发起</Button>
            ]}>
            <Edit type={type} ref={editRef} id={detailedId} />
        </Modal>
        <Modal
            destroyOnClose
            visible={detailVisible}
            width={1011}
            footer={<Button type="primary" onClick={() => setDetailVisible(false)}>确认</Button>}
            title="图纸确认任务"
            onCancel={() => {
                setDetailedId("")
                setDetailVisible(false)
            }}>
            <Overview id={detailedId} />
        </Modal>
        <Page
            path="/tower-market/drawingConfirmation"
            columns={[...drawing, {
                title: "操作",
                dataIndex: "opration",
                fixed: "right",
                render: (_: undefined, record: any) => <>
                    <span
                        style={{color: "#FF8C00", cursor: "pointer", marginRight: 12}}
                        onClick={() => {
                            setDetailedId(record.id)
                            setDetailVisible(true)
                        }}>查看</span>
                    <Button
                        type="link"
                        size="small"
                        disabled={![0, 3].includes(record.auditStatus)}
                        className="btn-operation-link"
                        onClick={() => {
                            setType("edit")
                            setDetailedId(record.id)
                            setVisible(true)
                        }}>编辑</Button>
                    <Button
                        type="link"
                        size="small"
                        disabled={(![null, "-1", -1, 4].includes(record.auditStatus)) || record.contractId}
                         className="btn-operation-link"
                        onClick={() => {
                            setDetailedId(record.id)
                            setConnectVisible(true)
                        }}>关联合同</Button>
                    <Button
                        type="link"
                        size="small"
                        disabled={![0, 3].includes(record.auditStatus)}
                        onClick={() => handleDelete(record.id)}
                         className="btn-operation-link"
                    >删除</Button>
                    <Button
                        type="link"
                        size="small"
                        className="btn-operation-link"
                        disabled={record.auditStatus !== 1}
                        onClick={() => handleCancel(record.id)}
                    >撤回</Button>
                </>
            }]}
            filterValue={filterValue}
            extraOperation={<Button
                type="primary"
                onClick={() => {
                    setType("new")
                    setDetailedId("")
                    setVisible(true)
                }}>新增图纸任务</Button>}
            onFilterSubmit={onFilterSubmit}
            searchFormItems={[
                {
                    name: 'startRefundTime',
                    label: '制单日期',
                    children: <DatePicker.RangePicker format="YYYY-MM-DD" />
                },
                {
                    name: 'auditStatus',
                    label: '项目状态',
                    children: <Select style={{ width: "100px" }}>
                        <Select.Option value={0}>待发起</Select.Option>
                        <Select.Option value={1}>已发起</Select.Option>
                        <Select.Option value={2}>待完成</Select.Option>
                        <Select.Option value={3}>已拒绝</Select.Option>
                        <Select.Option value={4}>已完成</Select.Option>
                    </Select>
                },
                {
                    name: 'fuzzyQuery',
                    children: <Input
                        placeholder="工程名称/业务经理/合同名称/内部合同编号"
                        style={{ width: 260 }}
                    />
                },
            ]}
        />
    </>
}