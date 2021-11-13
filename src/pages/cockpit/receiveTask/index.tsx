//收货单看板
import React, { useEffect, useState } from 'react'
import { Button, Select, DatePicker, Input, Descriptions, Modal } from 'antd'
import { Link, useHistory, } from 'react-router-dom'
import { Attachment, CommonTable, DetailContent, DetailTitle, Page } from '../../common'
import { operatingInformation, ApprovalInformation, operatingInformation1, aa } from "./viewReceivingNote.json"
import RequestUtil from '../../../utils/RequestUtil'
var moment = require('moment');
moment().format();
//状态
const projectType = [
    {
        value: 0,
        label: "全部"
    },
    {
        value: 1,
        label: "待收票"
    },
    {
        value: 2,
        label: "已收票"
    },
    {
        value: 3,
        label: "待付款"
    },
    {
        value: 4,
        label: "已付款"
    }
]

export default function ViewReceivingNote(): React.ReactNode {
    const history = useHistory();
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

    return (<>
        <Page
            path="/tower-storage/receiveStock/list"
            columns={[
                {
                    key: 'index',
                    title: '序号',
                    dataIndex: 'index',
                    width: 50,
                    render: (_a: any, _b: any, index: number): React.ReactNode => (<span>{index + 1}</span>)
                },
                {
                    title: "供应商",
                    dataIndex: "supplierName"
                },
                {
                    title: "收货单编号",
                    dataIndex: "receiveNumber",
                    render: (text, record: any) => {
                        return <div>
                            <Button type="link" onClick={() => history.push(`/stock/viewReceivingNote/viewReceivingNoteDetail`)}>{record.receiveNumber}</Button>
                        </div>
                    }
                },
                ...aa,
                {
                    title: "关联请款编号",
                    dataIndex: "pleasePayNumber",
                    render: (text, record: any) => {
                        return <div>
                            <Button type="link" onClick={() => { }}>{record.pleasePayNumber}</Button>
                        </div>
                    }
                },
                {
                    title: "关联票据编号",
                    dataIndex: "billNumber",
                    render: (text, record: any) => {
                        return <div>
                            <Button type="link" onClick={() => { }}>{record.billNumber}</Button>
                        </div>
                    }
                },
                {
                    title: "付款状态",
                    dataIndex: "invoiceStatus"
                }
            ]}
            extraOperation={<>
                <Button type="primary">导出</Button>
                <span style={{ fontSize: "20px", color: "orange", marginLeft: "40px" }}>累计欠票金额：{ }      累计欠费金额：{ }</span>
            </>}
            onFilterSubmit={onFilterSubmit}
            searchFormItems={[
                {
                    name: 'updateTime',
                    label: '收货完成时间',
                    children: <DatePicker />
                },
                {
                    name: 'rawMaterialType',
                    label: '状态',
                    children: <Select style={{ width: "150px" }} defaultValue={"全部"}>
                        {projectType.map((item: any, index: number) => <Select.Option value={item.value} key={index}>{item.label}</Select.Option>)}
                    </Select>
                },
                {
                    name: 'inquire',
                    label: '查询',
                    children: <Input style={{ width: "113px" }} placeholder="供应商/收货单编号/关联申请编号/关联票据编号" />
                },
            ]}
        />
    </>
    )
}