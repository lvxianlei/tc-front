/***
 * 新修改的原材料出库
 * 原文件地址当前目录：OriginalDocument.tsx
 * 时间：2022/01/11
 */
import React, { useState } from 'react';
import { Input, Select, DatePicker, Button, Radio, message, Popconfirm, InputNumber } from 'antd';
import { FixedType } from 'rc-table/lib/interface'
import { SearchTable as Page, IntgSelect } from '../../common';
import { Link, useHistory } from 'react-router-dom';
import { baseColumn, outStockDetail } from "./data.json";
import CreatePlan from "./CreatePlan";
import useRequest from '@ahooksjs/use-request';
import RequestUtil from '../../../utils/RequestUtil';
import { materialStandardOptions, materialTextureOptions } from '../../../configuration/DictionaryOptions';
import AuthUtil from '@utils/AuthUtil';

const outStock = [
    {
        key: 'index',
        title: '序号',
        dataIndex: 'index',
        fixed: "left",
        width: 50,
        render: (_a: any, _b: any, index: number): React.ReactNode => (<span>{index + 1}</span>)
    },
    ...outStockDetail.map((item:any)=>{
        if (["num"].includes(item.dataIndex)) {
            return ({
                ...item,
                render: (value: number, records: any, key: number) => <span>{value}</span>
            })
        }
        return item
    }),
    {
        title: '操作',
        dataIndex: 'key',
        width: 100,
        fixed: 'right' as FixedType,
        render: (_: undefined, record: any): React.ReactNode => (
            <>
                {!(record?.outStockType===2||record?.outStockType===7)?<Link to={`/stock/rawMaterialExWarehouse/detail/${record.outStockId}/${record.approval}/${record.dataLock}?weight=${record.totalWeight}`}>所在单据</Link>
                :<Link to={`/stock/rawMaterialExWarehouse/backDetail/${record.outStockId}/${record.approval}/${record.dataLock}?weight=${record.totalWeight}`}>所在单据</Link>}
            </>
        )
    }
]

