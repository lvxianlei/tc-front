import React, { Key, useState } from "react"
import { Button, DatePicker, Input, message, Select } from "antd"
import { Page } from "../../common"
import { pageTable } from "./data.json"
export default () => {
    const [filterValue, setFilterValue] = useState({});
    const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([])
    const onSelectChange = (selected: Key[]) => setSelectedRowKeys(selected)
    return <Page
        path="/tower-aps/productionLink"
        columns={pageTable}
        extraOperation={[
            <Button type="primary" onClick={() => {
                selectedRowKeys.length <= 0 && message.warning("请勾选下达单号")
            }}>设置/变更计划交货期</Button>,
            <Button type="primary">拆分批次</Button>,
            <Button type="primary">下发技术</Button>
        ]}
        searchFormItems={[
            {
                name: 'pleasePayStatus',
                label: '产品类型',
                children: <Select style={{ width: 200 }} defaultValue="全部">
                    <Select.Option value="">全部</Select.Option>
                    <Select.Option value="1">已创建</Select.Option>
                    <Select.Option value="2">待付款</Select.Option>
                    <Select.Option value="3">部分付款</Select.Option>
                    <Select.Option value="4">已付款</Select.Option>
                </Select>
            },
            {
                name: 'time',
                label: '生产下达日期',
                children: <DatePicker.RangePicker format="YYYY-MM-DD" />
            },
            {
                name: 'fuzzyMsg',
                label: '模糊查询项',
                children: <Input placeholder="计划号/塔型/下达单号" style={{ width: 300 }} />
            }
        ]}
        tableProps={{
            rowSelection: {
                selectedRowKeys,
                onChange: onSelectChange
            }
        }}
        filterValue={filterValue}
        onFilterSubmit={(values: Record<string, any>) => {
            if (values.time) {
                const formatDate = values.time.map((item: any) => item.format("YYYY-MM-DD"))
                values.startTime = formatDate[0] + ' 00:00:00';
                values.endTime = formatDate[1] + ' 23:59:59';
            }
            setFilterValue(values);
            return values;
        }}
    />
}