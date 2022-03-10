
import React, { useState } from "react"
import { IntgSelect, Page } from "../common"
import { DatePicker, Input, Button } from 'antd'
import { materialList1 } from "./buyingTask.json"
import { Link, } from 'react-router-dom'
import { useHistory, useParams } from 'react-router';
const { RangePicker } = DatePicker;
export default function MaterialList() {
    const params = useParams<{ id: string }>()
    const history = useHistory();
    const [filterValue, setFilterValue] = useState({})

    const onFilterSubmit = (value: any) => {
        if (value.startOutStockTime) {
            const formatDate = value.startOutStockTime.map((item: any) => item.format("YYYY-MM-DD"))
            value.startOutStockTime = formatDate[0] + ' 00:00:00';
            value.endOutStockTime = formatDate[1] + ' 23:59:59';
        }
        if(value.outStockStaffId){
            value.outStockStaffId = value.outStockStaffId.second
        }
        if(value.createUser){
            value.createUser = value.createUser.second
        }
        setFilterValue(value)
        return value
    }

    return (<Page
        path={`/tower-storage/outStock/detail/material/${params.id}`}
        filterValue={filterValue}
        onFilterSubmit={onFilterSubmit}
        columns={[
            {
                "title": "序号",
                "dataIndex": "index",
                render: (_a: any, _b: any, index: number): React.ReactNode => (<span>{index + 1}</span>)
            },
            ...materialList1
        ]}
        extraOperation={[
            <Link to=""><Button type="primary">导出</Button></Link>,
            <Link to="/buyingTask/materialList">
                <Button onClick={() => history.goBack()}>返回</Button>
            </Link>]}
        searchFormItems={[
            {
                name: 'startOutStockTime',
                label: '出库时间',
                children: <RangePicker style={{ width: "200px" }} />
            },
            {
                name: 'outStockStaffId',
                label: '出库人',
                children: <IntgSelect width={300} />
            },
            {
                name: 'createUser',
                label: '领料人',
                children: <IntgSelect width={300} />
            },
            {
                name: 'fuzzyQuery',
                label: '查询',
                children: <Input style={{ width: "200px" }} placeholder="生产批次/材质/规格" />
            }
        ]}
    />)
}