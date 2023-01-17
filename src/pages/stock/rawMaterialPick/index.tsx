/***
 * 原材料领料
 * 时间：2023/01/16
 */
import React, { useEffect, useState } from 'react';
import { Input, Select, DatePicker, Button, Radio, message, Popconfirm, InputNumber } from 'antd';
import { FixedType } from 'rc-table/lib/interface'
import { SearchTable as Page, IntgSelect } from '../../common';
import { Link, useHistory } from 'react-router-dom';
import { baseColumn } from "./data.json";
import CreatePlan from "./CreatePlan";
import useRequest from '@ahooksjs/use-request';
import RequestUtil from '../../../utils/RequestUtil';
import { materialStandardOptions, materialTextureOptions } from '../../../configuration/DictionaryOptions';


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
                        onClick={() => history.push(`/stock/pick/detail/${record.id}/${record.approval}?weight=${record.totalWeight}`)}
                    >明细</Button>
                    <Button
                        type="link"
                        onClick={
                            () => {
                                setIsOpenId(true)
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
                        <Button type="link" disabled={record.pickingStatus !== 0 }>删除</Button>
                    </Popconfirm>

                </>
            )
        }
    ]
    const history = useHistory()
    const [editId, setEditId] = useState<string>();
    const [oprationType, setOperationType] = useState<"create" | "edit">("create")
    const [pagePath, setPagePath] = useState<string>("/tower-storage/materialPicking")
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
        outStockItemStatus: 2,
        materialType: 1,
        ...history.location.state as object
    });
    //统计
    // const { loading, data, run } = useRequest((value: Record<string, any>) => new Promise(async (resole, reject) => {
    //     const data = await RequestUtil.get<any>(`/tower-storage/outStock/detail/statistics`, { ...filterValue, ...value })
    //     setNum(data)
    //     resole(data)
    // }))
    // 删除
    const { loading: deleting, run: deleteRun } = useRequest<{ [key: string]: any }>((id: string) => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.delete(`/tower-storage/materialPicking/${id}`)
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
        }
        if (value.openTime) {
            const formatDate = value.openTime.map((item: any) => item.format("YYYY-MM-DD"))
            value.startUpdateTime = `${formatDate[0]} 00:00:00`
            value.endUpdateTime = `${formatDate[1]} 23:59:59`
            delete value.openTime
        }
        if (value.batcherId) {
            value.applyStaffId = value.batcherId.value
        }
        setFilterValue({ ...filterValue, ...value })
        // run({...filterValue, ...value})
        return value
    }

    const handleCreate = (options: any) => {
        if (options?.code === 1) {
            history.go(0);
        }
        setIsOpenId(false);
    }


    const handleDelete = async (id: string) => {
        await deleteRun(id)
        await message.success("成功删除...")
        history.go(0)
    }

    // 获取所有的仓库
    const { run: getBatchingStrategy, data: batchingStrategy } = useRequest<{ [key: string]: any }>(() => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(`/tower-storage/warehouse/getWarehouses`);
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })
    const { loading, data } = useRequest((value: Record<string, any>) => new Promise(async (resole, reject) => {
        getBatchingStrategy()
        resole(data)
    }))
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
                        {/* <span>
                            <span >数量合计：<span style={{ marginRight: 12, color: "#FF8C00" }}>{num?.totalNum||0}</span></span>
                            <span >重量合计（吨）：<span style={{ marginRight: 12, color: "#FF8C00" }}>{num?.weightCount||0}</span></span>
                            <span >含税金额合计（元）：<span style={{ marginRight: 12, color: "#FF8C00" }}>{num?.totalTaxPrice||0}</span></span>
                            <span >不含税金额合计（元）：<span style={{ marginRight: 12, color: "#FF8C00" }}>{num?.totalUnTaxPrice||0}</span></span>
                        </span> */}
                    </>
                }
                searchFormItems={[
                    {
                        name: 'createTime',
                        label: '创建时间',
                        children: <DatePicker.RangePicker format="YYYY-MM-DD" style={{ width: 220 }} />
                    },
                    {
                        name: 'pickingStatus',
                        label: '发料状态',
                        children: (
                            <Select placeholder="请选择" style={{ width: "140px" }}>
                                <Select.Option value={0}>未发料</Select.Option>
                                <Select.Option value={1}>部分发料</Select.Option>
                                <Select.Option value={2}>已发料</Select.Option>
                            </Select>
                        )
                    },
                    {
                        name: 'pickingType',
                        label: '领料类型',
                        children: (
                            <Select placeholder="请选择" style={{ width: "140px" }}>
                                <Select.Option value="0">正常领料</Select.Option>
                                <Select.Option value="7">二次领料</Select.Option>
                                <Select.Option value="5">外委领料</Select.Option>
                                <Select.Option value="4">销售领料</Select.Option>
                                <Select.Option value="6">其他领料</Select.Option>
                            </Select>
                        )
                    },
                    {
                        name: 'applyStaffId',
                        label: '申请人',
                        children: <IntgSelect width={200} />
                    },
                    {
                        name: 'warehouseId',
                        label: '领料仓库',
                        children: <Select placeholder="请选择" style={{ width: "100px" }} showSearch>
                            {batchingStrategy?.map((item: any,index: number) => {
                                return <Select.Option value={item.id} key={index}>{item.name}</Select.Option>
                            })}
                        </Select>
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
                        children: <Input placeholder="请输入领料单号/下达单号/计划号/工程名称/内部合同号/塔型/备注进行查询" style={{ width: 200 }} />
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