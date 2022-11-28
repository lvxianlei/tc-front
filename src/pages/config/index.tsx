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
                { name: "仓库管理", path: "/config/configList/warehouse", id: "warehouse" },
                { name: "原材料类型管理", path: "/config/configList/materialType", id: "materialType" },
                { name: "辅材类型管理", path: "/config/configList/auxiliaryMaterialType", id: "auxiliaryMaterialType" },
                { name: "原材料管理", path: "/config/configList/material", id: "material" },
                { name: "辅材管理", path: "/config/configList/auxiliaryMaterial", id: "auxiliaryMaterial" },
                { name: "角钢配置策略", path: "/config/configList/angleSteel", id: "angleSteel" },
                { name: "安全库存配置", path: "/config/configList/securitySetting", id: "securitySetting" },
                { name: "税率参数配置", path: "/config/configList/taxRate", id: "taxRate" },
                { name: "质检策略配置", path: "/config/configList/qualityInspection", id: "qualityInspection" },
                { name: "其他参数配置", path: "/config/configList/otherParameters", id: "otherParameters" }
            ]} />
    </DetailContent>
}