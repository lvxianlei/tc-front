import React, { useRef, useState } from "react"
import { useHistory } from "react-router"
import { Button, Input, message, Modal } from "antd"
import { SearchTable } from "../../../common"
import Edit from "./edit"
import { table } from "./data.json"
import useRequest from "@ahooksjs/use-request"
import RequestUtil from "@utils/RequestUtil"
export default function Index() {
    const history = useHistory()
    const editRef = useRef<any>()
    const [visible, setVisible] = useState<boolean>(false)
    const [selectedKeys, setSelectedKeys] = useState<string[]>()
    const [editId, setEditId] = useState<"create" | string>("create")

    const { run: remove } = useRequest<{ [key: string]: any }>((ids: string[]) => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.delete(`/tower-system/unit?ids=${ids.join(",")}`)
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    const handleRemove = async () => {
        Modal.confirm({
            title: '删除',
            content: '确定要删除吗？',
            onOk: () =>
                new Promise(async (resolve, reject) => {
                    try {
                        await remove(selectedKeys)
                        resolve(true)
                        await message.success('删除成功...')
                        history.go(0)
                    } catch (error) {
                        reject(false)
                        console.log(error)
                    }
                })
        })
    }

    const handleModalOk = async () => {
        await editRef.current?.onSave()
        setVisible(false)
        await message.success("保存成功")
        history.go(0)
    }

    return (<>
        <Modal
            title={editId === "create" ? "新建" : "编辑"}
            visible={visible}
            width={1101}
            destroyOnClose
            onCancel={() => setVisible(false)}
            onOk={handleModalOk}
            confirmLoading={editRef.current?.confirmLoading}
        >
            <Edit id={editId} ref={editRef} />
        </Modal>
        <SearchTable
            path="/tower-system/unit"
            extraOperation={<>
                <Button type="primary"
                    onClick={() => {
                        setVisible(true)
                        setEditId("create")
                    }}>
                    新建
                </Button>
                <Button
                    type="primary"
                    ghost
                    onClick={handleRemove}>
                    删除
                </Button>
            </>}
            columns={[...table as any, {
                title: "操作",
                dataIndex: "opration",
                fixed: "right",
                render: (_, records: any) => <Button
                    type="link"
                    size="small"
                    onClick={() => {
                        setVisible(true)
                        setEditId(records?.id)
                    }}
                >
                    编辑
                </Button>
            }]}
            tableProps={{
                rowSelection: {
                    selectedRowKeys: selectedKeys,
                    onChange: (selectedKeys: string[]) => setSelectedKeys(selectedKeys)
                }
            }}
            searchFormItems={[]} />
    </>)
}