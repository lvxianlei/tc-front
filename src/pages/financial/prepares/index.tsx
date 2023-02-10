import React, { useState, useRef } from "react"
import { Button, Input, DatePicker, Select, Modal, message, Popconfirm, Space } from 'antd'
import { useHistory } from 'react-router-dom'
import {  Page } from '../../common'
import Edit from "./Edit"
import Overview from "./Overview"
import AttachFile from "./AttachFile"
import { ApplicationForPayment } from "../financialData.json"
import useRequest from '@ahooksjs/use-request'
import RequestUtil from '../../../utils/RequestUtil'
import { costTypeOptions, payTypeOptions } from "../../../configuration/DictionaryOptions"

interface EditRefProps {
    onSubmit: () => void
    onSubmitApproval: () => void
    onSubmitCancel: () => void
    resetFields: () => void
}

export default function ApplyPayment() {
    const history = useHistory()
    const pleasePayTypeEnum = costTypeOptions?.map((item: { id: string, name: string }) => ({
        value: item.id,
        label: item.name
    }))
    const paymentMethodEnum = payTypeOptions?.map((item: { id: string, name: string }) => ({
        value: item.id,
        label: item.name
    }))
    const editRef = useRef<EditRefProps>()
    const fileRef = useRef<EditRefProps>()
    const [visible, setVisible] = useState<boolean>(false)
    const [type, setType] = useState<"new" | "edit">("new")
    const [detailVisible, setDetailVisible] = useState<boolean>(false)
    const [successVisible, setSuccessVisible] = useState<boolean>(false)
    const [detailId, setDetailId] = useState<string>("")
    const [filterValue, setFilterValue] = useState<object>(history.location.state as object)
    const { run: deleteRun } = useRequest<{ [key: string]: any }>((id: string) => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.delete(`/tower-supply/applyPayment?id=${id}`)
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    const { run: cancelRun } = useRequest<{ [key: string]: any }>((id: string) => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(`/tower-supply/applyPayment/workflow/cancel/${id}`)
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    const { run: approvalRun } = useRequest<{ [key: string]: any }>((id: string) => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(`/tower-supply/applyPayment/workflow/start/${id}`)
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    const { run: successRun } = useRequest<{ [key: string]: any }>((id: string) => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.post(`/tower-supply/applyPayment/adoptApply?id=${id}`)
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    const onFilterSubmit = (value: any) => {
        if (value.updateStartTime) {
            const formatDate = value.updateStartTime.map((item: any) => item.format("YYYY-MM-DD"))
            value.updateStartTime = formatDate[0] + " 00:00:00"
            value.updateEndTime = formatDate[1] + " 23:59:59"
        }
        setFilterValue(value)
        return value
    }
    const handleModalOk = (isType?: "saveAndApply" | "save" | "cancelSave") => new Promise(async (resove, reject) => {
        try {
            // await editRef.current?.onSubmit(type)
            // message.success("请款申请创建成功...")
            // setVisible(false)
            isType==='save'&& await editRef.current?.onSubmit()
            isType==='saveAndApply'&&await editRef.current?.onSubmitApproval()
            isType==='cancelSave'&&await editRef.current?.onSubmitCancel()
            setVisible(false)
            history.go(0)
            resove(true)
        } catch (error) {
            console.log(error)
            reject(false)
        }
    })

    const handleDelete = (id: string) => {
        Modal.confirm({
            title: "删除",
            content: "确定删除此请款申请吗？",
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

    const handleCancel = (id: string) => {
        Modal.confirm({
            title: "撤回请款申请",
            content: "确定撤回此请款申请吗？",
            onOk: () => new Promise(async (resove, reject) => {
                try {
                    resove(await cancelRun(id))
                    message.success("撤回成功...")
                    history.go(0)
                } catch (error) {
                    reject(error)
                }
            })
        })
    }

    const handleApprovalRun = (id: string) => {
        Modal.confirm({
            title: "发起请款申请",
            content: "发起此请款申请吗？",
            onOk: () => new Promise(async (resove, reject) => {
                try {
                    resove(await approvalRun(id))
                    message.success("成功发起请款申请...")
                    history.go(0)
                } catch (error) {
                    reject(error)
                }
            })
        })
    }

    const handleSuccessRun = async () => {
        const result = await fileRef.current?.onSubmit()
        message.success("成功完成...")
        setSuccessVisible(false)
        history.go(0)
    }

    return <>
        <Modal visible={visible} destroyOnClose
            width={1011} title={type === "new" ? "创建申请信息" : "编辑申请信息"}
            // footer={[
            //     <Button key="close" type="ghost" onClick={async () => {
            //         await editRef.current?.resetFields()
            //         setDetailId("")
            //         setType("new")
            //         setVisible(false)
            //     }}>关闭</Button>,
            //     <Button key="save" type="primary" onClick={() => handleModalOk()}>保存</Button>,
            //     <Button key="saveOr" type="primary" onClick={() => handleModalOk("saveAndApply")} >保存并发起审批</Button>
            // ]}
            footer={type ==='edit'?<Space>
                    <Button onClick={async () => {
                        await editRef.current?.resetFields()
                        setDetailId("")
                        setType("new")
                        setVisible(false)
                    }}>取消</Button>
                    <Button type='primary' onClick={()=>handleModalOk('save')}>保存</Button>
                    <Button type='primary' onClick={()=>handleModalOk('saveAndApply')}>保存并发起审批</Button>
                    <Button type='primary' onClick={()=>handleModalOk('cancelSave')}>撤销审批</Button>
                </Space>:<Space>
                    <Button onClick={async () => {
                        await editRef.current?.resetFields()
                        setDetailId("")
                        setType("new")
                        setVisible(false)
                    }}>取消</Button>
                    <Button type='primary' onClick={()=>handleModalOk('save')}>保存</Button>
                    <Button type='primary' onClick={()=>handleModalOk('saveAndApply')}>保存并发起审批</Button>
                </Space>}
            onCancel={() => {
                editRef.current?.resetFields()
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
            <Overview id={detailId} />
        </Modal>
        <Modal visible={successVisible} width={1011}
            destroyOnClose
            title="附件上传"
            onCancel={() => {
                setSuccessVisible(false)
                history.go(0)
            }}
            onOk={() => handleSuccessRun()}
        >
            <AttachFile id={detailId} ref={fileRef} />
        </Modal>
        <Page
            path="/tower-supply/applyPayment"
            exportPath={"/tower-supply/applyPayment/export"}
            sourceKey="page.records"
            // transformResult={(result:any)=>result?.page.records}
            columns={[
                { title: "序号", dataIndex: "index", width: 50, render: (_: any, _a: any, index) => <>{index + 1}</> },
                ...ApplicationForPayment.map((item: any) => {
                    if (item.dataIndex === "pleasePayType") {
                        return ({ ...item, type: "select", enum: pleasePayTypeEnum })
                    }
                    if (item.dataIndex === "paymentMethod") {
                        return ({ ...item, type: "select", enum: paymentMethodEnum })
                    }
                    return item
                }),
                {
                    title: "操作",
                    dataIndex: "operation",
                    fixed: "right",
                    width: 230,
                    render: (_: any, record: any) => {
                        return <>
                            <a className="btn-operation-link" onClick={() => {
                                setDetailId(record.id)
                                setDetailVisible(true)
                            }}>详情</a>
                            <Button
                                type="link"
                                className="btn-operation-link"
                                disabled={![undefined, 0,'0',3,'3',4,'4'].includes(record.approval)}
                                onClick={() => {
                                    setType("edit")
                                    setDetailId(record.id)
                                    setVisible(true)
                                }}>编辑</Button>
                            <Button type="link" className="btn-operation-link" disabled={![undefined, 0,'0',3,'3',4,'4'].includes(record.approval)} onClick={() => handleApprovalRun(record.id)}>发起</Button>
                            <Button type="link" className="btn-operation-link" disabled={![1,'1'].includes(record.approval)}
                                onClick={() => handleCancel(record.id)}>撤回</Button>
                            <Popconfirm
                                title="确定删除此请款申请吗？"
                                disabled={![undefined, 0,'0',3,'3',4,'4'].includes(record.approval)}
                                onConfirm={async () => {
                                    await deleteRun(record?.id)
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
                                    disabled={![undefined, 0,'0',3,'3',4,'4'].includes(record.approval)}
                                >删除</Button>
                            </Popconfirm>
                        </>
                    }
                }]}
            extraOperation={(data: any) => <>
                <Button type="primary" ghost onClick={() => {
                    setType("new")
                    setVisible(true)
                }}>申请</Button>
                <span style={{ fontSize: 16, fontWeight: 600, color: "#FF8C00" }}>累计付款金额：{data?.totalPleasePayAmount && data?.totalPleasePayAmount !== -1 ? data?.totalPleasePayAmount : 0}</span>
            </>}
            onFilterSubmit={onFilterSubmit}
            filterValue={filterValue}
            searchFormItems={[
                {
                    name: 'updateStartTime',
                    label: '最近状态变更时间',
                    children: <DatePicker.RangePicker format="YYYY-MM-DD" />
                },
                {
                    name: 'approval',
                    label: '审批状态',
                    children: <Select style={{ width: 200 }} defaultValue="全部">
                        <Select.Option value="">全部</Select.Option>
                        <Select.Option value="0">待发起</Select.Option>
                        <Select.Option value="1">审批中</Select.Option>
                        <Select.Option value="2">审批通过</Select.Option>
                        <Select.Option value="3">审批驳回</Select.Option>
                        <Select.Option value="4">已撤销</Select.Option>
                    </Select>
                },
                {
                    name: 'pleasePayStatus',
                    label: '请款状态',
                    children: <Select style={{ width: 200 }} defaultValue="全部">
                        <Select.Option value="">全部</Select.Option>
                        <Select.Option value="1">已创建</Select.Option>
                        <Select.Option value="2">待付款</Select.Option>
                        <Select.Option value="3">部分付款</Select.Option>
                        <Select.Option value="4">已付款</Select.Option>
                    </Select>
                },
                {
                    name: 'pleasePayType',
                    label: '请款类别',
                    children: <Select style={{ width: 200 }} defaultValue="全部">
                        <Select.Option value="">全部</Select.Option>
                        {pleasePayTypeEnum?.map((item: any) => <Select.Option key={item.value} value={item.value}>{item.label}</Select.Option>)}
                    </Select>
                },
                {
                    name: 'paymentReqType',
                    label: '付款类型',
                    children: <Select style={{ width: 200 }} defaultValue="全部">
                        <Select.Option value="">全部</Select.Option>
                        <Select.Option value="1">货到付款</Select.Option>
                        <Select.Option value="2">货到票到付款</Select.Option>
                        <Select.Option value="3">预付款</Select.Option>
                    </Select>
                },
                {
                    name: 'businessType',
                    label: '企业类型',
                    children: <Select style={{ width: 200 }} defaultValue="全部">
                        <Select.Option value="">全部</Select.Option>
                        <Select.Option value="1">供应商</Select.Option>
                        <Select.Option value="2">装卸公司</Select.Option>
                        <Select.Option value="3">运输公司</Select.Option>
                    </Select>
                },
                {
                    label: "模糊查询项",
                    name: 'fuzzyQuery',
                    children: <Input placeholder="请款编号/关联到货单/关联票据/企业名称" style={{ width: 300 }} />
                }
            ]}
        />
    </>
}
