/***
 * 新修改的原材料出库
 * 原文件地址当前目录：OriginalDocument.tsx
 * 时间：2022/01/11
 */
import React, { useState } from 'react';
import { Input, Select, DatePicker, Button, Radio, message, Popconfirm } from 'antd';
import { FixedType } from 'rc-table/lib/interface'
import { SearchTable as Page, IntgSelect } from '../../common';
import { Link, useHistory } from 'react-router-dom';
import { baseColumn, outStockDetail } from "./data.json";
import CreatePlan from "./CreatePlan";
import useRequest from '@ahooksjs/use-request';
import RequestUtil from '../../../utils/RequestUtil';

const outStock = [
    {
        key: 'index',
        title: '序号',
        dataIndex: 'index',
        fixed: "left",
        width: 50,
        render: (_a: any, _b: any, index: number): React.ReactNode => (<span>{index + 1}</span>)
    },
    ...outStockDetail,
    {
        title: '操作',
        dataIndex: 'key',
        width: 100,
        fixed: 'right' as FixedType,
        render: (_: undefined, record: any): React.ReactNode => (
            <>
                <Link to={`/stock/rawMaterialExWarehouse/detail/${record.outStockId}?weight=${record.totalWeight}`}>所在单据</Link>
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
            width: 100,
            fixed: 'right' as FixedType,
            render: (_: undefined, record: any): React.ReactNode => (
                <>
                    <Button type="link"
                        onClick={() => history.push(`/stock/rawMaterialExWarehouse/detail/${record.id}?weight=${record.totalWeight}`)}
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
                        <Button type="link" disabled={record.stockStatus === 2}>删除</Button>
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
    const [filterValue, setFilterValue] = useState<any>({
        selectName: "",
        status: "",
        updateTimeStart: "",
        updateTimeEnd: "",
        departmentId: "",
        applyStaffId: "",
        outStockItemStatus: 2,
        ...history.location.state as object
    });

    // 删除
    const { loading: deleting, run: deleteRun } = useRequest<{ [key: string]: any }>((id: string) => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.delete(`/tower-storage/outStock/${id}`)
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
        if (value.batcherId) {
            value.applyStaffId = value.batcherId.value
        }
        setFilterValue({ ...filterValue, ...value })
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
            return
        }
        if (event.target.value === "a") {
            setPagePath("/tower-storage/outStock")
            setColumns(outStockList)
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
                            </Select>
                        )
                    },
                    {
                        name: 'batcherId',
                        label: '申请人',
                        children: <IntgSelect width={200} />
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
                        name: 'fuzzyQuery',
                        label: "关键字",
                        children: <Input placeholder="领料编号/生产批次" style={{ width: 200 }} />
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