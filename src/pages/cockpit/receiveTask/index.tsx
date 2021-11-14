//收货单看板
import React, { useState } from 'react'
import { Button, Select, DatePicker, Input, Modal } from 'antd'
import { Link, useHistory, } from 'react-router-dom'
import { Page } from '../../common'
import { receiveColumns } from "./receiveTask.json"
import PrepareOverview from "../../financial/Prepare/Overview"
import BillOverview from "../../financial/Bill/Overview"
export default function ViewReceivingNote(): React.ReactNode {
    const history = useHistory()
    const [prepareVisible, setPrepareVisible] = useState<boolean>(false)
    const [billVisible, setBillVisible] = useState<boolean>(false)
    const [detailId, setDetailId] = useState<string>("")
    const onFilterSubmit = (value: any) => {
        if (value.startCompleteTime) {
            const formatDate = value.startCompleteTime.map((item: any) => item.format("YYYY-MM-DD"))
            value.startCompleteTime = formatDate[0] + " 00:00:00"
            value.endCompleteTime = formatDate[1] + " 23:59:59"
        }
        return value
    }

    return (<>
        <Modal
            destroyOnClose
            visible={prepareVisible} width={1011}
            footer={<Button type="primary" onClick={() => {
                setPrepareVisible(false)
            }}>确认</Button>}
            title="详情"
            onCancel={() => {
                setPrepareVisible(false)
            }}>
            <PrepareOverview id={detailId} />
        </Modal>
        <Modal
            destroyOnClose
            visible={billVisible} width={1011}
            footer={<Button type="primary" onClick={() => {
                setBillVisible(false)
            }}>确认</Button>}
            title="详情"
            onCancel={() => {
                setBillVisible(false)
            }}>
            <BillOverview id={detailId} />
        </Modal>
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
                ...receiveColumns.map((item: any) => {
                    switch (item.dataIndex) {
                        case "receiveNumber":
                            return ({ ...item, render: (value: any, records: any) => <Link to={`/workMngt/receiving/detail/${records.id}`}>{value}</Link> })
                        case "pleasePayNumber":
                            return ({
                                ...item,
                                render: (value: any, records: any) => <a onClick={() => {
                                    setDetailId(records.pleasePayId)
                                    setPrepareVisible(true)
                                }}>{value}</a>
                            })
                        case "billNumber":
                            return ({
                                ...item,
                                render: (value: any, records: any) => <a onClick={() => {
                                    setDetailId(records.invoiceId)
                                    setBillVisible(true)
                                }}>{value}</a>
                            })
                        default:
                            return item
                    }
                })
            ]}
            extraOperation={<>
                <Button type="primary">导出</Button>
                <span style={{ fontSize: "20px", color: "orange", marginLeft: "40px" }}>累计欠票金额：{ }      累计欠费金额：{ }</span>
            </>}
            onFilterSubmit={onFilterSubmit}
            searchFormItems={[
                {
                    name: 'startCompleteTime',
                    label: '收货完成时间',
                    children: <DatePicker.RangePicker format="YYYY-MM-DD" />
                },
                {
                    name: 'receiveStatus',
                    label: '状态',
                    children: <Select style={{ width: "150px" }} defaultValue={"全部"}>
                        <Select.Option value={1}>待收票</Select.Option>
                        <Select.Option value={2}>已收票</Select.Option>
                        <Select.Option value={3}>待付款</Select.Option>
                        <Select.Option value={4}>已付款</Select.Option>
                    </Select>
                },
                {
                    name: 'fuzzyQuery',
                    label: '查询',
                    children: <Input style={{ width: 280 }} placeholder="供应商/收货单编号/关联申请编号/关联票据编号" />
                }
            ]}
        />
    </>
    )
}