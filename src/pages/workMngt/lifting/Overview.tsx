import React from "react"
import { useHistory, useParams, useLocation } from 'react-router-dom'
import { DetailTitle, SearchTable as Page } from '../../common'
import { Button, Row, Space, Spin } from "antd"
import useRequest from "@ahooksjs/use-request"
import RequestUtil from "../../../utils/RequestUtil"
import { liftingDetail } from "./data.json"
export default function Invoicing() {
    const history = useHistory()
    const location = useLocation()
    const { planNumber } = useParams<{ planNumber: string }>()
    const orderProjectName = decodeURI(location.search).replace("?orderProjectName=", "")
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
            <DetailTitle title="提料明细" />
            <Row style={{
                padding:"8px 0",
                fontSize: 16,
                color: "#181818",
                fontWeight: "bold"
            }}>
                <span style={{
                    fontStyle: "normal",
                    fontSize: 12,
                }}>
                    <span>计划号：<span style={{ color: "#FF8c00" }}>{planNumber}</span></span>
                    <span style={{
                        marginLeft: 16
                    }}>工程名称：<span style={{ color: "#FF8c00" }}>{orderProjectName}</span></span>
                </span>
            </Row>
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
