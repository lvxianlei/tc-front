import React, { useRef, useState } from "react"
import { useHistory } from "react-router"
import { Button, Col, Dropdown, Input, Menu, message, Modal, Row, Select, Spin, Tree } from "antd"
import { DirectoryTreeProps } from "antd/lib/tree"
import { DownOutlined, ApartmentOutlined } from "@ant-design/icons"
import { SearchTable } from "../../../common"
import Edit from "./edit"
import useRequest from "@ahooksjs/use-request"
import RequestUtil from "@utils/RequestUtil"
import Overview from "./overview"
import Records from "./record"
import { generateTreeData } from "@utils/generateTreeData"
import { table } from "./data.json"
const recordEnum: { [key: string]: any } = {
    signIn: "签收日志",
    opration: "操作日志",
    examine: "审核日志"
}
export default function Index() {
    const history = useHistory()
    const editRef = useRef<any>()
    const [treeSelect, setTreeSelect] = useState<{
        code: string,
        title: string,
        id: string
    }>({ code: "", title: "", id: "" })
    const [visible, setVisible] = useState<boolean>(false)
    const [detailVisible, setDetailVisible] = useState<boolean>(false)
    const [recordVisible, setRecordVisible] = useState<boolean>(false)
    const [selectedKeys, setSelectedKeys] = useState<string[]>()
    const [editId, setEditId] = useState<"create" | string>("create")
    const [recordType, setRecordType] = useState<"signIn" | "opration" | "examine">("signIn")

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
            const result: { [key: string]: any } = await RequestUtil.delete(`/tower-system/doc?ids=${ids.join(",")}`)
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    const { loading: sendApplyLoading, run: sendApply } = useRequest<{ [key: string]: any }>((id: string) => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.put(`/tower-system/doc/start/${id}`)
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

    const handleSendApply = async (id: string) => {
        Modal.confirm({
            title: '送审',
            content: "确定送审吗？",
            onOk: () =>
                new Promise(async (resolve, reject) => {
                    try {
                        await sendApply(id)
                        resolve(true)
                        await message.success('送审成功...')
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

    // const handleSendApplyModalOk = async () => {
    //     const saveData = await form.validateFields()
    //     await sendApply({ ...saveData, id: sendApplyId })
    //     setSendApplyVisible(false)
    //     await message.success("送审成功")
    //     history.go(0)
    // }

    const handleRecords = ({ key }: any, id: string) => {
        setEditId(id)
        setRecordType(key)
        setRecordVisible(true)
    }

    const handleSelect: DirectoryTreeProps['onSelect'] = (_keys, { node }: any) => {
        setTreeSelect({ code: node.code, id: node.id, title: node.title as string } as any)
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
            <Edit id={editId} ref={editRef} parent={treeSelect} />
        </Modal>
        <Modal
            title="详情"
            visible={detailVisible}
            width={1101}
            destroyOnClose
            footer={[
                <Button key="close" onClick={() => {
                    setEditId("")
                    setDetailVisible(false)
                }}>关闭</Button>
            ]}
            onCancel={() => {
                setEditId("")
                setDetailVisible(false)
            }}
        >
            <Overview id={editId} />
        </Modal>
        <Modal
            title={recordEnum[recordType]}
            visible={recordVisible}
            width={1101}
            destroyOnClose
            onCancel={() => setRecordVisible(false)}
            footer={[
                <Button
                    key="close"
                    onClick={() => setRecordVisible(false)}>关闭</Button>
            ]}
        >
            <Records id={editId} type={recordType} />
        </Modal>
        <SearchTable
            path="/tower-system/doc"
            filterValue={{ typeCode: treeSelect.code, typeName: treeSelect.title }}
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
                width: 200,
                render: (_, records: any) => <>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            setDetailVisible(true)
                            setEditId(records?.id)
                        }}
                    >
                        查看
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            setVisible(true)
                            setEditId(records?.id)
                        }}
                    >
                        编辑
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={handleSendApply.bind(null, records?.id)}
                    >
                        送审
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => message.warning("功能建设中...")}
                    >
                        撤回
                    </Button>
                    <Dropdown
                        overlay={(<Menu onClick={(event: any) => handleRecords(event, records?.id)}>
                            <Menu.Item key="signIn">签收日志</Menu.Item>
                            <Menu.Item key="opration">操作日志</Menu.Item>
                            {/* <Menu.Item key="examine">审核日志</Menu.Item> */}
                        </Menu>)}
                        trigger={['click']}
                    >
                        <Button type="link" size="small">日志<DownOutlined /></Button>
                    </Dropdown>
                </>
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
                {
                    name: 'tag',
                    label: "文档标签",
                    children: <Input placeholder="文档标签" style={{ width: 200 }} />
                },
                {
                    name: 'fuzzyQuery',
                    label: "关联项目",
                    children: <Input placeholder="关联项目" style={{ width: 200 }} />
                },
                {
                    name: 'docStatus',
                    label: "文档状态",
                    children: <Select style={{ width: 200 }}>
                        <Select.Option value={1}>新建</Select.Option>
                        <Select.Option value={2}>评审</Select.Option>
                        <Select.Option value={3}>发布</Select.Option>
                        <Select.Option value={4}>撤回</Select.Option>
                    </Select>
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