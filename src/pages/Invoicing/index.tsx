import React from "react"
import { Button, Input, DatePicker, Select } from 'antd'
import { Link, useHistory } from 'react-router-dom'
import { Page } from '../common'
import { invoicingListHead } from "./InvoicingData.json"
import RequestUtil from '../../utils/RequestUtil'
export default function Invoicing() {
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
    return <Page
        path="/invoicing"
        columns={invoicingListHead}
        extraOperation={<Link to="/project/invoicing/new"><Button type="primary">新增开票申请</Button></Link>}
        onFilterSubmit={onFilterSubmit}
        searchFormItems={[
            {
                name: 'fuzzyQuery',
                children: <Input placeholder="编号/内部合同编号/工程名称/票面单位/业务经理" style={{ width: 300 }} />
            },
            {
                name: 'a',
                label: '是否已全开',
                children: <Select style={{ width: 200 }}>
                    <Select.Option value="a">全部</Select.Option>
                    <Select.Option value="b">预开</Select.Option>
                    <Select.Option value="c">发票已开全</Select.Option>
                    <Select.Option value="d">发票未开全</Select.Option>
                </Select>
            },
            {
                name: 'b',
                label: '开票时合同状态',
                children: <Select style={{ width: 200 }}>
                    <Select.Option value="a">全部</Select.Option>
                    <Select.Option value="b">不下计划</Select.Option>
                    <Select.Option value="c">未下计划</Select.Option>
                    <Select.Option value="d">未下完计划</Select.Option>
                    <Select.Option value="e">未发完货</Select.Option>
                    <Select.Option value="f">已发完货</Select.Option>
                </Select>
            },
            {
                name: 'c',
                label: '申请日期',
                children: <DatePicker.RangePicker format="YYYY-MM-DD" />
            }
        ]}
    />
}
