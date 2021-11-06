import React, { useState } from "react"
import { Button, Input, DatePicker, Select, Modal } from 'antd'
import { Link, useHistory } from 'react-router-dom'
import { Page } from '../../common'
import { baseInfo } from "../purchaseList/purchaseListData.json"
export default function RelationList() {
    const history = useHistory()
    const [filterValue, setFilterValue] = useState({})
    const onFilterSubmit = (value: any) => {
        if (value.startPurchaseStatusUpdateTime) {
            const formatDate = value.startPurchaseStatusUpdateTime.map((item: any) => item.format("YYYY-MM-DD"))
            value.startPurchaseStatusUpdateTime = formatDate[0]
            value.endPurchaseStatusUpdateTime = formatDate[1]
        }
        setFilterValue({ ...filterValue, ...value })
        return value
    }

    return <Page
        path="/tower-supply/purchaseTaskTower/purchaser"
        columns={baseInfo}
        onFilterSubmit={onFilterSubmit}
        filterValue={filterValue}
        searchFormItems={[
            {
                name: 'fuzzyQuery',
                children: <Input placeholder="任务编号/塔型" style={{ width: 300 }} />
            },
            {
                name: 'startPurchaseStatusUpdateTime',
                label: '最新状态变更时间',
                children: <DatePicker.RangePicker format="YYYY-MM-DD" />
            },
            {
                name: 'purchaseTaskStatus',
                label: '塔型采购状态',
                children: <Select style={{ width: 200 }}>
                    <Select.Option value="1">待完成</Select.Option>
                    <Select.Option value="2">待接收</Select.Option>
                    <Select.Option value="3">已完成</Select.Option>
                </Select>
            }
        ]}
    />
}
