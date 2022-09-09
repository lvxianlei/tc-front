import React from "react"
import { useHistory, useParams } from 'react-router-dom'
import { DetailTitle, SearchTable as Page } from '../../common'
import { Button, Space, Spin } from "antd"
import useRequest from "@ahooksjs/use-request"
import RequestUtil from "../../../utils/RequestUtil"
import { liftingDetail } from "./data.json"
export default function Invoicing() {
    const history = useHistory()
    const { planNumber, orderProjectName } = useParams<{
        planNumber: string
        orderProjectName: string
    }>()

    const { loading, data } = useRequest<{ [key: string]: any }>(() => new Promise(async (resolve, reject) => {
        try {
            const result: any = await RequestUtil.get(`/tower-supply/liftingSummary/summaryLiftingWeight?planNumber=${planNumber}`)
            resolve(result || {});
        } catch (error) {
            reject(error)
        }
    }))

    return <>
        <Spin spinning={loading}>
            <DetailTitle title={<>
                提料明细
                <span style={{
                    fontStyle: "normal",
                    fontSize: 12,
                    marginLeft: 16
                }}>
                    <span>计划号：<span style={{ color: "#FF8c00" }}>{planNumber}</span></span>
                    <span style={{
                        marginLeft: 16
                    }}>工程名称：<span style={{ color: "#FF8c00" }}>{orderProjectName}</span></span>
                </span>
            </>} />
        </Spin>
        <Page
            path="/tower-supply/liftingSummary/getLiftingDetail"
            exportPath="/tower-supply/liftingSummary/getLiftingDetail"
            extraOperation={<Space>
                <Button onClick={() => history.goBack()}>返回</Button>
                <div>计划总重(吨)：<span
                    style={{ color: "#FF8c00" }}
                >{data?.purchasePlanTotalWeight}</span></div>
                <div>提料总重(吨)：<span
                    style={{ color: "#FF8c00" }}
                >{data?.liftingTotalWeight}</span></div>
            </Space>}
            columns={[
                {
                    title: "序号",
                    dataIndex: "index",
                    fixed: "left",
                    width: 40,
                    render: (_: any, _a: any, index: number) => <>{index + 1}</>
                },
                ...liftingDetail as any]}
            filterValue={{ planNumber }}
            searchFormItems={[]}
        />
    </>

}
