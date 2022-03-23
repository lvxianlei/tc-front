import React, { Key, useState } from "react"
import { Link } from "react-router-dom"
import { Button, DatePicker, Input, Radio, Select } from "antd"
import { Page } from "../../common"
import { pageTable, workShopOrder } from "./data.json"

export default () => {
    const [filterValue, setFilterValue] = useState<{ [key: string]: any }>({});
    const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([])
    const onSelectChange = (selected: Key[]) => setSelectedRowKeys(selected)
    const [status, setStatus] = useState<number>(1)
    const [refresh, setRefresh] = useState<boolean>(false)

    return <Page
        // path="/tower-aps/workshopOrder"
        path="/tower-aps/productionPlan"
        refresh={refresh}
        columns={status === 1 ? pageTable : [...workShopOrder, {
            title: "操作",
            width: 100,
            fixed: "right",
            dataIndex: "opration",
            render: (_, record: any) => <Link
                to={`/planSchedule/publishWorkshop/${record.id}`}
            ><Button type="link">手动分配车间</Button></Link>
        }]}
        extraOperation={
            <>
                <Radio.Group
                    value={status}
                    onChange={(event) => {
                        setStatus(event.target.value)
                        setFilterValue({ ...filterValue, status: event.target.value })
                        setRefresh(true)
                    }}
                >
                    <Radio.Button value={1}>待分配下达单</Radio.Button>
                    <Radio.Button value={2}>已分配下达单</Radio.Button>
                </Radio.Group>
                {status === 1 && <Button type="primary">自动分配车间</Button>}
            </>
        }
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
        filterValue={filterValue}
        tableProps={status === 1 ? {
            rowSelection: {
                selectedRowKeys: selectedRowKeys,
                onChange: onSelectChange
            }
        } : {}}
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