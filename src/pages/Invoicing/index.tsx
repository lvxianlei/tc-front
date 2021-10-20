import React from "react"
import { Button, Input, DatePicker, Select, Modal, message } from 'antd'
import { Link, useHistory } from 'react-router-dom'
import { Page } from '../common'
import { invoicingListHead } from "./InvoicingData.json"
import useRequest from '@ahooksjs/use-request'
import RequestUtil from '../../utils/RequestUtil'
export default function Invoicing() {
    const history = useHistory()

    const { loading, run: deleteRun } = useRequest<{ [key: string]: any }>((id: string) => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.delete(`/tower-market/invoicing?id=${id}`)
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

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
        columns={[...invoicingListHead, {
            title: "操作",
            dataIndex: "opration",
            fixed: "right",
            width: 100,
            render: (_: any, record: any) => {
                return <>
                    <Button type="link" onClick={() => history.push(`/project/invoicing/detail/${record.id}`)}>查看</Button>
                    <Button type="link" onClick={() => history.push(`/project/invoicing/edit/${record.id}`)}>编辑</Button>
                    <Button type="link" onClick={() => handleDelete(record.id)}>删除</Button>
                </>
            }
        }]}
        extraOperation={<Link to="/project/invoicing/edit/new"><Button type="primary">新增开票申请</Button></Link>}
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
