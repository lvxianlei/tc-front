import React, { useRef, useState } from "react"
import { useHistory } from "react-router"
import { Button, Input, message, Modal } from "antd"
import { SearchTable } from "../../../common"
import Edit from "./edit"
import { table } from "./data.json"
export default function Index() {
    const history = useHistory()
    const editRef = useRef<any>()
    const [visible, setVisible] = useState<boolean>(false)
    const [editId, setEditId] = useState<"create" | "string">("create")
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
            path="/tower-system/unitType"
            extraOperation={<>
                <Button type="primary"
                    onClick={() => {
                        setVisible(true)
                        setEditId("create")
                    }}>
                    新建
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
    </>)
}