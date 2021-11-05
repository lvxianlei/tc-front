//合同看板-明细
import React, { useEffect, useState } from 'react'
import { Button, TableColumnProps, Select, DatePicker, Input } from 'antd'
import { Link, useHistory, useLocation, } from 'react-router-dom'
import { CommonTable, DetailContent, DetailTitle, Page } from '../../common'
import { particulars } from "./viewContract.json"
import useRequest from '@ahooksjs/use-request'
import RequestUtil from '../../../utils/RequestUtil'

export default function Particulars(): React.ReactNode {
    const history = useHistory();
    const [filterValue, setFilterValue] = useState({});
    const { RangePicker } = DatePicker;
    const [columnsData, setColumnsData] = useState<any>([]);
    // const [contractId, setContractId] = useState<any>(0);
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
    console.log(history.location.pathname);
    const contractId = history.location.pathname.slice(32);
    // console.log(contractId);
    const aa = async () => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(`/tower-storage/receiveStock/detail?contractId=${contractId}`);
            console.log(result);
            console.log(result.ReceiveStockDetailPage.records);
            setColumnsData(result.ReceiveStockDetailPage.records);
        } catch (error) {
            console.log(error);
        }
    }
    useEffect(() => {
        aa();
    }, [])

    return (
        <div>
            <DetailContent>
                <DetailTitle title="操作信息" />
                <CommonTable
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
                    dataSource={columnsData}
                />
            </DetailContent>
        </div>
    )
}