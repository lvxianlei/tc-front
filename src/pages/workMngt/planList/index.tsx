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
            const result: { [key: string]: any } = await RequestUtil.post(`/tower-supply/materialPurchasePlan/${id}`)
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    const onFilterSubmit = (value: any) => {
        if (value.startStatusUpdateTime) {
            const formatDate = value.startStatusUpdateTime.map((item: any) => item.format("YYYY-MM-DD"))
            value.startStatusUpdateTime = formatDate[0] +" 00:00:00"
            value.endStatusUpdateTime = formatDate[1] +" 23:59:59"
        }
        return value
    }

    const handleDelete = (id: string) => {
        Modal.confirm({
            title: "取消计划",
            content: "确定取消此计划吗？",
            onOk: () => new Promise(async (resove, reject) => {
                try {
                    resove(await deleteRun(id))
                    message.success("计划已取消...")
                    // history.go(0)
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
                        <Link to={`/workMngt/planList/relationTower/${record.id}`}>关联塔形</Link>
                        <Link to={`/workMngt/planList/purchaseList/${record.id}`}><Button type="link">采购清单</Button></Link>
                        <a onClick={() => handleDelete(record.id)}>取消计划</a>
                    </>
                }
            }]}
        extraOperation={<>
            <Button type="primary" ghost>导出</Button>
            <Button type="primary" ghost onClick={() => message.warning("预留按钮,暂无功能...")}>创建采购计划</Button>
        </>}
        onFilterSubmit={onFilterSubmit}
        searchFormItems={[
            {
                name: 'startStatusUpdateTime',
                label: '最新状态变更时间',
                children: <DatePicker.RangePicker format="YYYY-MM-DD" />
            },
            {
                name: 'planStatus',
                label: '计划状态',
                children: <Select style={{ width: 200 }}>
                    <Select.Option value="1">待完成</Select.Option>、
                    <Select.Option value="2">已完成</Select.Option>
                </Select>
            },
            {
                name: 'purchaseType',
                label: '采购类型',
                children: <Select style={{ width: 200 }}>
                    <Select.Option value="1">外部</Select.Option>
                    <Select.Option value="2">内部</Select.Option>
                    <Select.Option value="3">缺料</Select.Option>
                </Select>
            },
            {
                name: 'purchasePlanCode',
                label: '采购计划编号',
                children: <Input />
            }
        ]}
    />
}
