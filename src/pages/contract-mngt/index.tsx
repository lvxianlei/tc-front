// 合同管理-原材料合同管理
import React, { useState, useRef } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { DatePicker, Select, Input, Button, Modal, message } from 'antd'
import { Page } from "../common"
import Edit from "./Edit"
import Overview from "./Overview"
import { contract } from "./contract.json"
import useRequest from '@ahooksjs/use-request'
import RequestUtil from '../../utils/RequestUtil'
import ApplicationContext from "../../configuration/ApplicationContext"
export default function ContractMngt(): JSX.Element {
    const materialStandardEnum = (ApplicationContext.get().dictionaryOption as any)["104"].map((item: { id: string, name: string }) => ({ value: item.id, label: item.name }))
    const deliveryMethodEnum = (ApplicationContext.get().dictionaryOption as any)["128"].map((item: { id: string, name: string }) => ({ value: item.id, label: item.name }))
    const transportMethodEnum = (ApplicationContext.get().dictionaryOption as any)["129"].map((item: { id: string, name: string }) => ({ value: item.id, label: item.name }))
    const history = useHistory()
    const [editVisible, setEditVisible] = useState<boolean>(false)
    const [overviewVisible, setOverviewVisible] = useState<boolean>(false)
    const [detailId, setDetailId] = useState<string>("")
    const [oprationType, setOprationType] = useState<"new" | "edit">("new")
    const editRef = useRef<{ onSubmit: () => void, resetFields: () => void }>({ onSubmit: () => { }, resetFields: () => { } })

    const { run: deleteRun } = useRequest<{ [key: string]: any }>((id: string) => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.delete(`/tower-supply/materialContract?id=${id}`)
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    const handleEditModalOk = () => new Promise(async (resove, reject) => {
        try {
            await editRef.current.onSubmit()
            message.success("保存成功...")
            resove(true)
            history.go(0)
        } catch (error) {
            reject(false)
        }
    })
    const handleDelete = (id: string) => {
        Modal.confirm({
            title: "删除",
            content: "确定删除此合同吗？",
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
    return (
        <>
            <Modal
                title={oprationType === "new" ? "创建" : "编辑"}
                width={1011}
                visible={editVisible}
                okText="保存"
                onOk={handleEditModalOk}
                onCancel={() => {
                    editRef.current?.resetFields()
                    setDetailId("")
                    setEditVisible(false)
                }}>
                <Edit id={detailId} type={oprationType} ref={editRef} />
            </Modal>
            <Modal
                title="详情"
                width={1011}
                visible={overviewVisible}
                footer={[<Button type="primary" key="close" onClick={() => {
                    setDetailId("")
                    setOverviewVisible(false)
                }}>关闭</Button>]}
                onCancel={() => {
                    setDetailId("")
                    setOverviewVisible(false)
                }}
            >
                <Overview id={detailId} />
            </Modal>
            <Page
                path="/tower-supply/materialContract"
                columns={[
                    {
                        title: "序号",
                        dataIndex: "index",
                        fixed: "left",
                        render: (_a: any, _b: any, index: number): React.ReactNode => (<span>{index + 1}</span>)
                    },
                    ...contract.map((item: any) => {
                        switch (item.dataIndex) {
                            case "materialStandard":
                                return ({ ...item, enum: materialStandardEnum })
                            case "deliveryMethod":
                                return ({ ...item, enum: deliveryMethodEnum })
                            case "transportMethod":
                                return ({ ...item, enum: transportMethodEnum })
                            default:
                                return item
                        }
                    }),
                    {
                        title: "操作",
                        dataIndex: "opration",
                        fixed: "right",
                        render: (_: any, records: any) => <>
                            <Button type="link" onClick={() => {
                                setOprationType("edit")
                                setDetailId(records.id)
                                setEditVisible(true)
                            }}>编辑</Button>
                            <Button type="link" onClick={() => {
                                setDetailId(records.id)
                                setOverviewVisible(true)
                            }}>详情</Button>
                            <Button type="link" onClick={() => handleDelete(records.id)}>删除</Button>
                        </>
                    }
                ]}
                extraOperation={<>
                    <Button type="primary" ghost>导出</Button>
                    <Link to="/contract-mngt/index"><Button
                        type="primary" ghost
                        onClick={() => {
                            setDetailId("")
                            setOprationType("new")
                            setEditVisible(true)
                        }}>创建</Button></Link>
                </>}
                searchFormItems={[
                    {
                        name: 'updateTime',
                        label: '签订时间',
                        children: <DatePicker.RangePicker style={{ width: "200px" }} format="YYYY-MM-DD" />
                    },
                    {
                        name: 'outStockUserName',
                        label: '合同状态',
                        children: <Select placeholder="请选择" style={{ width: "100px" }}>
                        </Select>
                    },
                    {
                        name: 'inquire',
                        label: '查询',
                        children: <Input style={{ width: "150px" }} placeholder="任务编号/项目名称/客户名称" />
                    }
                ]}
            />
        </>
    )
}