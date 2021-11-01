import React, { useState, useRef } from "react"
import { Button, Input, DatePicker, Select, Modal, message } from 'antd'
import { useHistory } from 'react-router-dom'
import { Page } from '../../common'
import Edit from "./Edit"
import Overview from "./Overview"
import { baseinfo } from "../financialData.json"
import useRequest from '@ahooksjs/use-request'
import RequestUtil from '../../../utils/RequestUtil'
interface EditRefProps {
    onSubmit: () => void
}
export default function ApplyPayment() {
    const history = useHistory()
    const editRef = useRef<EditRefProps>()
    const [visible, setVisible] = useState<boolean>(false)
    const [type, setType] = useState<"new" | "edit">("new")
    const [detailVisible, setDetailVisible] = useState<boolean>(false)
    const { loading, run: deleteRun } = useRequest<{ [key: string]: any }>((id: string) => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.delete(`/tower-market//applyPayment?id=${id}`)
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    const onFilterSubmit = (value: any) => {
        if (value.startLaunchTime) {
            const formatDate = value.startLaunchTime.map((item: any) => item.format("YYYY-MM-DD"))
            value.startLaunchTime = formatDate[0]
            value.endLaunchTime = formatDate[1]
        }
        return value
    }
    const handleModalOk = () => new Promise(async (resove, reject) => {
        const isClose = await editRef.current?.onSubmit()
        if (isClose) {
            message.success("票据创建成功...")
            setVisible(false)
            resove(true)
        }
    })
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

    return <>
        <Modal style={{ padding: 0 }} visible={visible} width={1011} title="创建" onOk={handleModalOk} onCancel={() => setVisible(false)}>
            <Edit type={type} ref={editRef} />
        </Modal>
        <Modal
            style={{ padding: 0 }}
            visible={detailVisible} width={1011}
            footer={<Button type="primary" onClick={() => setDetailVisible(false)}>确认</Button>}
            title="详情"
            onCancel={() => setVisible(false)}>
            <Overview />
        </Modal>
        <Page
            path="/tower-supply/applyPayment"
            columns={[
                ...baseinfo,
                {
                    title: "操作",
                    dataIndex: "opration",
                    fixed: "right",
                    width: 100,
                    render: (_: any, record: any) => {
                        return <>
                            <Button type="link" onClick={() => history.push(`/project/applyPayment/detail/${record.id}`)}>查看</Button>
                            <Button type="link" onClick={() => history.push(`/project/applyPayment/edit/${record.id}`)}>编辑</Button>
                            <Button type="link" onClick={() => handleDelete(record.id)}>删除</Button>
                        </>
                    }
                }]}
            extraOperation={<>
                <Button type="primary">导出</Button>
                <Button type="primary" onClick={() => setVisible(true)}>申请</Button>
            </>}
            onFilterSubmit={onFilterSubmit}
            searchFormItems={[
                {
                    name: 'fuzzyQuery',
                    children: <Input placeholder="编号/内部合同编号/工程名称/票面单位/业务经理" style={{ width: 300 }} />
                },
                {
                    name: 'isOpen',
                    label: '是否已全开',
                    children: <Select style={{ width: 200 }}>
                        <Select.Option value="1">预开</Select.Option>
                        <Select.Option value="2">发票已开全</Select.Option>
                        <Select.Option value="3">发票未开全</Select.Option>
                    </Select>
                },
                {
                    name: 'contractType',
                    label: '开票时合同状态',
                    children: <Select style={{ width: 200 }}>
                        <Select.Option value="1">不下计划</Select.Option>
                        <Select.Option value="2">未下计划</Select.Option>
                        <Select.Option value="3">未下完计划</Select.Option>
                        <Select.Option value="4">未发完货</Select.Option>
                        <Select.Option value="5">已发完货</Select.Option>
                    </Select>
                },
                {
                    name: 'startLaunchTime',
                    label: '申请日期',
                    children: <DatePicker.RangePicker format="YYYY-MM-DD" />
                }
            ]}
        />
    </>
}
