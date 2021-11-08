import React, { useState, useRef } from "react"
import { Button, DatePicker, Select, Modal, message } from 'antd'
import { useHistory } from 'react-router-dom'
import { Page } from '../../common'
import Edit from "./Edit"
import Overview from "./Overview"
import { baseinfo } from "../financialData.json"
import useRequest from '@ahooksjs/use-request'
import RequestUtil from '../../../utils/RequestUtil'
import ApplicationContext from "../../../configuration/ApplicationContext"
interface EditRefProps {
    onSubmit: () => void
    resetFields: () => void
}
export default function Invoice() {
    const history = useHistory()
    const invoiceTypeEnum = (ApplicationContext.get().dictionaryOption as any)["1210"].map((item: { id: string, name: string }) => ({
        value: item.id,
        label: item.name
    }))
    const [visible, setVisible] = useState<boolean>(false)
    const [detailVisible, setDetailVisible] = useState<boolean>(false)
    const [detailedId, setDetailedId] = useState<string>("")
    const [type, setType] = useState<"new" | "edit">("new")
    const editRef = useRef<EditRefProps>()
    const { run: deleteRun } = useRequest<{ [key: string]: any }>((id: string) => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.delete(`/tower-market/invoice?id=${id}`)
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
        return value
    }

    const handleDelete = (id: string) => {
        Modal.confirm({
            title: "删除",
            content: "确定删除此开票申请吗？",
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

    const handleModalOk = () => new Promise(async (resove, reject) => {
        const isClose = await editRef.current?.onSubmit()
        if (isClose) {
            message.success("票据创建成功...")
            setVisible(false)
            resove(true)
        }
    })

    return <>
        <Modal
            visible={visible}
            width={1011}
            title={type === "new" ? "创建" : "编辑"}
            onOk={handleModalOk}
            onCancel={() => {
                editRef.current?.resetFields()
                setVisible(false)
            }}>
            <Edit type={type} ref={editRef} id={detailedId} />
        </Modal>
        <Modal
            style={{ padding: 0 }}
            visible={detailVisible} width={1011}
            footer={<Button type="primary" onClick={() => setDetailVisible(false)}>确认</Button>}
            title="详情"
            onCancel={() => setDetailVisible(false)}>
            <Overview id={detailedId} />
        </Modal>
        <Page
            path="/tower-supply/invoice"
            columns={[
                ...baseinfo,
                {
                    title: "操作",
                    dataIndex: "opration",
                    fixed: "right",
                    width: 100,
                    render: (_: any, record: any) => {
                        return <>
                            <Button type="link" onClick={() => {
                                setDetailVisible(true)
                                setDetailedId(record.id)
                            }}>查看</Button>
                            <Button type="link" onClick={() => {
                                setType("edit")
                                setDetailedId(record.id)
                                setVisible(true)
                            }}>编辑</Button>
                            <Button type="link" onClick={() => handleDelete(record.id)}>删除</Button>
                        </>
                    }
                }]}
            extraOperation={<>
                <Button type="primary" ghost>导出</Button>
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
                    children: <DatePicker.RangePicker format="YYYY-MM-DD" />
                },
                {
                    name: 'invoiceStatus',
                    label: '状态',
                    children: <Select style={{ width: 200 }}>
                        <Select.Option value="1">已收票</Select.Option>
                        <Select.Option value="2">待付款</Select.Option>
                        <Select.Option value="3">已付款</Select.Option>
                        <Select.Option value="4">已作废</Select.Option>
                    </Select>
                },
                {
                    name: 'invoiceType',
                    label: '发票类型',
                    children: <Select style={{ width: 200 }}>
                        {invoiceTypeEnum.map((item: any) => <Select.Option key={item.value} value={item.value}>{item.label}</Select.Option>)}
                    </Select>
                }
            ]}
        />
    </>
}
