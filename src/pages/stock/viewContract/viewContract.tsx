//合同看板
import React, { useState } from 'react'
import { Button, TableColumnProps, Select, DatePicker, Input } from 'antd'
import { Link, useHistory, useParams, } from 'react-router-dom'
import { Page } from '../../common'
import { viewContract } from "./viewContract.json"
import RequestUtil from '../../../utils/RequestUtil'
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

export default function ViewContract(): React.ReactNode {
    const history = useHistory()
    const params = useParams();
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
    const particulars = async (contractId: number) => {
        // const result: { [key: string]: any } = await RequestUtil.get(`/tower-storage/receiveStock/detail?contractId=${contractId}`)
        // console.log(result);
        // const a = result.ReceiveStockDetailPage
        // const b = result.receiveStockMessage
        // console.log(a, b, "sdvdfbd");
        history.push(`/stock/viewContract/particulars/${contractId}`)
        // history.push({
        //     pathname: `/stock/viewContract/particulars`,
        //     state: {
        //         contractId
        //     }
        // })
    }


    return (
        <div>
            <Page
                path="/tower-supply/materialContract/getMaterialContractBoardPage"
                columns={[
                    {
                        key: 'index',
                        title: '序号',
                        dataIndex: 'index',
                        width: 50,
                        render: (_a: any, _b: any, index: number): React.ReactNode => (<span>{index + 1}</span>)
                    },
                    ...viewContract
                    ,
                    {
                        key: 'operation',
                        title: '操作',
                        dataIndex: 'operation',
                        render: (_: any, records: any) => <>
                            <Button type="link" onClick={() => { particulars(records.id) }}>明细</Button>
                        </>
                    },]}
                filterValue={filterValue}
                extraOperation={<Link to="/project/management/new"><Button type="primary">导出</Button></Link>}
                onFilterSubmit={onFilterSubmit}
                searchFormItems={[
                    {
                        name: 'updateTime',
                        label: '最新状态变更时间',
                        children: <RangePicker />
                    },
                    {
                        name: 'rawMaterialType',
                        label: '状态',
                        children: <Select style={{ width: "150px" }}>
                            {projectType.map((item: any, index: number) => <Select.Option value={item.value} key={index}>{item.label}</Select.Option>)}
                        </Select>
                    },
                    {
                        name: 'inquire',
                        label: '查询',
                        children: <Input style={{ width: "113px" }} placeholder="供应商/收货单编号/关联申请编号/关联票据编号" />
                    },
                ]}
            />
        </div>
    )
}