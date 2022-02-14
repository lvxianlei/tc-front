import React, { useState, useRef } from "react"
import { Button, DatePicker, Select, Modal, message, Input } from 'antd'
import { useHistory } from 'react-router-dom'
import { Page } from '../../common'
import Edit from "./Edit"
import Overview from "./Overview"
import { baseinfo } from "../financialData.json"
import useRequest from '@ahooksjs/use-request'
import RequestUtil from '../../../utils/RequestUtil'
import { invoiceTypeOptions } from "../../../configuration/DictionaryOptions"
interface EditRefProps {
    onSubmit: () => void
    resetFields: () => void
}
export default function Invoice() {
    const history = useHistory()
    const invoiceTypeEnum = invoiceTypeOptions?.map((item: { id: string, name: string }) => ({
        value: item.id,
        label: item.name
    }))
    const [visible, setVisible] = useState<boolean>(false)
    const [detailVisible, setDetailVisible] = useState<boolean>(false)
    const [detailedId, setDetailedId] = useState<string>("")
    const [type, setType] = useState<"new" | "edit">("new")
    const [filterValue, setFilterValue] = useState<any>({})
    const editRef = useRef<EditRefProps>()
    const { run: deleteRun } = useRequest<{ [key: string]: any }>((id: string) => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.delete(`/tower-supply/invoice?id=${id}`)
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    const { run: cancelRun } = useRequest<{ [key: string]: any }>((id: string) => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.post(`/tower-supply/invoice/cancelInvoice?invoiceId=${id}`)
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    const onFilterSubmit = (value: any) => {
        if (value.updateEndTime) {
            const formatDate = value.updateEndTime.map((item: any) => item.format("YYYY-MM-DD"))
            value.updateStartTime = formatDate[0] + " 00:00:00"
            value.updateEndTime = formatDate[1] + " 23:59:59"
        }
        setFilterValue({ ...filterValue, ...value })
        return value
    }

    const handleDelete = (id: string) => {
        Modal.confirm({
            title: "删除",
            content: "确定删除此票据吗？",
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
            title: "作废",
            content: "确定作废此票据吗？",
            onOk: () => new Promise(async (resove, reject) => {
                try {
                    resove(await cancelRun(id))
                    message.success("作废成功...")
                    history.go(0)
                } catch (error) {
                    reject(error)
                }
            })
        })
    }

    const handleModalOk = () => new Promise(async (resove, reject) => {
        try {
            await editRef.current?.onSubmit()
            message.success(`票据${type === "new" ? "创建" : "编辑"}成功...`)
            setVisible(false)
            resove(true)
            history.go(0)
        } catch (error) {
            reject(false)
        }
    })

    return <>
        <Modal
            destroyOnClose
            visible={visible}
            width={1011}
            title={type === "new" ? "创建" : "编辑"}
            onOk={handleModalOk}
            onCancel={() => {
                editRef.current?.resetFields()
                setType("new")
                setDetailedId("")
                setVisible(false)
            }}>
            <Edit type={type} ref={editRef} id={detailedId} />
        </Modal>
        <Modal
            destroyOnClose
            visible={detailVisible}
            width={1011}
            footer={<Button type="primary" onClick={() => setDetailVisible(false)}>确认</Button>}
            title="详情"
            onCancel={() => {
                setDetailedId("")
                setDetailVisible(false)
            }}>
            <Overview id={detailedId} />
        </Modal>
        <Page
            path="/tower-supply/invoice"
            exportPath={"/tower-supply/invoice"}
            filterValue={filterValue}
            columns={[
                { title: "序号", dataIndex: "index", width: 50, render: (_: any, _a: any, index) => <>{index + 1}</> },
                ...baseinfo.map((item: any) => {
                    switch (item.dataIndex) {
                        case "invoiceType":
                            return ({ ...item, type: "select", enum: invoiceTypeEnum })
                        default:
                            return item
                    }
                }),
                {
                    title: "操作",
                    dataIndex: "opration",
                    fixed: "right",
                    width: 100,
                    render: (_: any, record: any) => {
                        return <>
                            <Button type="link" className="btn-operation-link" disabled={![1].includes(record.invoiceStatus)} onClick={() => {
                                setType("edit")
                                setDetailedId(record.id)
                                setVisible(true)
                            }}>编辑</Button>
                            <Button
                                type="link"
                                className="btn-operation-link"
                                onClick={() => {
                                    setDetailVisible(true)
                                    setDetailedId(record.id)
                                }}>详情</Button>
                            <Button type="link" className="btn-operation-link" disabled={![1].includes(record.invoiceStatus)} onClick={() => handleCancel(record.id)}>作废</Button>
                            <Button type="link" className="btn-operation-link" disabled={![1, 4].includes(record.invoiceStatus)} onClick={() => handleDelete(record.id)}>删除</Button>
                        </>
                    }
                }]}
            extraOperation={<>
                <Button type="primary" ghost onClick={() => {
                    setType("new")
                    setVisible(true)
                }}>创建</Button>
            </>}
            onFilterSubmit={onFilterSubmit}
            searchFormItems={[
                {
                    name: 'updateEndTime',
                    label: '最近状态变更时间',
                    children: <DatePicker.RangePicker format="YYYY-MM-DD" style={{ width: 200 }} />
                },
                {
                    name: 'invoiceStatus',
                    label: '状态',
                    children: <Select style={{ width: 200 }} defaultValue="全部">
                        <Select.Option value="">全部</Select.Option>
                        <Select.Option value="1">已收票</Select.Option>
                        <Select.Option value="2">待付款</Select.Option>
                        <Select.Option value="3">已付款</Select.Option>
                        <Select.Option value="4">已作废</Select.Option>
                    </Select>
                },
                {
                    name: 'invoiceType',
                    label: '发票类型',
                    children: <Select style={{ width: 200 }} defaultValue="全部">
                        <Select.Option value="">全部</Select.Option>
                        {invoiceTypeEnum?.map((item: any) => <Select.Option key={item.value} value={item.value}>{item.label}</Select.Option>)}
                    </Select>
                },
                {
                    name: 'businessType',
                    label: '企业类型',
                    children: <Select style={{ width: 200 }} defaultValue="全部">
                        <Select.Option value="">全部</Select.Option>
                        <Select.Option value="1">供应商</Select.Option>
                        <Select.Option value="2">装卸公司</Select.Option>
                        <Select.Option value="3">运输公司</Select.Option>
                    </Select>
                },
                {
                    name: 'fuzzyQuery',
                    label: "模糊查询项",
                    children: <Input placeholder="票据编号/请款编号/发票号/企业名称" style={{ width: 230 }} />
                }
            ]}
        />
    </>
}
