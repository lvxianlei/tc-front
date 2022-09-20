import React, { useState } from "react"
import { DatePicker, Input } from "antd"
import { Page } from "../../../common"
export default () => {
    const [refresh, setRefresh] = useState<boolean>(false)
    const [filterValue, setFilterValue] = useState<{ [key: string]: any }>({
        status:1
    });
    const columns = [
        {
            title: '序号',
            dataIndex: 'index',
            width: '5%',
            render: (_a: any, _b: any, index: number): React.ReactNode => {
                return (
                    <span>
                        {index + 1}
                    </span>
                )
            }
        },
        {
            title: "姓名",
            width: 150,
            dataIndex: "cyclePlanNumber"
        },{
            title: "日期",
            width: 150,
            dataIndex: "cyclePlanNumber"
        },{
            title: "时间要求",
            width: 150,
            dataIndex: "cyclePlanNumber"
        },{
            title: "打卡时间",
            width: 150,
            dataIndex: "cyclePlanNumber"
        },{
            title: "打卡位置",
            width: 150,
            dataIndex: "cyclePlanNumber"
        },{
            title: "状态",
            width: 150,
            dataIndex: "cyclePlanNumber"
        }
    ] 
    return  <Page
            path="/tower-aps/cyclePlan"
            filterValue={filterValue}
            columns={[
                ...columns as any
            ]}
            searchFormItems={[
                {
                    name: "fuzzyMsg",
                    label: '姓名',
                    children: <Input placeholder="姓名" style={{ width: 150 }} />
                },
                {
                    name: "date",
                    label: "日期起止",
                    children: <DatePicker.RangePicker format="YYYY-MM-DD" />
                }
            ]}
            refresh={refresh}
            onFilterSubmit={(values: any) => {
                if (values.date) {
                    const formatDate = values.date.map((item: any) => item.format("YYYY-MM-DD"))
                    values.planStartTime = formatDate[0] + ' 00:00:00';
                    values.planEndTime = formatDate[1] + ' 23:59:59';
                    delete values.date
                }
                setFilterValue(values)
                return values;
            }}
        />
}