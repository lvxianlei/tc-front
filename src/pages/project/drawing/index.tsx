import React, { useRef, useState } from 'react'
import { Button, Input, DatePicker, Select, Modal, message, Popconfirm, Form } from 'antd'
import { useHistory, useLocation } from 'react-router-dom'
import { SearchTable as Page, PopTableContent } from '../../common'
import RequestUtil from '../../../utils/RequestUtil'
import useRequest from '@ahooksjs/use-request'
import { drawing, connectContract } from './drawing.json'
import Edit from "./Edit"
import Overview from "./Overview"
import Subsidiary from './subsidiary'

interface EditRefProps {
    onSubmit: (type: 1 | 2) => void
}
export default function Drawing(): React.ReactNode {
    const history = useHistory()
    const location = useLocation<{ auditStatus?: number }>();
    const [filterValue, setFilterValue] = useState<any>({
        ...history.location.state as object
    })
    const [visible, setVisible] = useState<boolean>(false)
    const [subsidiary, setSubsidiary] = useState<boolean>(false)
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
        <Modal
            title="明细"
            visible={subsidiary}
            width={1101}
            destroyOnClose
            onCancel={() => setSubsidiary(false)}
            footer={
                <Button type="primary" key="ok" onClick={() => setSubsidiary(false)}>确定</Button>
            }
        >
            <Subsidiary id={detailedId} />
        </Modal>
        <Page
            path="/tower-market/drawingConfirmation"
            columns={[
                ...(drawing as any),
                {
                    title: "操作",
                    dataIndex: "opration",
                    fixed: "right",
                    width: 220,
                    render: (_: undefined, record: any) => <>
                        <Button
                            type="link"
                            size="small"
                            style={{ padding: 2 }}
                            onClick={() => {
                                setDetailedId(record.id)
                                setDetailVisible(true)
                            }}>查看</Button>
                        <Button
                            type="link"
                            size="small"
                            disabled={![0, 3].includes(record.auditStatus)}
                            style={{ padding: 2 }}
                            onClick={() => {
                                setType("edit")
                                setDetailedId(record.id)
                                setVisible(true)
                            }}>编辑</Button>
                        <Button
                            type="link"
                            size="small"
                            disabled={(![null, "-1", -1, 4].includes(record.auditStatus)) || record.contractId}
                            style={{ padding: 2 }}
                            onClick={() => {
                                setDetailedId(record.id)
                                setConnectVisible(true)
                            }}>关联合同</Button>
                        <Button
                            type="link"
                            size="small"
                            style={{ padding: 2 }}
                            onClick={() => {
                                setDetailedId(record.id)
                                setSubsidiary(true)
                            }}>明细</Button>

                        <Popconfirm
                            title="确定删除此任务吗？"
                            disabled={![0, 3].includes(record.auditStatus)}
                            onConfirm={async () => {
                                await deleteRun(record?.id)
                                message.success("删除成功...")
                                history.go(0)
                            }}
                            okText="确认"
                            cancelText="取消"
                        >
                            <Button
                                type="link"
                                size="small"
                                style={{ padding: 2 }}
                                disabled={![0, 3].includes(record.auditStatus)}
                            >删除</Button>
                        </Popconfirm>
                        <Button
                            type="link"
                            size="small"
                            style={{ padding: 2 }}
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
                    children: <Form.Item name='auditStatus' initialValue={location.state?.auditStatus}>
                        <Select style={{ width: "100px" }}>
                            <Select.Option value={0}>待发起</Select.Option>
                            <Select.Option value={1}>已发起</Select.Option>
                            <Select.Option value={2}>待完成</Select.Option>
                            <Select.Option value={3}>已拒绝</Select.Option>
                            <Select.Option value={4}>已完成</Select.Option>
                        </Select>
                    </Form.Item>
                },
                {
                    name: 'fuzzyQuery',
                    label: "模糊查询项",
                    children: <Input
                        placeholder="工程名称/业务经理/合同名称/内部合同编号"
                        style={{ width: 260 }}
                    />
                },
            ]}
        />
    </>
}