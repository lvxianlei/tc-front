/***
 * 新修改的原材料入库
 * 原文件地址当前目录：OriginalDocument.tsx
 * 时间：2022/01/06
 */
import React, { useState, useRef } from 'react';
import { Input, Select, DatePicker, Button, Modal, message, Radio, Popconfirm } from 'antd';
import { FixedType } from 'rc-table/lib/interface'
import { SearchTable as Page } from '../../common';
import { Link, useHistory } from 'react-router-dom';
import { baseColumn, baseDetail } from "./data.json";
import CreatePlan from "./CreatePlan";
import useRequest from '@ahooksjs/use-request';
import RequestUtil from '@utils/RequestUtil';
interface EditRefProps {
    id?: string
    onSubmit: () => void
    resetFields: () => void
}

export default function RawMaterialWarehousing(): React.ReactNode {
    const history = useHistory();
    const [visible, setVisible] = useState<boolean>(false);
    const [confirmLoading, setConfirmLoading] = useState<boolean>(false);
    const [tabs, setTabs] = useState<1 | 2>(1)
    const [pagePath, setPagePath] = useState<string>("/tower-storage/warehousingEntry/auxiliary")
    const [editId, setEditId] = useState<string>();
    const [oprationType, setOperationType] = useState<"create" | "edit">("create")
    const addRef = useRef<EditRefProps>();
    const editRef = useRef<EditRefProps>();
    const [filterValue, setFilterValue] = useState<any>({
        fuzzyQuery: "",
        receiveStatus: "",
        startStatusUpdateTime: "",
        endStatusUpdateTime: "",
    });
    const [num, setNum] = useState<any>({});
     //统计
     const { loading, data, run } = useRequest((filterValue: Record<string, any>) => new Promise(async (resole, reject) => {
        const data = await RequestUtil.get<any>(`/tower-storage/warehousingEntry/statisticsWarehousingEntry`, { ...filterValue, materialType: 2 })
        setNum(data)
        resole(data)
    }))
    // 删除
    const { loading: deleting, run: deleteRun } = useRequest<{ [key: string]: any }>((id: string) => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.delete(`/tower-storage/warehousingEntry/auxiliary/${id}`)
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })
    // 查询按钮
    const onFilterSubmit = (value: any) => {
        if (value.startRefundTime) {
            const formatDate = value.startRefundTime.map((item: any) => item.format("YYYY-MM-DD"))
            value.startStatusUpdateTime = `${formatDate[0]} 00:00:00`
            value.endStatusUpdateTime = `${formatDate[1]} 23:59:59`
            delete value.startRefundTime
        }
        setFilterValue({ ...value })
        run(value)
        return value
    }
    // 新增回调
    const handleOk = () => new Promise(async (resove, reject) => {
        try {
            await addRef.current?.onSubmit()
            message.success("完善纸质单号成功...")
            setVisible(false)
            history.go(0)
            resove(true)
        } catch (error) {
            reject(false)
        }
    })

    const handleRadioChange = (event: any) => {
        if (event.target.value === 1) {
            setTabs(1)
            setPagePath("/tower-storage/warehousingEntry/auxiliary")
            return
        }
        if (event.target.value === 2) {
            setTabs(2)
            setPagePath("/tower-storage/warehousingEntry/auxiliary/detailList")
            return
        }
    }

    const handleDelete = async (id: string) => {
        await deleteRun(id)
        await message.success("成功删除...")
        history.go(0)
    }

    const handleModalOk = () => new Promise(async (resove, reject) => {
        setConfirmLoading(true)
        try {
            const isClose = await editRef.current?.onSubmit()
            if (isClose) {
                await message.success("操作成功...");
                setVisible(false)
                setConfirmLoading(false)
                history.go(0)
            }
        } catch (error) {
            setConfirmLoading(false)
            reject(false)
        }
    })

    const { data: warehouseData } = useRequest<{ [key: string]: any }>(() => new Promise(async (resole, reject) => {
        try {
            const [warehouseList, classify] = await Promise.all<any>([
                RequestUtil.get(`/tower-storage/warehouse/tree?type=0`),
                RequestUtil.get(`/tower-system/materialCategory`, {
                    materialDataType: 2
                })
            ])
            resole({
                warehouseList,
                classify: classify.map((item: any) => ({
                    value: item.name,
                    label: item.name,
                    children: item.children.map((cItem: any) => ({
                        value: cItem.name,
                        label: cItem.name
                    }))
                }))
            })
        } catch (error) {
            reject(error)
        }
    }))
    return (
        <>
            <Page
                path={pagePath}
                exportPath={pagePath}
                columns={[
                    {
                        key: 'index',
                        title: '序号',
                        dataIndex: 'index',
                        fixed: "left",
                        width: 50,
                        render: (_a: any, _b: any, index: number): React.ReactNode => (<span>{index + 1}</span>)
                    },
                    ...(tabs === 1 ? baseColumn : baseDetail.map((item)=>{
                        switch (item.dataIndex) {
                            case "num":
                                return ({
                                    ...item,
                                    render: (value: any, records: any, key: number) => {
                                            return <span>{value}</span>
                                    }
                                })
                            case "totalTaxPrice":
                                return ({
                                    ...item,
                                    render: (value: any, records: any, key: number) => {
                                            return <span>{value}</span>
                                    }
                                })
                            case "totalPrice":
                                return ({
                                    ...item,
                                    render: (value: any, records: any, key: number) => {
                                            return <span>{value}</span>
                                    }
                                }) 
                            default:
                                return item
                        }
                    })) as any,
                    {
                        title: '操作',
                        dataIndex: 'key',
                        width: 160,
                        fixed: 'right' as FixedType,
                        render: (_: undefined, record: any): React.ReactNode => {
                            if (tabs === 1) {
                                return (
                                    <>
                                        <Link className='btn-operation-link' to={`/auxStock/entryWarehouse/detail/${record.id}/${record.approval}`}>明细</Link>
                                        <Button
                                            type="link"
                                            disabled={record?.receiveStatus === 1}
                                            onClick={
                                                () => {
                                                    setVisible(true)
                                                    setEditId(record.id)
                                                    setOperationType("edit")
                                                }
                                            }>编辑</Button>
                                        <Popconfirm
                                            title="确认删除?"
                                            onConfirm={() => handleDelete(record?.id)}
                                            okText="确认"
                                            cancelText="取消"
                                        >
                                            <Button type="link"
                                                disabled={record?.receiveStatus === 1}>删除</Button>
                                        </Popconfirm>
                                    </>
                                )
                            }
                            return <Button
                                type="link"
                                onClick={() => history.push(`/auxStock/entryWarehouse/detail/${record.warehousingEntryId}/${record.approval}`)}
                            >所在单据</Button>
                        }
                    }
                ]}
                filterValue={filterValue}
                onFilterSubmit={onFilterSubmit}
                extraOperation={
                    <>
                        <Button type='primary' ghost onClick={() => {
                            setVisible(true)
                            setEditId("")
                            setOperationType("create")
                        }}>创建</Button>
                        <div style={{ width: "2000px" }}>
                            <Radio.Group defaultValue={tabs} onChange={handleRadioChange}>
                                <Radio.Button value={1}>入库单列表</Radio.Button>
                                <Radio.Button value={2}>入库明细</Radio.Button>
                            </Radio.Group>
                        </div>
                        <span>
                            <span >数量合计：<span style={{ marginRight: 12, color: "#FF8C00" }}>{num?.entryNum||0}</span></span>
                            <span >理算重量合计（吨）：<span style={{ marginRight: 12, color: "#FF8C00" }}>{num?.receiveWeight||0}</span></span>
                            <span >过磅重量合计（吨）：<span style={{ marginRight: 12, color: "#FF8C00" }}>{num?.receivePonderationWeight||0}</span></span>
                            <span >含税金额合计（元）：<span style={{ marginRight: 12, color: "#FF8C00" }}>{num?.receiveTaxPrice||0}</span></span>
                            <span >不含税金额合计（元）：<span style={{ marginRight: 12, color: "#FF8C00" }}>{num?.receivePrice||0}</span></span>
                        </span>
                    </>
                }
                searchFormItems={[
                    {
                        name: 'startRefundTime',
                        label: '最新状态变更时间',
                        children: <DatePicker.RangePicker format="YYYY-MM-DD" style={{ width: 220 }} />
                    },
                    {
                        name: 'receiveStatus',
                        label: '状态',
                        children: (
                            <Select placeholder="请选择状态" style={{ width: "140px" }}>
                                <Select.Option value="">全部</Select.Option>
                                <Select.Option value="0">待完成</Select.Option>
                                <Select.Option value="1">已完成</Select.Option>
                            </Select>
                        )
                    },
                    {
                        name: 'warehousingType',
                        label: '入库类型',
                        children: (
                            <Select placeholder="请选择入库类型" style={{ width: "140px" }}>
                                <Select.Option value="">全部</Select.Option>
                                <Select.Option value="1">采购入库</Select.Option>
                                <Select.Option value="2">盘点入库</Select.Option>
                                <Select.Option value="4">退货出库</Select.Option>
                            </Select>
                        )
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
                        name: 'warehouseId',
                        label: '仓库',
                        children: <Select
                            style={{ width: 100 }}
                            defaultValue={""}
                        >
                            <Select.Option value='' key={'aa'}>全部</Select.Option>
                            {
                                warehouseData?.warehouseList?.map((item: { id: string, name: string }) => <Select.Option
                                    value={item.id}
                                    key={item.id}>{item.name}</Select.Option>)
                            }
                        </Select>
                    },
                    {
                        name: 'materialName',
                        label: '品名',
                        children: <Input width={100} maxLength={200} placeholder="请输入品名" />
                    },
                    {
                        name: 'structureSpec',
                        label: '规格',
                        children: <Input width={100} maxLength={200} placeholder="请输入规格" />
                    },
                    {
                        name: 'fuzzyQuery',
                        label: "模糊查询项",
                        children: <Input placeholder="请输入收货单号/物料编码/供应商/合同编号/联系人/联系电话进行查询" style={{ width: 300 }} />
                    }
                ]}
            />

            <Modal
                destroyOnClose
                visible={visible}
                width={1011}
                confirmLoading={confirmLoading}
                title={oprationType === "create" ? '创建入库单' : "编辑入库单"}
                onOk={handleModalOk}
                onCancel={() => {
                    setVisible(false)
                    editRef.current?.resetFields()
                }}>
                <CreatePlan ref={editRef} id={editId} type={oprationType} visible={visible}/>
            </Modal>
        </>
    )
}