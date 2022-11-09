import React from "react"
import { Input } from "antd"
import { SearchTable } from "../../../common"
import { table } from "./data.json"
export default function Index() {
    return <SearchTable
        path="/tower-system/doc"
        columns={table as any}
        searchFormItems={[
            {
                name: 'code',
                label: "文档编码",
                children: <Input placeholder="文档编码" style={{ width: 200 }} />
            },
            {
                name: 'name',
                label: "文档名称",
                children: <Input placeholder="文档名称" style={{ width: 200 }} />
            },
        ]} />
}