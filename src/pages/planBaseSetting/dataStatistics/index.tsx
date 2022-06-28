import React, {  useState } from "react"
import { Input, Select } from "antd"
import { Page } from "../../common"
export default () => {
    const [refresh, setRefresh] = useState<boolean>(false)
    const [filterValue, setFilterValue] = useState<{ [key: string]: any }>({});
    const columns = [
        {
            title: "工程名称",
            width: 150,
            dataIndex: "cyclePlanNumber"
        },
        {
            title: "合同号",
            width: 150,
            dataIndex: "cyclePlanNumber"
        },
        {
            title: "计划号",
            width: 150,
            dataIndex: "cyclePlanNumber"
        },
        {
            title: "塔型",
            width: 150,
            dataIndex: "cyclePlanNumber"
        },
        {
            title: "基数",
            width: 150,
            dataIndex: "cyclePlanNumber"
        },
        {
            title: "总重量（t）",
            width: 150,
            dataIndex: "cyclePlanNumber"
        },
        {
            title: "报工重量（t）",
            width: 200,
            dataIndex: "configName"
        },
        {
            title: "总件数",
            dataIndex: "startTime",
            type: "date",
            width: 200,
            format: "YYYY-MM-DD"
        },
        {
            title: "报工件数",
            dataIndex: "endTime",
            type: "date",
            width: 200,
            format: "YYYY-MM-DD"
        },
        {
            title: "总孔数",
            dataIndex: "status",
            width: 150,
            type: "select",
            enum: [
                {
                    "value": 1,
                    "label": "未下发"
                },
                {
                    "value": 2,
                    "label": "已下发"
                }
            ]
        },
        {
            title: "报工孔数",
            dataIndex: "issueTime",
            type: "date",
            width: 200,
            format: "YYYY-MM-DD"
        },
        {
            title: "加工进度",
            width: 150,
            dataIndex: "createUserName"
        }
    ] 
    return <>
        <Page
            path="/tower-aps/cyclePlan"
            filterValue={filterValue}
            columns={columns}
            searchFormItems={[
                {
                    name: "fuzzyMsg",
                    label: '塔型',
                    children: <Input placeholder="塔型" style={{ width: 150 }} />
                },
                {
                    name: "configId",
                    label: '计划号',
                    children: <Input placeholder="计划号" style={{ width: 150 }} />
                }
            ]}
            refresh={refresh}
            onFilterSubmit={(values: any) => {
                setFilterValue(values)
                return values;
            }}
        />
    </>


}