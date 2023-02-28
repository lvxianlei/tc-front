/***
 * 新修改的原材料入库
 * 原文件地址当前目录：OriginalDocument.tsx
 * 时间：2022/01/06
 */
import React, { useState, useRef } from 'react';
import { Input, Select, DatePicker, Button, Modal, message, Radio, Popconfirm, InputNumber } from 'antd';
import { FixedType } from 'rc-table/lib/interface'
import { SupplySelect, SearchTable as Page } from '../../common';
import { Link, useHistory } from 'react-router-dom';
import { baseColumn, inStockDetail } from "./RawMaterialWarehousing.json";
// 引入新增纸质单号
import PaperOrderModal from './PaperOrderModal';
import CreatePlan from "./CreatePlan";
import useRequest from '@ahooksjs/use-request';
import RequestUtil from '@utils/RequestUtil';
import { materialStandardOptions, materialTextureOptions } from '../../../configuration/DictionaryOptions';
interface EditRefProps {
    id?: string
    onSubmit: () => void
    resetFields: () => void
}
const inStock = [
    {
        key: 'index',
        title: '序号',
        dataIndex: 'index',
        fixed: "left",
        width: 50,
        render: (_a: any, _b: any, index: number): React.ReactNode => (<span>{index + 1}</span>)
    },
    ...inStockDetail,
    {
        title: '操作',
        dataIndex: 'key',
        width: 100,
        fixed: 'right' as FixedType,
        render: (_: undefined, record: any): React.ReactNode => (
            <>
                <Link to={`/stock/rawMaterialWarehousing/detail/${record.warehousingEntryId}/${record.approval}`}>所在单据</Link>
            </>
        )
    }
]
export default function RawMaterialWarehousing(): React.ReactNode {
    const history = useHistory();
    // const [visible, setVisible] = useState<boolean>(false);
    const [id, setId] = useState<string>();
    const addRef = useRef<EditRefProps>();
    const [isOpenId, setIsOpenId] = useState<boolean>(false);
    const [pagePath, setPagePath] = useState<string>("/tower-storage/warehousingEntry")
    const [editId, setEditId] = useState<string>();
    const [num, setNum] = useState<any>({});
    const [oprationType, setOperationType] = useState<"create" | "edit">("create")
    const [filterValue, setFilterValue] = useState<any>({
        fuzzyQuery: "",
        receiveStatus: "",
        startStatusUpdateTime: "",
        endStatusUpdateTime: "",
    });
     //统计
     const { loading, data, run } = useRequest((value: Record<string, any>) => new Promise(async (resole, reject) => {
        const data = await RequestUtil.get<any>(`/tower-storage/warehousingEntry/statisticsWarehousingEntry`, { ...filterValue,...value })
        setNum(data)
        resole(data)
    }))
    // 删除
    const { loading: deleting, run: deleteRun } = useRequest<{ [key: string]: any }>((id: string) => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.delete(`/tower-storage/warehousingEntry/${id}`)
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    const handleDelete = async (id: string) => {
        await deleteRun(id)
        await message.success("成功删除...")
        history.go(0)
    }
    const inStockList = [
        {
            key: 'index',
            title: '序号',
            dataIndex: 'index',
            fixed: "left",
            width: 30,
            render: (_a: any, _b: any, index: number): React.ReactNode => (<span>{index + 1}</span>)
        },
        ...(baseColumn as any).map((item: any) => {
            if (item.dataIndex === "totalWeight") {
                return ({ ...item, render: (_value: any, records: any) => <>{`${records.totalWeight || 0}/${records.completeOutStock || 0}`}</> })
            }
            return item
        }),
        {
            title: '操作',
            dataIndex: 'key',
            width: 160,
            fixed: 'right' as FixedType,
            render: (_: undefined, record: any): React.ReactNode => (
                <>
                    <Button type="link"
                        onClick={() => history.push(`/stock/rawMaterialWarehousing/detail/${record.id}/${record.approval}`)}
                    >明细</Button>
                    <Button
                        type="link"
                        onClick={
                            () => {
                                setIsOpenId(true)
                                setEditId(record.id)
                                setOperationType("edit")
                            }
                        } disabled={record?.receiveStatus === 1}>编辑</Button>
                    <Popconfirm
                        title="确认删除?"
                        onConfirm={() => handleDelete(record?.id)}
                        okText="确认"
                        cancelText="取消"
                        disabled={record?.receiveStatus === 1}
                    >
                        <Button type="link" disabled={record?.receiveStatus===1}>删除</Button>
                    </Popconfirm>

                </>
            )
        }
    ]
    const [columns, setColumns] = useState<any[]>(inStockList)
    // 查询按钮
    const onFilterSubmit = (value: any) => {
        if (value.startRefundTime) {
            const formatDate = value.startRefundTime.map((item: any) => item.format("YYYY-MM-DD"))
            value.startCreateTime = `${formatDate[0]} 00:00:00`
            value.endCreateTime = `${formatDate[1]} 23:59:59`
            delete value.startRefundTime
        }
        if (value.inTime) {
            const formatDate = value.inTime.map((item: any) => item.format("YYYY-MM-DD"))
            value.startEntryTime = `${formatDate[0]} 00:00:00`
            value.endEntryTime = `${formatDate[1]} 23:59:59`
            delete value.inTime
        }
        if (value.supplierName) {
            value.supplierName = value.supplierName?.value;
        }
        // setFilterValue({ ...value })
        run({...value})
        return value
    }
    // // 新增回调
    // const handleOk = () => new Promise(async (resove, reject) => {
    //     try {
    //         await addRef.current?.onSubmit()
    //         message.success("完善纸质单号成功...")
    //         setVisible(false)
    //         history.go(0)
    //         resove(true)
    //     } catch (error) {
    //         reject(false)
    //     }
    // })

    const handleCreate = (options: any) => {
        if (options?.code === 1) {
            history.go(0);
        }
        setIsOpenId(false);
    }
    const handleRadioChange = (event: any) => {
        if (event.target.value === "b") {
            setPagePath("/tower-storage/warehousingEntry/warehousingEntryDetail")
            setColumns(inStock.map((item:any)=>{
                switch (item.dataIndex) {
                    case "num":
                        return ({
                            ...item,
                            render: (value: any, records: any, key: number) => {
                                    return <span>{value}</span>
                            }
                        })
                    default:
                        return item
                }
            }))
            run({...filterValue})
            return
        }
        if (event.target.value === "a") {
            setPagePath("/tower-storage/warehousingEntry")
            setColumns(inStockList)
            run({...filterValue})
            return
        }
    }
    return (
        <>
            <Page
                path={pagePath}
                exportPath={pagePath}
                columns={columns}
                filterValue={filterValue}
                onFilterSubmit={onFilterSubmit}
                extraOperation={
                    <>
                        <Button type='primary' ghost onClick={() => {
                            setIsOpenId(true)
                            setOperationType("create")
                            setEditId("")
                        }}>创建</Button>
                        <div style={{ width: "2000px" }}>
                            <Radio.Group defaultValue="a" onChange={handleRadioChange}>
                                <Radio.Button value="a">入库单列表</Radio.Button>
                                <Radio.Button value="b">入库明细</Radio.Button>
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
                        label: '创建日期',
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
                        name: 'materialName',
                        label: '品名',
                        children: <Input style={{ width: 220 }}  />
                    },
                    {
                        name: 'structureSpec',
                        label: '规格',
                        children: <Input style={{ width: 220 }} />
                    },
                    {
                        name: 'structureTexture',
                        label: '材质',
                        children: <Select style={{ width: "140px" }} defaultValue={""}>
                            <Select.Option value='' key={'aa'}>全部</Select.Option>
                            {
                                materialTextureOptions?.map((item: { id: string, name: string }) => <Select.Option
                                    value={item.name}
                                    key={item.id}>{item.name}</Select.Option>)
                            }
                        </Select>
                    },
                    {
                        name: 'materialStandard',
                        label: '标准',
                        children: <Select style={{ width: "140px" }} defaultValue={""}>
                            <Select.Option value='' key={'aa'}>全部</Select.Option>
                            {
                                materialStandardOptions?.map((item: { id: string, name: string }) => <Select.Option
                                    value={item.id}
                                    key={item.id}>{item.name}</Select.Option>)
                            }
                        </Select>
                    },
                    {
                        name: 'length',
                        label: '长度',
                        children: <InputNumber style={{ width: 150 }} />
                    },
                    {
                        name: 'width',
                        label: '宽度',
                        children: <InputNumber style={{ width: 150 }} />
                    },
                    {
                        name: 'inTime',
                        label: '入库日期',
                        children: <DatePicker.RangePicker format="YYYY-MM-DD" style={{ width: 220 }} />
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
                        name: 'supplierName',
                        label: '供应商',
                        children: <SupplySelect width={200} />
                    },
                    {
                        name: 'fuzzyQuery',
                        label: "模糊查询项",
                        children: <Input placeholder="请输入入库单号/车牌号/收货单号/收货批次/收货标识码/合同编号/联系人/联系电话进行查询" style={{ width: 300 }} />
                    }
                ]}
            />
            {/* <Modal
                title={'输入'}
                visible={visible}
                width={500}
                maskClosable={false}
                onCancel={() => {
                    addRef.current?.resetFields();
                    setVisible(false);
                }}
                footer={[
                    <Button key="submit" type="primary" onClick={() => handleOk()}>
                        提交
                    </Button>,
                    <Button key="back" onClick={() => {
                        addRef.current?.resetFields();
                        setVisible(false);
                    }}>
                        取消
                    </Button>
                ]}
            >
                <PaperOrderModal ref={addRef} id={id} />
            </Modal> */}
            
            <CreatePlan
                visible={isOpenId}
                id={editId}
                type={oprationType}
                handleCreate={handleCreate}
            />
        </>
    )
}