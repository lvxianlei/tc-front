import React, { useRef, useState } from "react"
import { useHistory } from "react-router"
import { Button, Dropdown, Form, Input, Menu, message, Modal, Select } from "antd"
import { DownOutlined } from "@ant-design/icons"
import { BaseInfo, SearchTable } from "../../../common"
import Edit from "./edit"
import { table } from "./data.json"
import useRequest from "@ahooksjs/use-request"
import RequestUtil from "@utils/RequestUtil"
const recordEnum: { [key: string]: any } = {
    signIn: "签收日志",
    opration: "操作日志",
    examine: "审核日志"
}
export default function Index() {
    const history = useHistory()
    const editRef = useRef<any>()
    const [form] = Form.useForm()
    const [visible, setVisible] = useState<boolean>(false)
    const [sendApplyVisible, setSendApplyVisible] = useState<boolean>(false)
    const [selectedKeys, setSelectedKeys] = useState<string[]>()
    const [editId, setEditId] = useState<"create" | string>("create")
    const [sendApplyId, setSendApplyId] = useState<string>()
    const [recordType, setRecordType] = useState<string>("signIn")
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

    const handleSendApplyModalOk = async () => {
        const saveData = await form.validateFields()
        await sendApply({ ...saveData, id: sendApplyId })
        setSendApplyVisible(false)
        await message.success("送审成功")
        history.go(0)
    }

    const handleRecords = ({ key }: any, id: string) => {
        console.log(key, recordEnum[key], id)
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
        <Modal
            title="送审"
            visible={sendApplyVisible}
            width={416}
            destroyOnClose
            onCancel={() => setSendApplyVisible(false)}
            onOk={handleSendApplyModalOk}
            confirmLoading={sendApplyLoading}
        >
            <BaseInfo columns={[
                {
                    title: "送审流程",
                    dataIndex: "abc",
                    type: "select",
                    enum: []
                }
            ]} dataSource={{}} />
        </Modal>
        <Modal
            title={recordEnum[recordType]}
            visible={sendApplyVisible}
            width={416}
            destroyOnClose
            onCancel={() => setSendApplyVisible(false)}
            onOk={handleSendApplyModalOk}
            confirmLoading={sendApplyLoading}
        >
            <BaseInfo columns={[
                {
                    title: "送审流程",
                    dataIndex: "abc",
                    type: "select",
                    enum: []
                }
            ]} dataSource={{}} />
        </Modal>
        <SearchTable
            path="/tower-system/doc"
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
                            setVisible(true)
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
                            <Menu.Item key="examine">审核日志</Menu.Item>
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
        />
    </>)
}