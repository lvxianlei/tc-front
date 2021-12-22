import React, { useRef, useState } from "react"
import { Button, Input, DatePicker, Select, Modal, message } from 'antd'
import { Link, useHistory } from 'react-router-dom'
import { Page } from '../common'
import { picking } from "./picking.json"
import useRequest from '@ahooksjs/use-request'
import RequestUtil from '../../utils/RequestUtil'
import Edit from "./Edit"
import OverView from "./Overview"

interface EditRefProps {
    onSubmit: (type?: "saveAndApply" | "save") => void
    resetFields: () => void
}

export default function Invoicing() {
    const editRef = useRef<EditRefProps>()
    const [type, setType] = useState<"new" | "edit">("new")
    const [visible, setVisible] = useState<boolean>(false)
    const [detailVisible, setDetailVisible] = useState<boolean>(false)
    const [detailId, setDetailId] = useState<string>("")
    const history = useHistory()
    const [filterValue, setFilterValue] = useState({});
    const { run: deleteRun } = useRequest<{ [key: string]: any }>((id: string) => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.delete(`/materialPicking/${id}`)
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    const onFilterSubmit = (value: any) => {
        if (value.applyTimeStart) {
            const formatDate = value.applyTimeStart.map((item: any) => item.format("YYYY-MM-DD"))
            value.applyTimeStart = formatDate[0]
            value.applyTimeEnd = formatDate[1]
        }
        setFilterValue(value)
        return value
    }

    const handleDelete = (id: string) => {
        Modal.confirm({
            title: "删除",
            content: "确定删除此领料单吗？",
            onOk: () => new Promise(async (resove, reject) => {
                try {
                    resove(await deleteRun(id))
                    message.success("删除成功...")
                    history.go(0)
                } catch (error) {
                    reject(error)
                }
            })
        })
    }
    const handleModalOk = (type?: "saveAndApply" | "save") => new Promise(async (resove, reject) => {
        try {
            await editRef.current?.onSubmit(type)
            message.success("领料单新增成功...")
            setVisible(false)
            history.go(0)
            resove(true)
        } catch (error) {
            reject(false)
        }
    })
    return <>
        <Modal visible={visible} destroyOnClose
            width={1011} title={type === "new" ? "新增领料单" : "编辑领料单"}
            footer={[
                <Button key="saveOr" type="primary" onClick={() => handleModalOk("saveAndApply")} >保存并提交</Button>,
                <Button key="save" type="primary" onClick={() => handleModalOk()}>保存</Button>,
                <Button
                    key="close"
                    type="primary"
                    ghost
                    onClick={async () => {
                        setDetailId("")
                        setType("new")
                        setVisible(false)
                    }}>关闭</Button>
            ]}
            onCancel={() => {
                setDetailId("")
                setType("new")
                setVisible(false)
            }}>
            <Edit type={type} ref={editRef} id={detailId} />
        </Modal>
        <Modal
            destroyOnClose
            visible={detailVisible} width={1011}
            footer={<Button type="primary" onClick={() => {
                setDetailId("")
                setDetailVisible(false)
            }}>确认</Button>}
            title="详情"
            onCancel={() => {
                setDetailId("")
                setDetailVisible(false)
            }}>
            <OverView id={detailId} />
        </Modal>
        <Page
            path="/tower-supply/materialPicking"
            filterValue={filterValue}
            columns={[
                ...picking,
                {
                    title: "操作",
                    dataIndex: "opration",
                    fixed: "right",
                    width: 100,
                    render: (_: any, record: any) => {
                        return <>
                            <Button type="link" size="small" onClick={() => {

                            }}>详情</Button>
                            <Button type="link" size="small" disabled={![0, 3].includes(record.state)} onClick={() => {

                            }}>编辑</Button>
                            <Button type="link" size="small" disabled={record.state !== 0} onClick={() => handleDelete(record.id)}>删除</Button>
                            <Button type="link" size="small" disabled={record.state !== 0} onClick={() => handleDelete(record.id)}>撤回</Button>
                        </>
                    }
                }]}
            extraOperation={<Button type="primary" onClick={() => {
                setDetailId("")
                setType("new")
                setVisible(true)
            }}>新增领料单</Button>}
            onFilterSubmit={onFilterSubmit}
            searchFormItems={[
                {
                    name: 'fuzzyQuery',
                    children: <Input placeholder="工程名称/销售计划号/塔型/加工计划编号/领料人" style={{ width: 300 }} />
                },
                {
                    name: 'pickingUnitId',
                    label: '领料生产单元',
                    children: <Select style={{ width: 200 }}>
                        <Select.Option value="2">发票未开全</Select.Option>
                        <Select.Option value="3">发票已开全</Select.Option>
                    </Select>
                },
                {
                    name: 'state',
                    label: '状态',
                    children: <Select style={{ width: 200 }}>
                        <Select.Option value="1">已创建</Select.Option>
                        <Select.Option value="2">已撤回</Select.Option>
                        <Select.Option value="3">未放料</Select.Option>
                        <Select.Option value="4">部分放料</Select.Option>
                        <Select.Option value="5">已放料</Select.Option>
                    </Select>
                },
                {
                    name: 'applyTimeStart',
                    label: '申请日期',
                    children: <DatePicker.RangePicker format="YYYY-MM-DD" />
                }
            ]}
        />
    </>
}
