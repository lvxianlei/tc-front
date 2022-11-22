import React, { useState } from "react"
import { Button } from "antd"
import { useHistory, useParams } from "react-router-dom"
import { SearchTable } from "../../common"
import { table } from "./frame.json"
export default function Index() {
    const params = useParams<{ id: string }>()
    const history = useHistory()
    const [selectedKeys, setSelectedKeys] = useState<string[]>([])

    return <SearchTable
        path={`/tower-market/frameAgreement`}
        extraOperation={<>
            <Button
                type="primary"
                onClick={() => history.push(`/project/management/new/frameAgreement/${params.id}`)}
            >新增</Button>
            <Button type="primary">删除</Button>
        </>}
        filterValue={{ projectId: params.id }}
        columns={[...table as any, {
            title: "操作",
            dataIndex: "opration",
            fixed: "right",
            render: (_: undefined, records: any) => <>
                <Button
                    type="link"
                    onClick={() => history.push(`/project/management/detail/frameAgreement/detail/${records?.id}`)}
                >查看</Button>
                <Button
                    type="link"
                    onClick={() => history.push(`/project/management/edit/frameAgreement/${records?.id}`)}
                >编辑</Button>
            </>
        }]}
        searchFormItems={[]}
        tableProps={{
            rowSelection: {
                type: "checkbox",
                selectedRowKeys: selectedKeys,
                onChange: (selectKeys: string[]) => setSelectedKeys(selectKeys)
            }
        }}
    />
}