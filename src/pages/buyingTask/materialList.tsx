
import React, { useState } from "react"
import { Page } from "../common"
import { DatePicker, Select, Input, Button } from 'antd'
import { materialList1 } from "./buyingTask.json"
import { Link, } from 'react-router-dom'
import { useHistory } from 'react-router';
const { RangePicker } = DatePicker;
export default function MaterialList() {
    const history = useHistory();
    const [filterValue, setFilterValue] = useState({})
    return (<Page
        path={`/tower-storage/outStock/detail/material/${"aaa"}`}
        //表格
        filterValue={filterValue}
        columns={[
            {
                "title": "序号",
                "dataIndex": "index",
                render: (_a: any, _b: any, index: number): React.ReactNode => (<span>{index + 1}</span>)
            },
            ...materialList1,
        ]}
        extraOperation={<div><Link to=""><Button type="primary">导出</Button></Link> <Link to="/buyingTask/materialList"><Button style={{ marginLeft: "900px" }} onClick={() => { history.goBack() }}>返回</Button></Link></div>}
        //头部时间
        searchFormItems={[
            {
                name: 'updateTime',
                label: '出库时间',
                children: <RangePicker style={{ width: "150px" }} />
            },
            //出库人 
            {
                name: 'outStockUserName',
                label: '出库人',
                children: <Select placeholder="部门" style={{ width: "100px" }}>
                </Select>
            },
            {
                name: 'outStockUserName',
                children: <Select placeholder="人员" style={{ width: "100px" }}>
                </Select>
            },
            // 领料人
            {
                name: 'pickingPerson',
                label: '领料人',
                children: <Select placeholder="部门" style={{ width: "100px" }}>
                </Select>
            },
            {
                name: 'pickingPerson',
                children: <Select placeholder="人员" style={{ width: "100px" }}>
                </Select>
            },
            // 查询
            {
                name: 'inquire',
                label: '查询',
                children: <Select placeholder="生产批次" style={{ width: "100px" }}>
                </Select>
            },
            {
                name: 'inquire',
                children: <Input style={{ width: "100px" }} placeholder="生产批次/材质/规格" />
            },
        ]}
    />)
}