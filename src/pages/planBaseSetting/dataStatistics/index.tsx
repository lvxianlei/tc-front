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
            dataIndex: "orderProjectName"
        },
        {
            title: "合同号",
            width: 150,
            dataIndex: "internalNumber"
        },
        {
            title: "计划号",
            width: 150,
            dataIndex: "planNumber"
        },
        {
            title: "塔型",
            width: 150,
            dataIndex: "productCategory"
        },
        {
            title: "基数",
            width: 150,
            dataIndex: "number"
        },
        {
            title: "总重量（t）",
            width: 150,
            dataIndex: "totalWeight"
        },
        {
            title: "报工重量（t）",
            width: 200,
            dataIndex: "reportWeight"
        },
        {
            title: "总件数",
            dataIndex: "totalNumber",
            width: 200,
        },
        {
            title: "报工件数",
            dataIndex: "reportNum",
            width: 200,
        },
        {
            title: "总孔数",
            dataIndex: "totalHolesNum",
            width: 150,
        },
        {
            title: "报工孔数",
            dataIndex: "reportHolesNum",
            width: 200,
        },
        {
            title: "加工进度（%）",
            width: 150,
            dataIndex: "reportRate"
        }
    ] 
    return <>
        <Page
            path="/tower-aps/statistic/page"
            filterValue={filterValue}
            columns={columns}
            searchFormItems={[
                {
                    name: "productCategory",
                    label: '塔型',
                    children: <Input placeholder="塔型" style={{ width: 150 }} />
                },
                {
                    name: "planNumber",
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