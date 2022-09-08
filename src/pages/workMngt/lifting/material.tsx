import React from "react"
import { useParams } from 'react-router-dom'
import { DetailTitle, SearchTable as Page } from '../../common'
import { liftingMaterial } from "./data.json"
export default function Invoicing() {
    const { planNumber, orderProjectName } = useParams<{
        planNumber: string
        orderProjectName: string
    }>()

    return <>
        <DetailTitle title={<>
            材料汇总
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
        <Page
            path={`/tower-supply/task/scheme/planNumber/${planNumber}`}
            exportPath={`/tower-supply/task/scheme/planNumber/${planNumber}`}
            columns={[
                {
                    title: "序号",
                    dataIndex: "index",
                    fixed: "left",
                    width: 40,
                    render: (_: any, _a: any, index: number) => <>{index + 1}</>
                },
                ...liftingMaterial as any
            ]}
            searchFormItems={[]}
        />
    </>
}
