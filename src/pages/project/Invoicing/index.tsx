import React from "react"
import { Button, Input, DatePicker, Select, Modal, message } from 'antd'
import { Link, useHistory } from 'react-router-dom'
import { Page } from '../../common'
import { invoicingListHead } from "./InvoicingData.json"
import useRequest from '@ahooksjs/use-request'
import RequestUtil from '../../../utils/RequestUtil'
export default function Invoicing() {
    const history = useHistory()
    const { run: deleteRun } = useRequest<{ [key: string]: any }>((id: string) => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.delete(`/tower-market/invoicing?id=${id}`)
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

    return <Page
        path="/tower-market/invoicing"
        columns={[
            ...invoicingListHead,
            {
                title: "操作",
                dataIndex: "opration",
                fixed: "right",
                width: 100,
                render: (_: any, record: any) => {
                    return <>
                        <Button type="link" onClick={() => history.push(`/project/invoicing/detail/${record.id}`)}>查看</Button>
                        {[0, 3].includes(record.state) && <Button type="link" onClick={() => history.push(`/project/invoicing/edit/${record.id}`)}>编辑</Button>}
                        {[0].includes(record.state) && <Button type="link" onClick={() => handleDelete(record.id)}>删除</Button>}
                    </>
                }
            }]}
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
                    <Select.Option value="2">发票未开全</Select.Option>
                    <Select.Option value="3">发票已开全</Select.Option>
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
}
