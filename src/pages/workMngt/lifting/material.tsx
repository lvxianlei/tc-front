import { Button, Row } from "antd"
import React from "react"
import { useHistory, useLocation, useParams } from 'react-router-dom'
import { DetailTitle, SearchTable as Page } from '../../common'
import { liftingMaterial } from "./data.json"
export default function Invoicing() {
    const history = useHistory()
    const location = useLocation()
    const { planNumber } = useParams<{ planNumber: string }>()
    const orderProjectName = decodeURI(location.search).replace("?orderProjectName=", "")
    return <>
        <DetailTitle title="材料汇总" />
        <Row style={{
            padding: "8px 0",
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
        <Page
            path={`/tower-supply/task/scheme/planNumber/${planNumber}`}
            exportPath={`/tower-supply/task/scheme/planNumber/${planNumber}`}
            extraOperation={[<Button onClick={() => history.goBack()}>返回</Button>]}
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
