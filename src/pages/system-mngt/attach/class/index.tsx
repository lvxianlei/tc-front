import React, { useRef, useState } from "react"
import { useHistory } from "react-router"
import { Button, Col, Input, message, Modal, Row, Spin, Tree } from "antd"
import { DirectoryTreeProps } from "antd/lib/tree"
import { ApartmentOutlined } from "@ant-design/icons"
import { SearchTable } from "../../../common"
import Edit from "./edit"
import useRequest from "@ahooksjs/use-request"
import RequestUtil from "@utils/RequestUtil"
import { generateTreeData } from "@utils/generateTreeData"
import { table } from "./data.json"
export default function Index() {
    const history = useHistory()
    const editRef = useRef<any>()
    const [treeSelect, setTreeSelect] = useState<{
        code: string,
        title: string,
        parentId: string,
        id: string
    }>({ code: "", title: "", id: "", parentId: "" })
    const [visible, setVisible] = useState<boolean>(false)
    const [selectedKeys, setSelectedKeys] = useState<string[]>()
    const [editId, setEditId] = useState<"create" | string>("create")

    const { loading, data: treeData } = useRequest<any[]>(() => new Promise(async (resole, reject) => {
        try {
            const result: any[] = await RequestUtil.get(`/tower-system/docType/tree`)
            resole(result)
        } catch (error) {
            reject(error)
        }
    }))

    const { run: remove } = useRequest<{ [key: string]: any }>((ids: string[]) => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.delete(`/tower-system/docType?ids=${ids.join(",")}`)
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

    const handleSelect: DirectoryTreeProps['onSelect'] = (_keys, { node }: any) => {
        setTreeSelect({
            code: node.code,
            id: node.id,
            parentId: node.parentId,
            title: node.title as string
        } as any)
    }

    return (
        <>
            <Modal
                title={editId === "create" ? "新建" : "编辑"}
                visible={visible}
                width={1101}
                destroyOnClose
                onCancel={() => setVisible(false)}
                onOk={handleModalOk}
                confirmLoading={editRef.current?.confirmLoading}
            >
                <Edit id={editId} ref={editRef} parent={treeSelect} />
            </Modal>
            <SearchTable
                path="/tower-system/docType"
                filterValue={{ parentId: treeSelect.parentId }}
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
                columns={[...table, {
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
                        label: "分类编码",
                        children: <Input placeholder="分类编码" style={{ width: 200 }} />
                    },
                    {
                        name: 'name',
                        label: "分类名称",
                        children: <Input placeholder="分类名称" style={{ width: 200 }} />
                    },
                ]}
                tableProps={{
                    rowSelection: {
                        selectedRowKeys: selectedKeys,
                        onChange: (selectedKeys: string[]) => setSelectedKeys(selectedKeys)
                    }
                }}
                tableRender={(dom: any) => <Row gutter={[8, 8]}>
                    <Col span={3}>
                        <Spin spinning={loading}>
                            <Tree.DirectoryTree
                                showIcon
                                defaultExpandAll
                                onSelect={handleSelect}
                                treeData={[{
                                    key: "",
                                    title: "全部",
                                    icon: <ApartmentOutlined />,
                                },
                                ...generateTreeData(treeData || [])]}
                            />
                        </Spin>
                    </Col>
                    <Col span={21}>{dom}</Col>
                </Row>}
            />
        </>)
}