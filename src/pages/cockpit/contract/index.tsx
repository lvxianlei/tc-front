//合同看板
import React from 'react'
import { Button, Select, DatePicker, Input } from 'antd'
import { Link, useHistory, } from 'react-router-dom'
import { Page } from '../../common'
import { contract } from "./contract.json"

export default function ViewContract(): React.ReactNode {
    const history = useHistory()
    const onFilterSubmit = (value: any) => {
        if (value.startBidBuyEndTime) {
            const formatDate = value.startBidBuyEndTime.map((item: any) => item.format("YYYY-MM-DD"))
            value.startBidBuyEndTime = formatDate[0]
            value.endBidBuyEndTime = formatDate[1]
        }
        if (value.startBiddingEndTime) {
            const formatDate = value.startBiddingEndTime.map((item: any) => item.format("YYYY-MM-DD"))
            value.startBiddingEndTime = formatDate[0]
            value.endBiddingEndTime = formatDate[1]
        }
        return value
    }

    return (<Page
        path="/tower-supply/materialContract/getMaterialContractBoardPage"
        columns={[
            {
                key: 'index',
                title: '序号',
                dataIndex: 'index',
                width: 50,
                render: (_a: any, _b: any, index: number): React.ReactNode => (<span>{index + 1}</span>)
            },
            ...contract.map((item: any) => {
                if (item.dataIndex === "finish") {
                    return ({ ...item, render: (value: string, records: any) => <>{value || "0"}/{records.sum || "0"}</> })
                }
                return item
            }),
            {
                key: 'operation',
                title: '操作',
                dataIndex: 'operation',
                render: (_: any, records: any) => <Button type="link"><Link to={`/cockpit/contract/${records.id}`}>明细</Link></Button>
            }]}
        extraOperation={<Button type="primary">导出</Button>}
        onFilterSubmit={onFilterSubmit}
        searchFormItems={[
            {
                name: 'updateTime',
                label: '最新状态变更时间',
                children: <DatePicker />
            },
            {
                name: 'contractStatus',
                label: '状态',
                children: <Select defaultValue="全部" style={{ width: "150px" }}>
                    <Select.Option value="" >全部</Select.Option>
                    <Select.Option value={1} >执行中</Select.Option>
                    <Select.Option value={2} >已完成</Select.Option>
                </Select>
            },
            {
                name: 'fuzzyQuery',
                label: '查询',
                children: <Input style={{ width: "113px" }} placeholder="供应商/合同编号" />
            }
        ]}
    />)
}