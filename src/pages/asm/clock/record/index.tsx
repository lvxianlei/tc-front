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
            dataIndex: "userName"
        },{
            title: "日期",
            width: 150,
            dataIndex: "clockDate",
            render: (clockDate: any): React.ReactNode => {
                return <span>{clockDate.format('YYYY-MM-DD')}</span>
            } 
        },{
            title: "时间要求",
            width: 150,
            dataIndex: "datetime"
              
        },{
            title: "打卡时间",
            width: 150,
            dataIndex: "clockDate",
            render: (clockDate: any): React.ReactNode => {
                return <span>{clockDate.format('HH:mm:ss')}</span>
            }
        },{
            title: "打卡位置",
            width: 150,
            dataIndex: "address"
        },{
            title: "状态",
            width: 150,
            dataIndex: "status",
            type: "select",
            enum: [
                {
                    "value": 1,
                    "label": "正常"
                },
                {
                    "value": 2,
                    "label": "迟到"
                },
                {
                    "value": 3,
                    "label": "早退"
                }
            ]
        }
    ] 
    return  <Page
            path="/tower-as/workClock"
            filterValue={filterValue}
            columns={[
                ...columns as any
            ]}
            searchFormItems={[
                {
                    name: "userName",
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
                    values.startTime = formatDate[0] + ' 00:00:00';
                    values.endTime = formatDate[1] + ' 23:59:59';
                    delete values.date
                }
                setFilterValue(values)
                return values;
            }}
        />
}