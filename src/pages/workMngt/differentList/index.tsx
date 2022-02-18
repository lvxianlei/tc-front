import React, { useState } from "react"
import { Button, Input, DatePicker, Select, Modal, message } from 'antd'
import { Link, useHistory } from 'react-router-dom'
import { IntgSelect, Page } from '../../common'
import { baseInfoList } from './differentListData.json'
import useRequest from '@ahooksjs/use-request'
import RequestUtil from '../../../utils/RequestUtil'

export default function Invoicing() {
    const history = useHistory()
    const [filterValue, setFilterValue] = useState<any>({})
    const { run: deleteRun } = useRequest<{ [key: string]: any }>((id: string) => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.delete(`/tower-market/invoicing?id=${id}`)
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    const onFilterSubmit = (value: any) => {
        if (value.startStatusUpdateTime) {
            const formatDate = value.startStatusUpdateTime.map((item: any) => item.format("YYYY-MM-DD"))
            value.startStatusUpdateTime = formatDate[0] + " 00:00:00"
            value.endStatusUpdateTime = formatDate[1] + " 23:59:59"
        }
        if (value.handler) {
            value.handlerDept = value.handler.first
            value.handler = value.handler.second
        }
        setFilterValue({ ...filterValue, ...value })
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
        path="/tower-supply/componentDiff"
        exportPath={"/tower-supply/componentDiff"}
        columns={[
            { title: "序号", dataIndex: "index", width: 50, render: (_: any, _a: any, index) => <>{index + 1}</> },
            ...baseInfoList,
            {
                title: "操作",
                dataIndex: "opration",
                fixed: "right",
                width: 100,
                render: (_: any, record: any) => {
                    return <Link to={`/ingredients/differentList/detail/${record.id}`}>查看</Link>

                }
            }]}
        filterValue={filterValue}
        // extraOperation={<Button type="primary" ghost>导出</Button>}
        onFilterSubmit={onFilterSubmit}
        searchFormItems={[
            {
                name: 'startStatusUpdateTime',
                label: '最新状态变更时间',
                children: <DatePicker.RangePicker format="YYYY-MM-DD" />
            },
            {
                name: 'diffStatus',
                label: '处理状态',
                children: <Select style={{ width: 200 }}>
                    <Select.Option value="1">待处理</Select.Option>
                    <Select.Option value="2">已完成</Select.Option>
                </Select>
            },
            {
                name: 'handler',
                label: '处理人',
                children: <IntgSelect width={400} />
            },
            {
                name: 'fuzzyQuery',
                label: "模糊查询项",
                children: <Input placeholder="差异编号/内部合同编号/生产批次/塔型" style={{ width: 300 }} />
            }
        ]}
    />
}
