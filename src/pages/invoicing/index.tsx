import React from "react"
import { Button, Input, DatePicker, Select } from 'antd'
import { useHistory } from 'react-router-dom'
import { SearchTable } from '../common'
import { invoicingListHead } from "./InvoicingData.json"
import { productTypeOptions } from "../../configuration/DictionaryOptions"
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

    return <SearchTable
        path="/tower-finance/invoicing"
        columns={[
            ...invoicingListHead.map((item: any) => {
                if (item.dataIndex === "productTypeId") {
                    return ({
                        ...item,
                        enum: productTypeOptions?.map(item => ({
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
                width: 140,
                render: (_: any, record: any) => {
                    return <>
                        <Button type="link" className="btn-operation-link" onClick={() => history.push(`/invoicing/billList/detail/${record.id}`)}>查看</Button>
                        <Button type="link" className="btn-operation-link" onClick={() => history.push(`/invoicing/billList/taskInfo/${record.id}`)}>开票维护</Button>
                        {/* {record.taskType === 1 && <Button type="link" className="btn-operation-link" onClick={() => history.push(`/invoicing/billList/edit/${record.id}`)}>填写开票信息</Button>}
                        {record.taskType === 2 && <Button type="link" className="btn-operation-link" onClick={() => history.push(`/invoicing/detail/${record.id}`)}>查看开票信息</Button>} */}
                    </>
                }
            }]}
        onFilterSubmit={onFilterSubmit}
        searchFormItems={[
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
            },
            {
                name: 'fuzzyQuery',
                label: "模糊查询项",
                children: <Input placeholder="工程名称/票面单位/业务经理" style={{ width: 300 }} />
            },
        ]}
    />
}
