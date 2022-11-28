import React, { useRef, useState } from "react";
import { Button, Col, message, Modal, Row, Select } from "antd";
import { useHistory } from "react-router-dom";
import { SearchTable } from "../../common";
import RequestUtil from "../../../utils/RequestUtil";
import useRequest from "@ahooksjs/use-request";
import { table } from "./data.json"
import Edit from "./edit";
const changeTypeEnum: { [key in 1 | 2 | 3]: string } = {
    1: "内容变更",
    2: "计划暂停",
    3: "计划取消"
}
export default function Index() {
    const history = useHistory()
    const editRef = useRef<any>()
    const [visible, setVisible] = useState<boolean>(false)
    const [editVisible, setEditVisible] = useState<boolean>(false)
    const [planChangeType, setPlanChangeType] = useState<1 | 2 | 3>(1)
    const [selectedKeys, setSelectedKeys] = useState<string[]>([])
    const [editId, setEditId] = useState<string>("create")

    const { run: sendApplyRun } = useRequest<{ [key: string]: any }>((id: string) => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.put(`/tower-market/taskNotice?taskNoticeId=${id}`)
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    const { run: deleteNoticeRun } = useRequest<{ [key: string]: any }>((id: string) => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.delete(`/tower-market/taskNotice?taskNoticeId=${id}`)
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    const handleDelete = () => {
        Modal.confirm({
            title: "删除",
            content: "确定删除此数据吗？",
            onOk: () => new Promise(async (resove, reject) => {
                try {
                    await deleteNoticeRun(selectedKeys)
                    resove("")
                    history.go(0)
                } catch (error) {
                    reject(error)
                }
            })
        })
    }

    const handleSubmitAudit = async () => {
        Modal.confirm({
            title: "送审",
            content: "确定送审吗？",
            onOk: () => new Promise(async (resove, reject) => {
                try {
                    await sendApplyRun(selectedKeys)
                    resove("")
                    history.go(0)
                } catch (error) {
                    reject(error)
                }
            })
        })
    }

    const handleEditOk = async () => {
        editRef.current?.handleSubmit()
    }

    return <>
        <Modal
            title="新增计划变更类型"
            visible={visible}
            maskClosable={false}
            destroyOnClose
            onCancel={() => setVisible(false)}
            onOk={() => {
                setVisible(false)
                setEditVisible(true)
            }}
        >
            <Row gutter={[16, 16]}>
                <Col
                    span={6}
                    style={{
                        lineHeight: "32px",
                        textAlign: "right"
                    }}>变更类型:</Col>
                <Col span={12}>
                    <Select style={{ width: "100%" }}
                        onChange={(value) => setPlanChangeType(value)}
                        defaultValue={planChangeType}
                    >
                        <Select.Option value={1}>内容变更</Select.Option>
                        <Select.Option value={2}>计划暂停</Select.Option>
                        <Select.Option value={3}>计划取消</Select.Option>
                    </Select>
                </Col>
            </Row>
        </Modal>
        <Modal
            title={changeTypeEnum[planChangeType]}
            width={1101}
            visible={editVisible}
            destroyOnClose
            onCancel={() => setEditVisible(false)}
            onOk={handleEditOk}
        >
            <Edit id={editId} type={planChangeType} ref={editRef} />
        </Modal>
        <SearchTable
            path={`/tower-market/editNotice`}
            extraOperation={<>
                <Button
                    type="primary"
                    onClick={() => {
                        setEditId("create")
                        setVisible(true)
                    }}>新增</Button>
                <Button
                    type="primary"
                    disabled={selectedKeys.length <= 0}
                    onClick={handleSubmitAudit}>送审</Button>
                <Button
                    type="primary"
                    disabled={selectedKeys.length <= 0}
                    onClick={handleDelete}>删除</Button>
            </>}
            columns={[
                ...table as any,
                {
                    title: "操作",
                    dataIndex: "opration",
                    fixed: "right",
                    render: (_: any, record: any) => {
                        return <>
                            <Button
                                type="link"
                                size="small"
                                className='btn-operation-link'
                                onClick={() => {
                                    setEditId(record?.id)
                                    // setVisible(true)
                                }}
                            >查看</Button>
                            <Button
                                type="link" size="small"
                                className='btn-operation-link'
                                onClick={() => {
                                    setEditId(record?.id)
                                    setVisible(true)
                                }}
                            >编辑</Button>
                        </>
                    }
                }
            ]}
            searchFormItems={[]}
            onFilterSubmit={(value: any) => value}
            tableProps={{
                rowSelection: {
                    type: "checkbox",
                    selectedRowKeys: selectedKeys,
                    onChange: (selectedKeys: string[]) => setSelectedKeys(selectedKeys)
                }
            }}
        />
    </>
}