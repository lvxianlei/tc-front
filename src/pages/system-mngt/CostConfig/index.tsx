import React from "react"
import { DetailContent, DetailTitle, EditTable } from "../../common"

const columns = [
    {
        title: "产品类型",
        dataIndex: "a"
    },
    {
        title: "制单人",
        dataIndex: "a"
    },
    {
        title: "制单时间",
        dataIndex: "a"
    }
]

export default function CostConfig(): JSX.Element {

    return <DetailContent title={[<DetailTitle key="title" title="成本评估配置" />]}>
        <EditTable columns={columns} dataSource={[]} />
    </DetailContent >
}