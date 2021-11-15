import React from 'react'
import { Button } from 'antd'
import { useHistory, useParams } from 'react-router-dom'
import { Page } from '../../common'
import { particulars } from "./contract.json"

export default function Particulars(): React.ReactNode {
    const history = useHistory()
    const params = useParams<{ id: string }>()
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
        return value
    }

    return (<Page
        path="/tower-storage/receiveStock/detail"
        onFilterSubmit={onFilterSubmit}
        sourceKey={"receiveStockDetailPage.records"}
        extraOperation={<>
            <Button type="primary" ghost>导出</Button>
            <Button type="primary" ghost onClick={() => history.goBack()}>返回上一级</Button>
        </>}
        filterValue={{ contractId: params.id }}
        searchFormItems={[]}
        columns={[
            {
                key: 'index',
                title: '序号',
                dataIndex: 'index',
                fixed: "left",
                width: 50,
                render: (_a: any, _b: any, index: number): React.ReactNode => (<span>{index + 1}</span>)
            },
            ...particulars,
            {
                key: 'operation',
                title: '操作',
                dataIndex: 'operation',
                fixed: "right",
                render: (_: any, records: any) => <>
                    <Button type="link" onClick={() => { }}>质保单</Button>
                    <Button type="link" onClick={() => { }}>质检单</Button>
                </>
            }
        ]}
    />)
}