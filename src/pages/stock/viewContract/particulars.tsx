import React, { useState } from 'react'
import { Button, TableColumnProps, Select, DatePicker, Input } from 'antd'
import { Link, useHistory, } from 'react-router-dom'
import { Page } from '../../common'
import { particulars } from "./viewContract.json"
//状态
const projectType = [
    {
        value: 0,
        label: "待收票"
    },
    {
        value: 1,
        label: "已收票"
    },
    {
        value: 2,
        label: "待付款"
    },
    {
        value: 3,
        label: "已付款"
    }
]

export default function Particulars(): React.ReactNode {
    const history = useHistory()
    const [filterValue, setFilterValue] = useState({});
    const { RangePicker } = DatePicker;
    const onFilterSubmit = (value: any) => {
        if (value.startBidBuyEndTime) {
            const formatDate = value.startBidBuyEndTime.map((item: any) => item.format("YYYY-MM-DD"))
            value.startBidBuyEndTime = formatDate[0]
            value.endBidBuyEndTime = formatDate[1]
        }

        if (value.startBiddingEndTime) {
            const formatDate = value.startBiddingEndTime.map((item: any) => item.format("YYYY-MM-DD"))
            value.startBiddingEndTime = formatDate[0]
            value.endBiddingEndTime = formatDate[1]
        }
        setFilterValue(value)
        return value
    }

    return (
        <div>
            <Page
                path="/tower-market/contract"//no
                columns={[
                    {
                        key: 'index',
                        title: '序号',
                        dataIndex: 'index',
                        fixed:"left",
                        width: 50,
                        render: (_a: any, _b: any, index: number): React.ReactNode => (<span>{index + 1}</span>)
                    },
                    ...particulars
                    ,
                    {
                        key: 'operation',
                        title: '操作',
                        dataIndex: 'operation',
                        fixed:"right",
                        render: (_: any, records: any) => <>
                            <Button type="link" onClick={() => { }}>质保单</Button>
                            <Button type="link" onClick={() => { }}>质检单</Button>
                        </>
                    },]}
                filterValue={filterValue}
                extraOperation={<div><Link to="/project/management/new"><Button type="primary">导出</Button></Link><span style={{fontSize:"20px",color:"#F59A23"}}>已收货：重量(支)合计：2209.900     价税合计(元)合计：51425.00</span><Button onClick={()=>history.goBack()}>返回上一级</Button></div>}
                onFilterSubmit={onFilterSubmit}
                searchFormItems={[]}
            />
        </div>
    )
}