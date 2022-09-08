import React from "react"
import { useParams } from 'react-router-dom'
import { DetailContent, SearchTable as Page } from '../../common'
import { liftingMaterial } from "./data.json"
export default function Invoicing() {
    const { planNumber, orderProjectName } = useParams<{
        planNumber: string
        orderProjectName: string
    }>()

    return <DetailContent title={<>
        材料汇总
        <span style={{ fontStyle: "normal" }}>
            <span>计划号：<span>{planNumber}</span></span>
            <span>工程名称：<span>{orderProjectName}</span></span>
        </span>
    </>}>
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
    </DetailContent>
}
