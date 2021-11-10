import React, { useState } from "react"
import { Input, DatePicker, Select } from 'antd'
import { IntgSelect, Page } from '../../common'
import { baseInfo } from "../purchaseList/purchaseListData.json"
import { useParams } from "react-router-dom";
export default function RelationList() {
    const params = useParams<{ id: string }>();
    const onFilterSubmit = (value: any) => {
        if (value.startPurchaseStatusUpdateTime) {
            const formatDate = value.startPurchaseStatusUpdateTime.map((item: any) => item.format("YYYY-MM-DD"))
            value.startPurchaseStatusUpdateTime = formatDate[0] + " 00:00:00"
            value.endPurchaseStatusUpdateTime = formatDate[1] + " 23:59:59"
        }
        if (value.purchaserId) {
            value.purchaserDeptId = value.purchaserId.first
            value.purchaserId = value.purchaserId.second
        }
        return ({ ...value, purchasePlanId: params.id })
    }

    return <Page
        path="/tower-supply/purchaseTaskTower/purchaser"
        columns={baseInfo}
        onFilterSubmit={onFilterSubmit}
        filterValue={{ purchasePlanId: params.id }}
        searchFormItems={[
            {
                name: 'startPurchaseStatusUpdateTime',
                label: '最新状态变更时间',
                children: <DatePicker.RangePicker format="YYYY-MM-DD" />
            },
            {
                name: 'purchaseTaskStatus',
                label: '塔型采购状态',
                children: <Select style={{ width: 200 }}>
                    <Select.Option value="">全部</Select.Option>
                    <Select.Option value="1">待完成</Select.Option>
                    <Select.Option value="2">待接收</Select.Option>
                    <Select.Option value="3">已完成</Select.Option>
                </Select>
            },
            {
                name: 'purchaserId',
                label: '采购人',
                children: <IntgSelect width={200} />
            },
            {
                name: 'fuzzyQuery',
                label: '查询',
                children: <Input placeholder="任务编号/塔型" style={{ width: 300 }} />
            }
        ]}
    />
}
