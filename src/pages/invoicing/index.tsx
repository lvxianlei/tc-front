import React from "react"
import { Button, Input, DatePicker, Select } from 'antd'
import { useHistory } from 'react-router-dom'
import { Page } from '../common'
import { invoicingListHead } from "./InvoicingData.json"
export default function Invoicing() {
    const history = useHistory()
    const onFilterSubmit = (value: any) => {
        if (value.startLaunchTime) {
            const formatDate = value.startLaunchTime.map((item: any) => item.format("YYYY-MM-DD"))
            value.startLaunchTime = formatDate[0] + " 00:00:00"
            value.endLaunchTime = formatDate[1] + " 23:59:59"
        }
        return value
    }

    return <Page
        path="/tower-finance/invoicing"
        columns={[
            ...invoicingListHead,
            {
                title: "操作",
                dataIndex: "opration",
                fixed: "right",
                width: 100,
                render: (_: any, record: any) => {
                    return <>
                        <Button type="link" style={{marginRight: 12}} onClick={() => history.push(`/invoicing/taskInfo/${record.id}`)}>查看任务信息</Button>
                        {record.taskType === 1 && <Button type="link" style={{marginRight: 12}} onClick={() => history.push(`/invoicing/edit/${record.id}`)}>填写开票信息</Button>}
                        {record.taskType === 2 && <Button type="link" onClick={() => history.push(`/invoicing/detail/${record.id}`)}>查看开票信息</Button>}
                    </>
                }
            }]}
        onFilterSubmit={onFilterSubmit}
        searchFormItems={[
            {
                name: 'fuzzyQuery',
                children: <Input placeholder="工程名称/票面单位/业务经理" style={{ width: 300 }} />
            },
            {
                name: 'taskType',
                label: '任务状态',
                children: <Select style={{ width: 200 }}>
                    <Select.Option value="1">待完成</Select.Option>
                    <Select.Option value="2">已完成</Select.Option>
                </Select>
            },
            {
                name: 'startLaunchTime',
                label: '申请时间',
                children: <DatePicker.RangePicker format="YYYY-MM-DD" />
            }
        ]}
    />
}
