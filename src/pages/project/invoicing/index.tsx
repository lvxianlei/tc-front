import React, { useState, useRef } from "react"
import { Button, Input, DatePicker, Select, Modal, message, Popconfirm } from 'antd'
import { Link, useHistory } from 'react-router-dom'
import { SearchTable as Page, Workflow } from '../../common'
import { invoicingListHead } from "./InvoicingData.json"
import useRequest from '@ahooksjs/use-request'
import RequestUtil from '../../../utils/RequestUtil'
import { contractPlanStatusOptions } from "../../../configuration/DictionaryOptions"
import BatchCreate from "./BatchCreate"
export default function Invoicing() {
    const history = useHistory()
    const modalRef = useRef<{ onSubmit: () => void, loading: boolean }>()
    const [visible, setVisible] = useState<boolean>(false);
    const [filterValue, setFilterValue] = useState({
        ...history.location.state as object
    });
    const { run: deleteRun } = useRequest<{ [key: string]: any }>((id: string) => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.delete(`/tower-market/invoicing?id=${id}`)
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    const { run: recallRun } = useRequest<{ [key: string]: any }>((id: string) => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.post(`/tower-market/invoicing/recall/${id}`)
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    const { run: closeRun } = useRequest<{ [key: string]: any }>((id: string) => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.post(`/tower-market/invoicing/close/${id}`)
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    const onFilterSubmit = (value: any) => {
        if (value.startLaunchTime) {
            const formatDate = value.startLaunchTime.map((item: any) => item.format("YYYY-MM-DD"))
            value.startLaunchTime = formatDate[0] + " 00:00:00"
            value.endLaunchTime = formatDate[1] + " 23:59:59"
        }
        setFilterValue(value)
        return value
    }

    return <>
        <Modal
            title="批量创建"
            width={1101}
            visible={visible}
            destroyOnClose
            confirmLoading={!!modalRef.current?.loading}
            onOk={async () => {
                try {
                    const result = await modalRef.current?.onSubmit()
                    if (result) {
                        message.success("批量创建成功....")
                        setVisible(false)
                        history.go(0)
                    }
                } catch (error) {
                    console.log(error)
                }
            }}
            onCancel={() => setVisible(false)}>
            <BatchCreate ref={modalRef} />
        </Modal>
        <Page
            path="/tower-market/invoicing"
            filterValue={filterValue}
            columns={[
                {
                    key: 'index',
                    title: '序号',
                    dataIndex: 'index',
                    fixed: "left",
                    width: 50,
                    render: (_a: any, _b: any, index: number): React.ReactNode => (<span>{index + 1}</span>)
                },
                ...invoicingListHead.map((item: any) => {
                    if (item.dataIndex === "contractType") {
                        return ({
                            ...item,
                            enum: contractPlanStatusOptions?.map(item => ({
                                value: item.id,
                                label: item.name
                            }))
                        })
                    }
                    return item
                }),
                {
                    title: "操作",
                    dataIndex: "opration",
                    fixed: "right",
                    width: 240,
                    render: (_: any, record: any) => {
                        return <>
                            <Button type="link" size="small" onClick={() => history.push(`/project/invoicing/detail/${record.id}`)}>查看</Button>
                            <Button type="link" size="small" disabled={[1, 2].includes(record.state)} onClick={() => history.push(`/project/invoicing/edit/${record.id}`)}>编辑</Button>
                            <Popconfirm
                                title="确定撤销此开票申请吗？"
                                disabled={[0, 2, 4, 11].includes(record.state)}
                                onConfirm={async () => {
                                    await recallRun(record?.id)
                                    message.success("撤销成功...")
                                    history.go(0)
                                }}
                                okText="确认"
                                cancelText="取消"
                            >
                                <Button type="link" size="small" disabled={[0, 2, 4, 11].includes(record.state)}>撤销</Button>
                            </Popconfirm>
                            <Popconfirm
                                title="确定作废此开票申请吗？"
                                disabled={![2].includes(record.state)}
                                onConfirm={async () => {
                                    await closeRun(record?.id)
                                    message.success("作废成功...")
                                    history.go(0)
                                }}
                                okText="确认"
                                cancelText="取消"
                            >
                                <Button type="link" size="small" disabled={![2].includes(record.state)}>作废</Button>
                            </Popconfirm>
                            <Popconfirm
                                title="确定删除此开票申请吗？"
                                disabled={record.state !== 0}
                                onConfirm={async () => {
                                    await deleteRun(record?.id)
                                    message.success("删除成功...")
                                    history.go(0)
                                }}
                                okText="确认"
                                cancelText="取消"
                            >
                                <Button type="link" size="small" disabled={record.state !== 0}>删除</Button>
                            </Popconfirm>
                            <Workflow workflowId={record?.id} />
                        </>
                    }
                }]}
            extraOperation={<>
                <Link to="/project/invoicing/new/new"><Button type="primary">新增开票申请</Button></Link>
                <Button type="primary" onClick={() => setVisible(true)}>批量创建</Button>
            </>}
            onFilterSubmit={onFilterSubmit}
            searchFormItems={[
                {
                    name: 'isOpen',
                    label: '是否已全开',
                    children: <Select style={{ width: 200 }}>
                        <Select.Option value="2">发票未开全</Select.Option>
                        <Select.Option value="3">发票已开全</Select.Option>
                    </Select>
                },
                {
                    name: 'contractType',
                    label: '合同下计划状态',
                    children: <Select style={{ width: 200 }}>
                        {
                            contractPlanStatusOptions?.map(item => <Select.Option key={item.id} value={item.id}>{item.name}</Select.Option>)
                        }
                    </Select>
                },
                {
                    name: 'startLaunchTime',
                    label: '申请日期',
                    children: <DatePicker.RangePicker format="YYYY-MM-DD" />
                },
                {
                    name: 'state',
                    label: '状态',
                    children: <Select style={{ width: 200 }}>
                        <Select.Option value={0}>已创建</Select.Option>
                        <Select.Option value={1}>审批中</Select.Option>
                        <Select.Option value={2}>审批通过</Select.Option>
                        <Select.Option value={3}>被驳回</Select.Option>
                        <Select.Option value={4}>已撤销</Select.Option>
                        <Select.Option value={11}>已作废</Select.Option>
                    </Select>
                },
                {
                    name: 'fuzzyQuery',
                    label: "模糊查询项",
                    children: <Input placeholder="编号/内部合同编号/工程名称/票面单位/业务经理" style={{ width: 300 }} />
                },
            ]}
        />
    </>
}
