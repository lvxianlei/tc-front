import React from "react"
import { useParams } from 'react-router-dom'
import { DetailContent, SearchTable as Page } from '../../common'
import { Space, Spin } from "antd"
import useRequest from "@ahooksjs/use-request"
import RequestUtil from "../../../utils/RequestUtil"
import { baseInfo } from "./data.json"
export default function Invoicing() {
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

    return <Spin spinning={loading}>
        <DetailContent title={<>
            提料明细
            <span style={{ fontStyle: "normal" }}>
                <span>计划号：<span>{planNumber}</span></span>
                <span>工程名称：<span>{orderProjectName}</span></span>
            </span>
        </>}>
            <Page
                path="/tower-supply/liftingSummary/getLiftingDetail"
                exportPath="/tower-supply/liftingSummary/getLiftingDetail"
                extraOperation={<Space>
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
                    ...baseInfo as any]}
                filterValue={{ planNumber }}
                searchFormItems={[]}
            />
        </DetailContent>
    </Spin>
}
