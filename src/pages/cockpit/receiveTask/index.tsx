//收货单看板
import React, { useState } from 'react'
import { Button, Select, DatePicker, Input, Modal } from 'antd'
import { Link } from 'react-router-dom'
import { SearchTable as Page } from '../../common'
import { receiveColumns } from "./receiveTask.json"
import PrepareOverview from "../../financial/prepares/Overview"
import BillOverview from "../../financial/bills/Overview"

export default function ViewReceivingNote(): React.ReactNode {
    const [prepareVisible, setPrepareVisible] = useState<boolean>(false)
    const [billVisible, setBillVisible] = useState<boolean>(false)
    const [detailId, setDetailId] = useState<string>("")
    const [filterValue, setFilterValue] = useState({});
    const onFilterSubmit = (value: any) => {
        if (value.startCompleteTime) {
            const formatDate = value.startCompleteTime.map((item: any) => item.format("YYYY-MM-DD"))
            value.startCompleteTime = formatDate[0] + " 00:00:00"
            value.endCompleteTime = formatDate[1] + " 23:59:59"
        }
        setFilterValue(value);
        return value
    }

    return (<>
        <Modal
            destroyOnClose
            visible={prepareVisible} width={1011}
            footer={<Button type="primary" onClick={() => setPrepareVisible(false)}>确认</Button>}
            title="详情"
            onCancel={() => setPrepareVisible(false)}>
            <PrepareOverview id={detailId} />
        </Modal>
        <Modal
            destroyOnClose
            visible={billVisible} width={1011}
            footer={<Button type="primary" onClick={() => setBillVisible(false)}>确认</Button>}
            title="详情"
            onCancel={() => setBillVisible(false)}>
            <BillOverview id={detailId} />
        </Modal>
        <Page
            path="/tower-storage/receiveStockBoard"
            exportPath={`/tower-storage/receiveStockBoard/export`}
            columns={[
                {
                    key: 'index',
                    title: '序号',
                    dataIndex: 'index',
                    fixed: "left",
                    width: 50,
                    render: (_a: any, _b: any, index: number): React.ReactNode => (<span>{index + 1}</span>)
                },
                ...receiveColumns.map((item: any) => {
                    switch (item.dataIndex) {
                        case "receiveNumber":
                            return ({ ...item, render: (value: any, records: any) => value ? <Link to={`/ingredients/receiving/detail/${records.receiveStockId}`}>{value}</Link> : "-" })
                        case "pleasePayNumber":
                            return ({
                                ...item,
                                render: (value: any, records: any) => value ? <a onClick={() => {
                                    setDetailId(records.pleasePayId)
                                    setPrepareVisible(true)
                                }}>{value}</a> : "-"
                            })
                        case "billNumber":
                            return ({
                                ...item,
                                render: (value: any, records: any) => value ? <a onClick={() => {
                                    setDetailId(records.invoiceId)
                                    setBillVisible(true)
                                }}>{value}</a> : "-"
                            })
                        default:
                            return item
                    }
                })
            ]}
            extraOperation={(data: any) => <>
                <span style={{ marginRight: 12 }}>累计欠票金额：<span style={{ color: "#FF8C00" }}>{data?.receiveStockMessage?.arrearsMoney || "0"}</span></span>
                <span> 累计欠费金额：<span style={{ color: "#FF8C00" }}>{data?.receiveStockMessage?.owingTicketMoney || "0"}</span></span>
            </>}
            filterValue={filterValue}
            onFilterSubmit={onFilterSubmit}
            searchFormItems={[
                {
                    name: 'startCompleteTime',
                    label: '收货完成时间',
                    children: <DatePicker.RangePicker format="YYYY-MM-DD" />
                },
                {
                    name: 'invoiceStatus',
                    label: '付款状态',
                    children: <Select style={{ width: "150px" }} placeholder="请选择付款状态">
                        <Select.Option value={1}>已收票</Select.Option>
                        <Select.Option value={2}>待付款</Select.Option>
                        <Select.Option value={3}>已付款</Select.Option>
                        <Select.Option value={4}>待收票</Select.Option>
                    </Select>
                },
                {
                    name: 'companyType',
                    label: '企业类型',
                    children: <Select style={{ width: "150px" }} placeholder="请选择企业类型">
                        <Select.Option value={""}>全部</Select.Option>
                        <Select.Option value={1}>供应商</Select.Option>
                        <Select.Option value={3}>运输公司</Select.Option>
                        <Select.Option value={2}>装卸公司</Select.Option>
                    </Select>
                },
                {
                    name: 'fuzzyQuery',
                    label: "模糊查询项",
                    children: <Input style={{ width: 350 }} placeholder="供应商/收货单编号/关联申请编号/关联票据编号/企业名称" />
                }
            ]}
        />
    </>
    )
}