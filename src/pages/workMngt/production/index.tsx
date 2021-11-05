import React, { useState } from "react"
import { Button, Input, DatePicker, Select, Modal } from 'antd'
import { Link, useHistory } from 'react-router-dom'
import { Page } from '../../common'
import { baseInfo } from "./productionData.json"
import Overview from "./Edit"
export default function Invoicing() {
    const [visible, setVisible] = useState<boolean>(false)
    const [detailId, setDetailId] = useState<string>("")

    const onFilterSubmit = (value: any) => {
        if (value.startLaunchTime) {
            const formatDate = value.startLaunchTime.map((item: any) => item.format("YYYY-MM-DD"))
            value.startLaunchTime = formatDate[0]
            value.endLaunchTime = formatDate[1]
        }
        return value
    }

    return <>
        <Modal title="配料方案" visible={visible} width={1011} onOk={() => setVisible(false)} onCancel={() => setVisible(false)}>
            <Overview id={detailId} />
        </Modal>
        <Page
            path="/tower-supply/produceIngredients"
            columns={[
                ...baseInfo,
                {
                    title: "操作",
                    dataIndex: "opration",
                    fixed: "right",
                    width: 100,
                    render: (_: any, record: any) => {
                        return <>
                            <Link to={`/workMngt/production/detailed/${record.productionBatch}`}>明细</Link>
                            <Button type="link"
                                onClick={() => {
                                    setDetailId(record.id)
                                    setVisible(true)
                                }}>配料单</Button>
                        </>
                    }
                }]}
            extraOperation={<Button type="primary" ghost>导出</Button>}
            onFilterSubmit={onFilterSubmit}
            searchFormItems={[
                {
                    name: 'fuzzyQuery',
                    children: <Input placeholder="编号/内部合同编号/工程名称/票面单位/业务经理" style={{ width: 300 }} />
                },
                {
                    name: 'startPurchaseStatusUpdateTime',
                    label: '最新状态变更时间',
                    children: <DatePicker.RangePicker format="YYYY-MM-DD" />
                },
                {
                    name: 'purchaseTaskStatus',
                    label: '状态',
                    children: <Select style={{ width: 200 }}>
                        <Select.Option value="1">待完成</Select.Option>、
                        <Select.Option value="2">已完成</Select.Option>
                    </Select>
                }
            ]}
        />
    </>
}
