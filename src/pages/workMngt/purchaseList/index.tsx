import React, { useState, useRef } from "react"
import { Button, Input, Select, Modal, message } from 'antd'
import { useHistory } from 'react-router-dom'
import { IntgSelect, SearchTable as Page } from '../../common'
import { baseInfo } from "./purchaseListData.json"
import Overview from "./Overview"
import PurchasePlan from "./PurchasePlan"
export default function Invoicing() {
    const history = useHistory()
    const purChasePlanRef = useRef<{ onSubmit: () => void, confirmLoading: boolean }>({ onSubmit: () => { }, confirmLoading: false })
    const [visible, setVisible] = useState<boolean>(false)
    const [generateVisible, setGenerateVisible] = useState<boolean>(false)
    const [generateIds, setGenerateIds] = useState<string[]>([])
    const [chooseId, setChooseId] = useState<string>("")
    const [filterValue, setFilterValue] = useState<object>({
        ...history.location.state as object,
        purchaserId: history.location.state ? sessionStorage.getItem('USER_ID') : "",
    });
    const onFilterSubmit = (value: any) => {
        if (value.startPurchaseStatusUpdateTime) {
            const formatDate = value.startPurchaseStatusUpdateTime.map((item: any) => item.format("YYYY-MM-DD"))
            value.startPurchaseStatusUpdateTime = formatDate[0] + " 00:00:00"
            value.endPurchaseStatusUpdateTime = formatDate[1] + " 23:59:59"
        }
        if (value.purchaserId) {
            value.purchaserId = value.purchaserId.value
        }
        setFilterValue(value)
        return value
    }

    const handlePurChasePlan = () => new Promise(async (resove, reject) => {
        try {
            await purChasePlanRef.current?.onSubmit()
            message.success("成功生成采购计划...")
            resove(true)
            history.go(0)
        } catch (error) {
            reject(false)
        }
    })
    return <>
        <Modal title="明细" visible={visible} width={1011}
            footer={<Button type="primary" ghost onClick={() => setVisible(false)}>关闭</Button>} onCancel={() => setVisible(false)}>
            <Overview id={chooseId} />
        </Modal>
        <Modal
            title="生成采购计划"
            visible={generateVisible}
            width={1011}
            onOk={handlePurChasePlan}
            confirmLoading={purChasePlanRef.current?.confirmLoading}
            onCancel={() => setGenerateVisible(false)}>
            <PurchasePlan ids={generateIds} ref={purChasePlanRef} />
        </Modal>
        <Page
            path="/tower-supply/task/purchase/purchaser"
            exportPath="/tower-supply/task/purchase/purchaser"
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
                    width: 100,
                    render: (_: any, record: any) => <Button className="btn-operation-link" disabled={![1, 3].includes(record.purchaseTaskStatus)} type="link" onClick={() => {
                        setVisible(true)
                        setChooseId(record.id)
                    }}>明细</Button>
                }]}
            extraOperation={<>
                <Button type="primary" ghost onClick={() => {
                    if (!generateIds || generateIds.length <= 0) {
                        message.warning("必须选择任务才能生成采购计划...")
                        return
                    } else {
                        setGenerateVisible(true)
                    }
                }}>生成采购计划</Button>
            </>}
            filterValue={filterValue}
            onFilterSubmit={onFilterSubmit}
            searchFormItems={[
                {
                    name: 'purchaseTaskStatus',
                    label: '塔型采购状态',
                    children: <Select style={{ width: 200 }} defaultValue={""}>
                        <Select.Option value="">全部</Select.Option>
                        <Select.Option value="1">待完成</Select.Option>
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
                    label: "模糊查询项",
                    children: <Input placeholder="批次号/计划号/原材料任务编号/采购计划编号/塔型" style={{ width: 300 }} />
                }
            ]}
            tableProps={{
                rowSelection: {
                    type: "checkbox",
                    selectedRowKeys: generateIds,
                    onChange: (selectedRowKeys: any[]) => {
                        setGenerateIds(selectedRowKeys)
                    },
                    getCheckboxProps: (record: any) => !([1].includes(record.purchaseTaskStatus) && [-1, null].includes(record.purchasePlanId))
                }
            }}
        />
    </>
}
