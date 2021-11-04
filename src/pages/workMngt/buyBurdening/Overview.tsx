import React, { useState } from 'react'
import { Input, DatePicker, Select, Button, Form } from 'antd'
import { useHistory, Link, useParams } from 'react-router-dom'
import { Page } from '../../common';
import { SeeList } from "./buyBurdening.json"
export default function Overview(): React.ReactNode {
    const params = useParams<{ id: string }>()
    const [filterValue, setFilterValue] = useState({ purchaseTaskId: params.id });

    const onFilterSubmit = (value: any) => {
        if (value.statusUpdateTime) {
            const formatDate = value.statusUpdateTime.map((item: any) => item.format("YYYY-MM-DD"))
            value.updateStatusTimeStart = formatDate[0] + ' 00:00:00';
            value.updateStatusTimeEnd = formatDate[1] + ' 23:59:59';
            delete value.statusUpdateTime
        }
        setFilterValue({ ...filterValue, ...value })
        return value
    }

    return <>
        <Page
            path="/tower-supply/purchaseTaskTower"
            columns={[
                ...SeeList,
                {
                    title: '操作',
                    width: 100,
                    dataIndex: 'operation',
                    render: (_: any, records: any) => (<>
                        <Link to={`/workMngt/buyBurdening/component/${records.id}`}>明细</Link>
                        <Button type="link" >配料方案</Button>
                    </>)
                }
            ]}
            extraOperation={<Button type="primary" ghost>导出</Button>}
            filterValue={filterValue}
            onFilterSubmit={onFilterSubmit}
            searchFormItems={[
                {
                    name: 'statusUpdateTime',
                    label: '最新状态变更时间',
                    children: <DatePicker.RangePicker format="YYYY-MM-DD" />
                },
                {
                    name: 'status',
                    label: '配料状态',
                    children: <Select style={{ width: "100px" }} defaultValue="请选择">
                        <Select.Option value={1} key={1}>待接收</Select.Option>
                        <Select.Option value={3} key={3}>待完成</Select.Option>
                        <Select.Option value={4} key={4}>已完成</Select.Option>
                    </Select>
                },
                {
                    name: 'confirmId',
                    label: '配料人',
                    children: <div>
                        {/* <Select style={{ width: '100px' }} defaultValue="部门">
                            {confirmLeader && confirmLeader.map((item: any) => {
                                return <Select.Option key={item.id} value={item.id}>{item.name}</Select.Option>
                            })}
                        </Select>
                        <Select style={{ width: '100px' }} defaultValue="人员">
                            {confirmLeader && confirmLeader.map((item: any) => {
                                return <Select.Option key={item.id} value={item.id}>{item.name}</Select.Option>
                            })}
                        </Select> */}
                    </div>
                },
                {
                    name: 'fuzzyMsg',
                    label: '查询',
                    children: <Input placeholder="任务编号/任务单编号/订单编号/内部合同编号" maxLength={200} />
                },
            ]}
        />
    </>
}
