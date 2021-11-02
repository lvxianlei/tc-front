import React from "react"
import { Button, Input, DatePicker, Select, Modal, message } from 'antd'
import { Link, useHistory } from 'react-router-dom'
import { Page } from '../../common'
import { baseInfoList } from "./planListData.json"
import useRequest from '@ahooksjs/use-request'
import RequestUtil from '../../../utils/RequestUtil'
export default function Invoicing() {
    const history = useHistory()

    const { run: deleteRun } = useRequest<{ [key: string]: any }>((id: string) => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.delete(`/tower-market/invoicing?id=${id}`)
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    const onFilterSubmit = (value: any) => {
        if (value.startLaunchTime) {
            const formatDate = value.startLaunchTime.map((item: any) => item.format("YYYY-MM-DD"))
            value.startLaunchTime = formatDate[0]
            value.endLaunchTime = formatDate[1]
        }
        return value
    }

    const handleDelete = (id: string) => {
        Modal.confirm({
            title: "删除",
            content: "确定删除此计划吗？",
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
        path="/tower-supply/materialPurchasePlan"
        columns={[
            ...baseInfoList,
            {
                title: "操作",
                dataIndex: "opration",
                fixed: "right",
                width: 100,
                render: (_: any, record: any) => {
                    return <>
                        <Link to="">关联塔形</Link>
                        <Button type="link">采购清单</Button>
                        <Button type="link" onClick={() => handleDelete(record.id)}>取消计划</Button>
                    </>
                }
            }]}
        extraOperation={<>
            <Button type="primary" ghost>导出</Button>
            <Button type="primary" ghost>创建采购计划</Button>
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
                label: '计划状态',
                children: <Select style={{ width: 200 }}>
                    <Select.Option value="1">待完成</Select.Option>、
                    <Select.Option value="2">已完成</Select.Option>
                </Select>
            },
            {
                name: 'isOpen',
                label: '采购类型',
                children: <Select style={{ width: 200 }}>
                    <Select.Option value="1">外部</Select.Option>
                    <Select.Option value="2">内部</Select.Option>
                    <Select.Option value="3">缺料</Select.Option>
                </Select>
            },
            {
                name: 'contractType',
                label: '采购计划编号',
                children: <Input />
            }
        ]}
    />
}
