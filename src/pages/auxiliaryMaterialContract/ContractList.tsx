// 合同管理-原材料合同管理
import React, { useState, useRef } from 'react'
import { useHistory } from 'react-router-dom'
import { DatePicker, Select, Input, Button, Modal, message, Popconfirm, Space } from 'antd'
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
    const editRef = useRef<{ 
        onSubmit: () => void, 
        onSubmitApproval: ()=>void, 
        onSubmitCancel: ()=>void, 
        resetFields: () => void,
        setCanEditBaseInfo:()=>void
    }>({ onSubmit: () => { }, onSubmitApproval: () => { }, resetFields: () => { }, setCanEditBaseInfo:()=>{}, onSubmitCancel: ()=>{} })
    const { run: deleteRun } = useRequest<{ [key: string]: any }>((id: string) => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.delete(`/tower-supply/materialAuxiliaryContract/${id}`)
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    const handleEditModalOk = (type: 'save'|'approvalSave'|'cancelSave') => new Promise(async (resove, reject) => {
        try {
            type==='save'&&await editRef.current.onSubmit()
            type==='approvalSave'&&await editRef.current.onSubmitApproval()
            type==='cancelSave'&&await editRef.current.onSubmitCancel()
            // message.success("保存成功...")
            resove(true)
            type==='save'&&history.go(0)
            type==='approvalSave'&&history.go(0)
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
        if (value.time) {
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
                footer={oprationType==='edit'?<Space>
                    <Button onClick={() => {
                        editRef.current?.resetFields()
                        setDetailId("")
                        setEditVisible(false)
                    }}>取消</Button>
                    <Button type='primary' onClick={()=>handleEditModalOk('save')}>保存</Button>
                    <Button type='primary' onClick={()=>handleEditModalOk('approvalSave')}>保存并发起审批</Button>
                    <Button type='primary' onClick={()=>handleEditModalOk('cancelSave')}>撤销审批</Button>
                </Space>:<Space>
                    <Button onClick={() => {
                        editRef.current?.resetFields()
                        setDetailId("")
                        setEditVisible(false)
                    }}>取消</Button>
                    <Button type='primary' onClick={()=>handleEditModalOk('save')}>保存</Button>
                    <Button type='primary' onClick={()=>handleEditModalOk('approvalSave')}>保存并发起审批</Button>
                </Space>}
                onCancel={() => {
                    editRef.current?.resetFields()
                    setDetailId("")
                    setEditVisible(false)
                }}>
                <Edit id={detailId} type={oprationType} ref={editRef} />
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
                path="/tower-supply/materialAuxiliaryContract"
                exportPath={`/tower-supply/materialAuxiliaryContract`}
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
                            <Button type="link" className="btn-operation-link" disabled={records.contractStatus === 3 || records.contractStatus === 4 || records.contractStatus === 5 }
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
                                disabled={records.isReceiptRef !== 0}
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
                                    disabled={records.isReceiptRef !== 0}
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
                            console.log(editRef)
                            // editRef.current?.setCanEditBaseInfo()
                        }}>创建</Button>
                </>}
                searchFormItems={[
                    {
                        name: 'signStartTimeOrder',
                        label: '签订时间',
                        children: <DatePicker.RangePicker style={{ width: "200px" }} format="YYYY-MM-DD" />
                    },
                    {
                        name: 'time',
                        label: '创建时间',
                        children: <DatePicker.RangePicker style={{ width: "200px" }} format="YYYY-MM-DD" />
                    },
                    {
                        name: 'contractStatus',
                        label: '合同状态',
                        children: <Select placeholder="请选择" style={{ width: "100px" }}>
                            <Select.Option value="">全部</Select.Option>
                            <Select.Option value="1">未到货</Select.Option>
                            <Select.Option value="2">部分到货</Select.Option>
                            <Select.Option value="3">已到货</Select.Option>
                            <Select.Option value="4">部分入库</Select.Option>
                            <Select.Option value="5">已入库</Select.Option>
                        </Select>
                    },
                    {
                        name: 'operatorId',
                        label: '经办人',
                        children: <IntgSelect placeholder="请输入" width={200} />
                    },
                    {
                        name: 'approval',
                        label: '审批状态',
                        children: <Select placeholder="请选择" style={{ width: "100px" }}>
                            <Select.Option value="0">待发起</Select.Option>
                            <Select.Option value="1">审批中</Select.Option>
                            <Select.Option value="2">审批通过</Select.Option>
                            <Select.Option value="3">审批驳回</Select.Option>
                            <Select.Option value="4">已撤销</Select.Option>
                        </Select>
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