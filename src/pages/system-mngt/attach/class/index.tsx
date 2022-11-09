import React from "react"
import { Button, Input } from "antd"
import { SearchTable } from "../../../common"
import { table } from "./data.json"
import { Link } from "react-router-dom"
export default function Index() {
    return <SearchTable
        path="/tower-system/docType"
        columns={[...table, {
            title: "操作",
            dataIndex: "opration",
            fixed: "right",
            render: (_, records: any) => <Button type="link" size="small">
                <Link to={`/attach/class/edit/create`}>编辑</Link>
            </Button>
        }]}
        searchFormItems={[
            {
                name: 'code',
                label: "分类编码",
                children: <Input placeholder="分类编码" style={{ width: 200 }} />
            },
            {
                name: 'name',
                label: "分类名称",
                children: <Input placeholder="分类名称" style={{ width: 200 }} />
            },
        ]} />
}