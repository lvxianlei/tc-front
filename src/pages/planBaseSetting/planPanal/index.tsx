import React, { useState } from "react"
import { useHistory } from "react-router-dom"
import { DatePicker, Input, Radio } from "antd"
import { SearchTable as Page } from "../../common"
import { tableHeader } from "./data.json"
export default () => {
    const history = useHistory()
    const [status, setStatus] = useState<number>(1)
    const [filterValue, setFilterValue] = useState<{ [key: string]: any }>({});
    return <>
        <Page
            path="/tower-aps/workshopOrder"
            filterValue={filterValue}
            columns={[...tableHeader as any, {
                title: "组焊加工",
                align: "center",
                children: [
                    {
                        name: "11111111",
                        code: "test"
                    },
                    {
                        name: "22222",
                        code: "test"
                    },
                    {
                        name: "3333333",
                        code: "test"
                    },
                ]
            }]}
            extraOperation={
                <Radio.Group
                    value={status}
                    onChange={(event) => {
                        setStatus(event.target.value)
                        setFilterValue({ ...filterValue, status: event.target.value })
                    }}
                >
                    <Radio.Button value={1}>角钢塔</Radio.Button>
                    <Radio.Button value={2}>四管塔</Radio.Button>
                    <Radio.Button value={3}>钢管杆</Radio.Button>
                    <Radio.Button value={4}>架构</Radio.Button>
                    <Radio.Button value={5}>基础</Radio.Button>
                </Radio.Group>
            }
            searchFormItems={[
                {
                    name: "",
                    label: "计划号",
                    children: <Input placeholder="计划号" style={{ width: 150 }} />
                },
                {
                    name: "",
                    label: "塔型",
                    children: <Input placeholder="塔型" style={{ width: 150 }} />
                },
                {
                    name: "",
                    label: "批次号",
                    children: <Input placeholder="批次号" style={{ width: 150 }} />
                },
                {
                    name: "",
                    label: "电压等级",
                    children: <Input placeholder="电压等级" style={{ width: 150 }} />
                },
                {
                    name: "",
                    label: "业务经理",
                    children: <Input placeholder="业务经理" style={{ width: 150 }} />
                },
                {
                    name: "",
                    label: "试装类型",
                    children: <Input placeholder="试装类型" style={{ width: 150 }} />
                },
                {
                    name: "",
                    label: "计划交货日期",
                    children: <DatePicker.RangePicker format="YYYY-MM-DD" />
                },
                {
                    name: "",
                    label: "客户交货日期",
                    children: <DatePicker.RangePicker format="YYYY-MM-DD" />
                }
            ]}
            onFilterSubmit={(values: any) => {
                if (values.time) {
                    const formatDate = values.time.map((item: any) => item.format("YYYY-MM-DD"))
                    values.startTime = formatDate[0] + ' 00:00:00';
                    values.endTime = formatDate[1] + ' 23:59:59';
                    delete values.time
                }
                return values;
            }}
        />
    </>
}