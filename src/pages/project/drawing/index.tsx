import React, { useState } from 'react'
import { Button, Input, DatePicker, Select } from 'antd'
import { Link, useHistory } from 'react-router-dom'
import { Page } from '../../common'
import columns from './DrawingData'

export default function Drawing(): React.ReactNode {
    const history = useHistory()
    const [filterValue, setFilterValue] = useState({})

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
    return <Page
        path="/tower-market/drawingConfirmation"
        columns={columns}
        filterValue={filterValue}
        extraOperation={<Link to="/project/drawing/new"><Button type="primary">新增图纸任务</Button></Link>}
        onFilterSubmit={onFilterSubmit}
        searchFormItems={[
            {
                name: 'fuzzyQuery',
                children: <Input placeholder="请输入工程名称/业务经理/合同名称/内部合同编号进行查询" style={{ width: 260 }} />
            },
            {
                name: 'startBidBuyEndTime',
                label: '制单日期',
                children: <DatePicker.RangePicker format="YYYY-MM-DD" />
            },
            {
                name: 'currentProjectStage',
                label: '项目状态',
                children: <Select style={{ width: "100px" }}>
                    {/* {currentProjectStage.map((item: any, index: number) => <Select.Option value={item.value} key={index}>{item.label}</Select.Option>)} */}
                </Select>
            },
        ]}
    />
}