// 合同管理-原材料合同管理
import React, { useState, useRef } from 'react'
import { useHistory } from 'react-router-dom'
import { DatePicker, Select, Input, Button, Modal, message, Popconfirm } from 'antd'
import { IntgSelect, SearchTable as Page } from "../common"
import Edit from "./Edit"
import Overview from "./Overview"
import { contract } from "./contract.json"
import useRequest from '@ahooksjs/use-request'
import RequestUtil from '../../utils/RequestUtil'
import { deliverywayOptions, materialStandardOptions, transportationTypeOptions } from '../../configuration/DictionaryOptions'
export default function ContractMngt(): JSX.Element {
    const materialStandardEnum = materialStandardOptions?.map((item: { id: string, name: string }) => ({ value: item.id, label: item.name }))
    const deliveryMethodEnum = deliverywayOptions?.map((item: { id: string, name: string }) => ({ value: item.id, label: item.name }))
    const transportMethodEnum = transportationTypeOptions?.map((item: { id: string, name: string }) => ({ value: item.id, label: item.name }))
    const history = useHistory()
    const [editVisible, setEditVisible] = useState<boolean>(false)
    const [overviewVisible, setOverviewVisible] = useState<boolean>(false)
    const [detailId, setDetailId] = useState<string>("")
    const [oprationType, setOprationType] = useState<"new" | "edit">("new")
    const [filterValue, setFilterValue] = useState<object>({});
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

    const onFilterSubmit = (value: any) => {
        if (value.signStartTimeOrder) {
            const formatDate = value.signStartTimeOrder.map((item: any) => item.format("YYYY-MM-DD"))
            value.signStartTime = formatDate[0] + " 00:00:00"
            value.signEndTime = formatDate[1] + " 23:59:59"
        }
        if(value.time){
            const formatDate = value.time.map((item: any) => item.format("YYYY-MM-DD"))
            value.startCreateTime = formatDate[0] + " 00:00:00"
            value.endCreateTime = formatDate[1] + " 23:59:59"
            delete value.time
        }
        if (value.operatorId) {
            value.operatorId = value.operatorId?.value
        }
        setFilterValue(value)
        return value
    }

    return (
        <>
            <Modal
                destroyOnClose
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
                <Edit id={detailId} type={oprationType} ref={editRef} visibleP={editVisible}/>
            </Modal>
            <Modal
                destroyOnClose
                title="详情"
                width={1011}
                visible={overviewVisible}
                footer={[<><Button key="close" onClick={() => {
                    setDetailId("")
                    setOverviewVisible(false)
                }}>关闭</Button><Button type="primary">打印合同</Button></>]}
                onCancel={() => {
                    setDetailId("")
                    setOverviewVisible(false)
                }}
            >
                <Overview id={detailId} />
            </Modal>
            <Page
                path="/tower-supply/materialContract"
                exportPath={`/tower-supply/materialContract`}
                onFilterSubmit={onFilterSubmit}
                filterValue={filterValue}
                columns={[
                    {
                        title: "序号",
                        dataIndex: "index",
                        width: 50,
                        fixed: "left",
                        render: (_a: any, _b: any, index: number): React.ReactNode => (<span>{index + 1}</span>)
                    },
                    ...contract.map((item: any) => {
                        switch (item.dataIndex) {
                            case "materialStandard":
                                return ({ ...item, type: "select", enum: materialStandardEnum })
                            case "deliveryMethod":
                                return ({ ...item, type: "select", enum: deliveryMethodEnum })
                            case "transportMethod":
                                return ({ ...item, type: "select", enum: transportMethodEnum })
                            default:
                                return item
                        }
                    }),
                    {
                        title: "操作",
                        dataIndex: "opration",
                        fixed: "right",
                        render: (_: any, records: any) => <>
                            <Button type="link" className="btn-operation-link" disabled={records.isReceiptRef === 1}
                                onClick={() => {
                                    setOprationType("edit")
                                    setDetailId(records.id)
                                    setEditVisible(true)
                                }}>编辑</Button>
                            <Button type="link" className="btn-operation-link" onClick={() => {
                                setDetailId(records.id)
                                setOverviewVisible(true)
                            }}>详情</Button>
                            <Popconfirm
                                title="确定删除此合同吗？"
                                disabled={records.isReceiptRef === 1}
                                onConfirm={async () => {
                                    await deleteRun(records?.id)
                                    message.success("删除成功...")
                                    history.go(0)
                                }}
                                okText="确认"
                                cancelText="取消"
                            >
                                <Button
                                    type="link"
                                    size="small"
                                    className="btn-operation-link"
                                    style={{ padding: "0px" }}
                                    disabled={records.isReceiptRef === 1}
                                >删除</Button>
                            </Popconfirm>
                        </>
                    }
                ]}
                extraOperation={<>
                    <Button
                        type="primary" ghost
                        onClick={() => {
                            setDetailId("")
                            setOprationType("new")
                            setEditVisible(true)
                        }}>创建</Button>
                </>}
                searchFormItems={[
                    {
                        name: 'signStartTimeOrder',
                        label: '签订时间',
                        children: <DatePicker.RangePicker style={{ width: "200px" }} format="YYYY-MM-DD" />
                    },
                    {
                        name: 'contractStatus',
                        label: '合同状态',
                        children: <Select placeholder="请选择" style={{ width: "100px" }}>
                            <Select.Option value="1">执行中</Select.Option>
                            <Select.Option value="2">已完成</Select.Option>
                        </Select>
                    },
                    {
                        name: 'operatorId',
                        label: '经办人',
                        children: <IntgSelect placeholder="请输入" width={200} />
                    },
                    {
                        name: 'time',
                        label: '创建时间',
                        children: <DatePicker.RangePicker style={{ width: "200px" }} format="YYYY-MM-DD" />
                    },
                    {
                        name: 'fuzzyQuery',
                        label: "模糊查询项",
                        children: <Input style={{ width: "230px" }} placeholder="合同编号/关联采购计划/供应商" />
                    }
                ]}
            />
        </>
    )
}