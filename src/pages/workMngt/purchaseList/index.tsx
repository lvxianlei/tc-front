import React, { useState, useRef } from "react"
import { Button, Input, DatePicker, Select, Modal, message } from 'antd'
import { Link, useHistory } from 'react-router-dom'
import { Page } from '../../common'
import { baseInfo } from "./purchaseListData.json"
import useRequest from '@ahooksjs/use-request'
import RequestUtil from '../../../utils/RequestUtil'
import Overview from "./Overview"
import PurchasePlan from "./PurchasePlan"
export default function Invoicing() {
    const history = useHistory()
    const purChasePlanRef = useRef<{ onSubmit: () => void }>({ onSubmit: () => { } })
    const [visible, setVisible] = useState<boolean>(false)
    const [generateVisible, setGenerateVisible] = useState<boolean>(false)
    const [generateIds, setGenerateIds] = useState<string[]>([])
    const [chooseId, setChooseId] = useState<string>("")
    const onFilterSubmit = (value: any) => {
        if (value.startPurchaseStatusUpdateTime) {
            const formatDate = value.startPurchaseStatusUpdateTime.map((item: any) => item.format("YYYY-MM-DD"))
            value.startPurchaseStatusUpdateTime = formatDate[0]
            value.endPurchaseStatusUpdateTime = formatDate[1]
        }
        return value
    }

    const handlePurChasePlan = () => {
        return purChasePlanRef.current?.onSubmit()
    }

    return <>
        <Modal title="配料方案" visible={visible} width={1011} onCancel={() => setVisible(false)}>
            <Overview id={chooseId} />
        </Modal>
        <Modal title="生成采购计划" visible={generateVisible} width={1011} onOk={handlePurChasePlan} onCancel={() => setGenerateVisible(false)}>
            <PurchasePlan ids={generateIds} ref={purChasePlanRef} />
        </Modal>
        <Page
            path="/tower-supply/purchaseTaskTower/purchaser"
            columns={[
                ...baseInfo,
                {
                    title: "操作",
                    dataIndex: "opration",
                    fixed: "right",
                    width: 100,
                    render: (_: any, record: any) => <Button type="link" onClick={() => {
                        setVisible(true)
                        setChooseId(record.id)
                    }}>配料方案</Button>
                }]}
            extraOperation={<>
                <Button type="primary" ghost>导出</Button>
                <Button type="primary" ghost onClick={() => {
                    if (!generateIds || generateIds.length <= 0) {
                        message.warning("必须选择任务才能生成采购计划...")
                        return
                    } else {
                        setGenerateVisible(true)
                    }
                }}>生成采购计划</Button>
            </>}
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
                    label: '塔型采购状态',
                    children: <Select style={{ width: 200 }}>
                        <Select.Option value="1">待完成</Select.Option>
                        <Select.Option value="2">待接收</Select.Option>
                        <Select.Option value="3">已完成</Select.Option>
                    </Select>
                }
            ]}
            tableProps={{
                rowSelection: {
                    type: "checkbox",
                    selectedRowKeys: generateIds,
                    onChange: (selectedRowKeys: any[]) => {
                        setGenerateIds(selectedRowKeys)
                    }
                }
            }}
        />
    </>
}
