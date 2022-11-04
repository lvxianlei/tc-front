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
import { baseColumn } from "./RawMaterialInspection.json";
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
    const [isOpenId, setIsOpenId] = useState<boolean>(false);
    const [pagePath, setPagePath] = useState<string>("/tower-storage/qualityInspection")
    const [editId, setEditId] = useState<string>();
    const [oprationType, setOperationType] = useState<"create" | "edit">("create")
    const [filterValue, setFilterValue] = useState<any>({
        fuzzyQuery: "",
        receiveStatus: "",
        startStatusUpdateTime: "",
        endStatusUpdateTime: "",
    });
    // 删除
    const { loading: deleting, run: deleteRun } = useRequest<{ [key: string]: any }>((id: string) => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.delete(`/tower-storage/qualityInspection/${id}`)
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
        ...(baseColumn as any),
        {
            title: '操作',
            dataIndex: 'key',
            width: 160,
            fixed: 'right' as FixedType,
            render: (_: undefined, record: any): React.ReactNode => (
                <>
                   {record?.inspectionBatch!==2? <Button type="link"
                        onClick={() => history.push(`/rawMaterialInspection/inspection/detail/${record.id}`)}
                    >明细</Button>:
                    <Button type="link"
                        onClick={() => history.push(`/rawMaterialInspection/inspection/reviewDetail/${record.id}`)}
                    >明细</Button>}
                    <Button
                        type="link"
                        onClick={
                            () => {
                                setIsOpenId(true)
                                setEditId(record.id)
                                setOperationType("edit")
                            }
                        } disabled={!(record.inspectionStatus === 0||record.inspectionStatus === 1)}>编辑</Button>
                    <Popconfirm
                        title="确认删除?"
                        onConfirm={() => handleDelete(record?.id)}
                        okText="确认"
                        cancelText="取消"
                    >
                        <Button type="link" disabled={!(record.inspectionStatus === 0||record.inspectionStatus === 1)}>删除</Button>
                    </Popconfirm>

                </>
            )
        }
    ]
    const [columns, setColumns] = useState<any[]>(inStockList)
    // 查询按钮
    const onFilterSubmit = (value: any) => {
        if (value.time) {
            const formatDate = value.time.map((item: any) => item.format("YYYY-MM-DD"))
            value.startCreateTime = `${formatDate[0]} 00:00:00`
            value.endCreateTime = `${formatDate[1]} 23:59:59`
            delete value.time
        }
        setFilterValue({ ...value })
        return value
    }

    const handleCreate = (options: any) => {
        if (options?.code === 1) {
            history.go(0);
        }
        setIsOpenId(false);
    }
    return (
        <>
            <Page
                path={pagePath}
                // exportPath={pagePath}
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
                    </>
                }
                searchFormItems={[
                   
                    {
                        name: 'inspectionStatus',
                        label: '状态',
                        children: (
                            <Select placeholder="请选择状态" style={{ width: "140px" }}>
                                <Select.Option value="">全部</Select.Option>
                                <Select.Option value="1">待检验</Select.Option>
                                <Select.Option value="2">检验中</Select.Option>
                                <Select.Option value="3">待复检</Select.Option>
                                <Select.Option value="4">已完成</Select.Option>
                            </Select>
                        )
                    },
                    {
                        name: 'inspectionType',
                        label: '送检类型',
                        children: (
                            <Select placeholder="请选择送检类型" style={{ width: "140px" }}>
                                <Select.Option value="">全部</Select.Option>
                                <Select.Option value="1">钢材</Select.Option>
                                <Select.Option value="2">锌锭</Select.Option>
                                <Select.Option value="3">焊材</Select.Option>
                                <Select.Option value="4">螺栓</Select.Option>
                            </Select>
                        )
                    },
                    {
                        name: 'inspectionBatch',
                        label: '检验批次',
                        children: (
                            <Select placeholder="请选择检验批次" style={{ width: "140px" }}>
                                <Select.Option value="">全部</Select.Option>
                                <Select.Option value="1">初检</Select.Option>
                                <Select.Option value="2">复检</Select.Option>
                            </Select>
                        )
                    },
                    {
                        name: 'isUrgent',
                        label: '是否加急',
                        children: (
                            <Select placeholder="请选择" style={{ width: "140px" }}>
                                <Select.Option value="">全部</Select.Option>
                                <Select.Option value="1">是</Select.Option>
                                <Select.Option value="0">否</Select.Option>
                            </Select>
                        )
                    },
                    {
                        name: 'time',
                        label: '送检日期',
                        children: <DatePicker.RangePicker format="YYYY-MM-DD" style={{ width: 220 }} />
                    },
                    {
                        name: 'fuzzyQuery',
                        label: "模糊查询项",
                        children: <Input placeholder="请输入送检单号/收货单号/供应商/送检人进行查询" style={{ width: 300 }} />
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