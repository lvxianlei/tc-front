import React, { useState } from 'react'
import { Input, DatePicker, Select, Button, Form } from 'antd'
import { Link } from 'react-router-dom'
import { baseInfo } from "./buyBurdening.json"
import { IntgSelect, Page } from '../../common'

export default function EnquiryList(): React.ReactNode {
    const [filterValue, setFilterValue] = useState({});
    const onFilterSubmit = (value: any) => {
        if (value.startBatcheStatusUpdateTime) {
            const formatDate = value.startBatcheStatusUpdateTime.map((item: any) => item.format("YYYY-MM-DD"))
            value.startBatcheStatusUpdateTime = formatDate[0] + ' 00:00:00';
            value.endBatcheStatusUpdateTime = formatDate[1] + ' 23:59:59';
        }
        if (value.batcherId) {
            value.batcherDeptId = value.batcherId.first
            value.batcherId = value.batcherId.second
        }
        setFilterValue(value)
        return value
    }

    return <>
        <Page
            path="/tower-supply/materialPurchaseTask/inquirer"
            columns={[
                ...baseInfo,
                {
                    title: '操作',
                    width: 100,
                    dataIndex: 'operation',
                    render: (_: any, records: any) => <Link to={`/workMngt/buyBurdening/detail/${records.id}`}>查看</Link>
                }
            ]}
            extraOperation={<Button type="primary" ghost>导出</Button>}
            filterValue={filterValue}
            onFilterSubmit={onFilterSubmit}
            searchFormItems={[
                {
                    name: 'startBatcheStatusUpdateTime',
                    label: '最新状态变更时间',
                    children: <DatePicker.RangePicker format="YYYY-MM-DD" />
                },
                {
                    name: 'batcheTaskStatus',
                    label: '配料状态',
                    children: <Select style={{ width: "100px" }} defaultValue="请选择">
                        <Select.Option value="">全部</Select.Option>
                        <Select.Option value="2">待接收</Select.Option>
                        <Select.Option value="1">待完成</Select.Option>
                        <Select.Option value="3">已完成</Select.Option>
                    </Select>
                },
                {
                    name: 'batcherId',
                    label: '配料人',
                    children: <IntgSelect width={200} />
                },
                {
                    name: 'fuzzyQuery',
                    label: '查询',
                    children: <Input placeholder="任务编号/内部合同号" maxLength={200} />
                },
            ]}
        />
    </>
}
