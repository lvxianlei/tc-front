import React, { useState, useRef } from "react"
import { Button, Input, DatePicker, Select, Modal, message } from 'antd'
import { useHistory } from 'react-router-dom'
import { IntgSelect, Page } from '../../common'
import { baseInfo } from "./purchaseListData.json"
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
            value.startPurchaseStatusUpdateTime = formatDate[0] + " 00:00:00"
            value.endPurchaseStatusUpdateTime = formatDate[1] + " 23:59:59"
        }
        if (value.purchaserId) {
            value.purchaserDeptId = value.purchaserId.first
            value.purchaserId = value.purchaserId.second
        }
        return value
    }

    const handlePurChasePlan = () => new Promise(async (resove, reject) => {
        try {
            const result = await purChasePlanRef.current?.onSubmit()
            resove(true)
            history.go(0)
        } catch (error) {
            reject(false)
        }
    })
    return <>
        <Modal title="配料方案" visible={visible} width={1011}
            footer={<Button type="primary" onClick={() => setVisible(false)}>确认</Button>} onCancel={() => setVisible(false)}>
            <Overview id={chooseId} />
        </Modal>
        <Modal title="生成采购计划" visible={generateVisible} width={1011} onOk={handlePurChasePlan} onCancel={() => setGenerateVisible(false)}>
            <PurchasePlan ids={generateIds} ref={purChasePlanRef} />
        </Modal>
        <Page
            path="/tower-supply/purchaseTaskTower/purchaser"
            columns={[
                {
                    title: "序号",
                    dataIndex: "index",
                    width: 40,
                    render: (_: any, _a: any, index: number) => <>{index + 1}</>
                },
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
                    children: <Input placeholder="原材料任务编号/采购计划编号/塔型" style={{ width: 300 }} />
                },
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
