import React, { useState } from "react"
import { Button, message, Modal } from "antd"
import { useHistory, useParams } from "react-router-dom"
import { SearchTable } from "../../common"
import { table } from "./frame.json"
import useRequest from "@ahooksjs/use-request"
import RequestUtil from "@utils/RequestUtil"
export default function Index() {
    const params = useParams<{ id: string }>()
    const history = useHistory()
    const [selectedKeys, setSelectedKeys] = useState<string[]>([])
    const { run: deleteRun } = useRequest<{ [key: string]: any }>((ids: string[]) => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.delete(`/tower-market/frameAgreement`)
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    const handleDelete = () => {
        Modal.confirm({
            title: "删除",
            content: "确定删除吗？",
            onOk: () => new Promise(async (resolve) => {
                await deleteRun({ ids: selectedKeys })
                await message.success("删除成功")
                resolve(true)
            })
        })
    }

    return <SearchTable
        path={`/tower-market/frameAgreement`}
        extraOperation={<>
            <Button
                type="primary"
                onClick={() => history.push(`/project/management/new/frameAgreement/${params.id}`)}
            >新增</Button>
            <Button
                type="primary"
                disabled={selectedKeys.length <= 0}
                onClick={handleDelete}>删除</Button>
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