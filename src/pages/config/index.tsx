import React from "react"
import { Link } from "react-router-dom"
import { CommonTable, DetailContent } from "../common"
export default function Stock() {
    return <DetailContent>
        <CommonTable columns={[
            {
                title: "序号",
                dataIndex: "index",
                width: 50,
                render: (_a: any, _b: any, index: number) => <>{index + 1}</>
            },
            {
                title: "配置名称",
                dataIndex: "name",
                width: 150
            },
            {
                title: "操作",
                dataIndex: "opration",
                render: (_: any, records: any) => <Link to={records.path}>进入</Link>
            }
        ]}
            dataSource={[
                { name: "仓库管理", path: "/stock/warehouse" },
                { name: "原材料类型管理", path: "/sys/materialType" },
                { name: "原材料管理", path: "/sys/material" },
                { name: "角钢配置策略", path: "/stock/angleSteel" },
                { name: "安全库存配置", path: "/stock/securitySetting" },
                { name: "其他参数配置", path: "/stock/otherParameters" }
            ]} />
    </DetailContent>
}