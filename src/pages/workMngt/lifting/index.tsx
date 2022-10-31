import React from "react"
import { Button, Input, Select, DatePicker } from 'antd'
import { useHistory } from 'react-router-dom'
import { SearchTable as Page } from '../../common'
import { baseInfo } from "./data.json"
export default function Invoicing() {
    const history = useHistory()
    const onFilterSubmit = (value: any) => {
        if (value.startLiftingTime) {
            const formatDate = value.startLiftingTime.map((item: any) => item.format("YYYY-MM-DD"))
            value.startLiftingTime = formatDate[0] + " 00:00:00"
            value.endLiftingTime = formatDate[1] + " 23:59:59"
        }
        if (value.startBatchingTaskFinishTime) {
            const formatDate = value.startBatchingTaskFinishTime.map((item: any) => item.format("YYYY-MM-DD"))
            value.startBatchingTaskFinishTime = formatDate[0] + " 00:00:00"
            value.endBatchingTaskFinishTime = formatDate[1] + " 23:59:59"
        }
        return value
    }

    return <Page
        path="/tower-supply/liftingSummary"
        exportPath="/tower-supply/liftingSummary"
        columns={[
            {
                title: "序号",
                dataIndex: "index",
                fixed: "left",
                width: 40,
                render: (_: any, _a: any, index: number) => <>{index + 1}</>
            },
            ...baseInfo as any,
            {
                title: "操作",
                dataIndex: "opration",
                fixed: "right",
                width: 140,
                render: (_: any, record: any) => {
                    return <>
                        <Button
                            type="link"
                            className="btn-operation-link"
                            onClick={() => history.push(`/ingredients/lifting/detail/${record.planNumber}?orderProjectName=${record.orderProjectName}`)}
                        >提料明细</Button>
                        <Button
                            className="btn-operation-link"
                            type="link"
                            onClick={() => history.push(`/ingredients/lifting/material/${record.planNumber}?orderProjectName=${record.orderProjectName}`)}>
                            材料明细
                        </Button>
                    </>
                }
            }]}
        onFilterSubmit={onFilterSubmit}
        searchFormItems={[
            {
                name: 'startLiftingTime',
                label: '提料完成时间',
                children: <DatePicker.RangePicker format="YYYY-MM-DD" />
            },
            {
                name: 'startBatchingTaskFinishTime',
                label: '配料完成时间',
                children: <DatePicker.RangePicker format="YYYY-MM-DD" />
            },
            {
                name: 'batchingStatus',
                label: '状态',
                children: <Select style={{ width: 200 }} defaultValue={""}>
                    <Select.Option value="">全部</Select.Option>
                    <Select.Option value="1">配料中</Select.Option>
                    <Select.Option value="3">已配料</Select.Option>
                </Select>
            },
            {
                name: 'fuzzyQuery',
                label: "模糊查询项",
                children: <Input placeholder="计划号/工程名称" style={{ width: 200 }} />
            }
        ]}
    />
}