export default function RawMaterialWarehousing(): React.ReactNode {
    const outStockList = [
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
                        onClick={() => history.push(!(record?.outStockType===2||record?.outStockType===7)?`/stock/rawMaterialExWarehouse/detail/${record.id}/${record.approval}/${record.dataLock}?weight=${record.totalWeight}`:`/stock/rawMaterialExWarehouse/backDetail/${record.id}/${record.approval}/${record.dataLock}?weight=${record.totalWeight}`)}
                    >明细</Button>
                    <Button
                        type="link"
                        disabled={record.outStockStatus === 1 || record.dataLockName==='已锁定'}
                        onClick={
                            () => {
                                setIsOpenId(true)
                                setEditId(record.id)
                                setOperationType("edit")
                            }
                        }>编辑</Button>
                    {record?.dataLockName==='已锁定'?
                    <Popconfirm
                        title="确认解锁?"
                        onConfirm={() => cancelLockRun(record?.id)}
                        okText="确认"
                        cancelText="取消"
                    ><Button
                        type="link"
                        // loading={cancelLockLoading}
                         disabled={ record?.createUser !== AuthUtil.getUserInfo().user_id }
                         >解锁</Button>
                    </Popconfirm>
                    :<Popconfirm
                        title="确认锁定?"
                        onConfirm={() => lockRun(record?.id)}
                        okText="确认"
                        cancelText="取消"
                    ><Button
                        type="link"
                        // loading={lockLoading}
                        disabled={ record?.createUser !== AuthUtil.getUserInfo().user_id }
                        >锁定</Button>
                    </Popconfirm>}
                    <Popconfirm
                        title="确认删除?"
                        onConfirm={() => handleDelete(record?.id)}
                        okText="确认"
                        cancelText="取消"
                    >
                        <Button type="link" disabled={record.outStockStatus === 1 || record.dataLockName==='已锁定'}>删除</Button>
                    </Popconfirm>

                </>
            )
        }
    ]
    const history = useHistory()
    const [editId, setEditId] = useState<string>();
    const [oprationType, setOperationType] = useState<"create" | "edit">("create")
    const [pagePath, setPagePath] = useState<string>("/tower-storage/outStock")
    const [columns, setColumns] = useState<any[]>(outStockList)
    const [isOpenId, setIsOpenId] = useState<boolean>(false);
    const [num, setNum] = useState<any>({});
    const [filterValue, setFilterValue] = useState<any>({
        selectName: "",
        status: "",
        updateTimeStart: "",
        updateTimeEnd: "",
        departmentId: "",
        applyStaffId: "",
        // outStockItemStatus: 2,
        materialType: 1,
        ...history.location.state as object
    });
    //统计
    const { loading, data, run } = useRequest((value: Record<string, any>) => new Promise(async (resole, reject) => {
        const data = await RequestUtil.get<any>(`/tower-storage/outStock/detail/statistics`, { ...filterValue, ...value })
        setNum(data)
        resole(data)
    }))
    // 删除
    const { loading: deleting, run: deleteRun } = useRequest<{ [key: string]: any }>((id: string) => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.delete(`/tower-storage/outStock/${id}`)
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    //锁定
    const { loading: lockLoading, run: lockRun } = useRequest<{ [key: string]: any }>((id:any) => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.put(`/tower-storage/outStock/lock/${id}`)
            message.success("操作成功...");
            history.go(0)
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })
    //解锁
    const { loading: cancelLockLoading, run: cancelLockRun } = useRequest<{ [key: string]: any }>((id:any) => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.put(`/tower-storage/outStock/unlock/${id}`)
            message.success("操作成功...");
            history.go(0)
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    // 查询按钮
    const onFilterSubmit = (value: any) => {
        if (value.createTime) {
            const formatDate = value.createTime.map((item: any) => item.format("YYYY-MM-DD"))
            value.createTimeStart = `${formatDate[0]} 00:00:00`
            value.createTimeEnd = `${formatDate[1]} 23:59:59`
            delete value.createTime
        } else {
            value.createTimeStart = ``
            value.createTimeEnd = ``
        }
        if (value.openTime) {
            const formatDate = value.openTime.map((item: any) => item.format("YYYY-MM-DD"))
            value.startPickingTime = `${formatDate[0]} 00:00:00`
            value.endPickingTime = `${formatDate[1]} 23:59:59`
            delete value.openTime
        } else {
            value.startPickingTime = ``
            value.endPickingTime = ``
        }
        if (value.applyStaffId) {
            value.applyStaffId = value.applyStaffId.value
        }else{
            value.applyStaffId = ''
        }
        if (value.outStockType==='2'||value.outStockType==='7') {
            value.outStockItemStatus = 4
        }else{
            value.outStockItemStatus = 2
        }
        console.log(value)
        // setFilterValue({ ...filterValue, ...value })
        run({...filterValue, ...value})
        return value
    }

    const handleCreate = (options: any) => {
        if (options?.code === 1) {
            history.go(0);
        }
        setIsOpenId(false);
    }
    const handleRadioChange = (event: any) => {
        if (event.target.value === "b") {
            setPagePath("/tower-storage/outStock/detail")
            setColumns(outStock)
            run(filterValue)
            return
        }
        if (event.target.value === "a") {
            setPagePath("/tower-storage/outStock")
            setColumns(outStockList)
            run(filterValue)
            return
        }
    }

    const handleDelete = async (id: string) => {
        await deleteRun(id)
        await message.success("成功删除...")
        history.go(0)
    }

    return (
        <>
            <Page
                path={pagePath}
                exportPath={pagePath}
                columns={columns}
                onFilterSubmit={onFilterSubmit}
                filterValue={filterValue}
                extraOperation={
                    <>
                        <Button type='primary' ghost onClick={() => {
                            setIsOpenId(true)
                            setOperationType("create")
                            setEditId("")
                        }}>创建</Button>
                        <div style={{ width: "2000px" }}>
                            <Radio.Group defaultValue="a" onChange={handleRadioChange}>
                                <Radio.Button value="a">出库单列表</Radio.Button>
                                <Radio.Button value="b">出库明细</Radio.Button>
                            </Radio.Group>
                        </div>
                        <span>
                            <span >数量合计：<span style={{ marginRight: 12, color: "#FF8C00" }}>{num?.totalNum||0}</span></span>
                            <span >重量合计（吨）：<span style={{ marginRight: 12, color: "#FF8C00" }}>{num?.weightCount||0}</span></span>
                            <span >含税金额合计（元）：<span style={{ marginRight: 12, color: "#FF8C00" }}>{num?.totalTaxPrice||0}</span></span>
                            <span >不含税金额合计（元）：<span style={{ marginRight: 12, color: "#FF8C00" }}>{num?.totalUnTaxPrice||0}</span></span>
                        </span>
                    </>
                }
                searchFormItems={[
                    {
                        name: 'createTime',
                        label: '创建时间',
                        children: <DatePicker.RangePicker format="YYYY-MM-DD" style={{ width: 220 }} />
                    },
                    {
                        name: 'status',
                        label: '状态',
                        children: (
                            <Select placeholder="请选择" style={{ width: "140px" }}>
                                <Select.Option value="0">待完成</Select.Option>
                                <Select.Option value="1">已完成</Select.Option>
                            </Select>
                        )
                    },
                    {
                        name: 'outStockType',
                        label: '出库类型',
                        children: (
                            <Select placeholder="请选择" style={{ width: "140px" }}>
                                <Select.Option value="0">正常出库</Select.Option>
                                <Select.Option value="1">盘点出库</Select.Option>
                                <Select.Option value="2">余料回库</Select.Option>
                                <Select.Option value="4">销售出库</Select.Option>
                                <Select.Option value="5">外委出库</Select.Option>
                                <Select.Option value="6">其他出库</Select.Option>
                                <Select.Option value="7">退料回库</Select.Option>
                            </Select>
                        )
                    },
                    {
                        name: 'applyStaffId',
                        label: '申请人',
                        children: <IntgSelect width={200} />
                    },
                    {
                        name: 'openTime',
                        label: '出库时间',
                        children: <DatePicker.RangePicker format="YYYY-MM-DD" style={{ width: 220 }} />
                    },
                    {
                        name: 'materialName',
                        label: '品名',
                        children: <Input placeholder="请输入品名" style={{ width: 150 }} />
                    },
                    {
                        name: 'structureSpec',
                        label: '规格',
                        children: <Input placeholder="请输入规格" style={{ width: 150 }} />
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
                        label: "模糊查询",
                        children: <Input placeholder="请输入收货批次/收货标识码/炉批号/质保书号/下达单号/计划号/工程名称/内部合同号/塔型/备注进行查询" style={{ width: 200 }} />
                    }
                ]}
            />
            <CreatePlan
                visible={isOpenId}
                id={editId}
                type={oprationType}
                handleCreate={handleCreate}
            />
        </>
    )
}