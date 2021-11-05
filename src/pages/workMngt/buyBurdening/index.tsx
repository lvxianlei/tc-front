import React, { useState } from 'react'
import { Input, DatePicker, Select, Button, Form } from 'antd'
import { useHistory, Link } from 'react-router-dom'
import { baseInfo } from "./buyBurdening.json"
import { Page } from '../../common';

export default function EnquiryList(): React.ReactNode {
    const [filterValue, setFilterValue] = useState({});
    const onFilterSubmit = (value: any) => {
        if (value.statusUpdateTime) {
            const formatDate = value.statusUpdateTime.map((item: any) => item.format("YYYY-MM-DD"))
            value.updateStatusTimeStart = formatDate[0] + ' 00:00:00';
            value.updateStatusTimeEnd = formatDate[1] + ' 23:59:59';
            delete value.statusUpdateTime
        }
        setFilterValue(value)
        return value
    }

    return <>
        <Page
            path="/tower-supply/materialPurchaseTask/inquirer"
            columns={[
                ...baseInfo,
                {
                    title: '操作',
                    width: 100,
                    dataIndex: 'operation',
                    render: (_: any, records: any) => <Link to={`/workMngt/buyBurdening/detail/${records.id}`}>查看</Link>
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
                    name: 'fuzzyQuery',
                    label: '查询',
                    children: <Input placeholder="任务编号/任务单编号/订单编号/内部合同编号" maxLength={200} />
                },
            ]}
        />
    </>
}
