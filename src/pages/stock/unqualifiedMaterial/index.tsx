/***
 * 原材料不合格处置单
 * 时间：2022/10/31
 */
import React, { useState, useRef } from 'react';
import { Input, Select, DatePicker, Button, Modal, message, Radio, Popconfirm } from 'antd';
import { FixedType } from 'rc-table/lib/interface'
import { SearchTable as Page } from '../../common';
import { Link, useHistory } from 'react-router-dom';
import { baseColumn } from "./UnqualifiedMaterial.json";
import CreatePlan from './CreatePlan';
import { materialStandardOptions, materialTextureOptions } from '../../../configuration/DictionaryOptions';
interface EditRefProps {
    id?: string
    onSubmit: () => void
    resetFields: () => void
}
export default function RawMaterialWarehousing(): React.ReactNode {
    const history = useHistory();
    const [isOpenId, setIsOpenId] = useState<boolean>(false);
    const [editId, setEditId] = useState<string>();
    const [oprationType, setOperationType] = useState<"create" | "edit">("create")
    const [filterValue, setFilterValue] = useState<any>({
        fuzzyQuery: "",
        receiveStatus: "",
        startStatusUpdateTime: "",
        endStatusUpdateTime: "",
    });
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
            width: 80,
            fixed: 'right' as FixedType,
            render: (_: undefined, record: any): React.ReactNode => (
                <>
                    {record?.processStatus==='0'||record?.processStatus===0?<Button type="link"
                            onClick={
                            () => {
                                setIsOpenId(true)
                                setEditId(record.id)
                                setOperationType("create")
                            }
                        }
                        >处理</Button>
                        :<Button type="link"
                        onClick={
                            () => {
                                setIsOpenId(true)
                                setEditId(record.id)
                                setOperationType("edit")
                            }
                        }
                        >查看</Button>
                    }
                </>
            )
        }
    ]
    const [columns, setColumns] = useState<any[]>(inStockList)
    // 查询按钮
    const onFilterSubmit = (value: any) => {
        if (value.time) {
            const formatDate = value.time.map((item: any) => item.format("YYYY-MM-DD"))
            value.startInspectionTime = `${formatDate[0]} 00:00:00`
            value.endInspectionTime = `${formatDate[1]} 23:59:59`
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
                path={"/tower-storage/nonconformityDisposal"}
                columns={columns}
                filterValue={filterValue}
                onFilterSubmit={onFilterSubmit}
                extraOperation={
                    <>
                    </>
                }
                searchFormItems={[
                
                    {
                        name: 'processStatus',
                        label: '状态',
                        children: (
                            <Select placeholder="请选择" style={{ width: "140px" }}>
                                <Select.Option value="">全部</Select.Option>
                                <Select.Option value="0">待处理</Select.Option>
                                <Select.Option value="1">已处理</Select.Option>
                            </Select>
                        )
                    },
                    {
                        name: 'inspectionType',
                        label: '送检类型',
                        children: (
                            <Select placeholder="请选择" style={{ width: "140px" }}>
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
                            <Select placeholder="请选择" style={{ width: "140px" }}>
                                <Select.Option value="">全部</Select.Option>
                                <Select.Option value="1">初检</Select.Option>
                                <Select.Option value="2">复检</Select.Option>
                            </Select>
                        )
                    },
                    // {
                    //     name: 'warehousingType',
                    //     label: '是否加急',
                    //     children: (
                    //         <Select placeholder="请选择入库类型" style={{ width: "140px" }}>
                    //             <Select.Option value="">全部</Select.Option>
                    //             <Select.Option value="1">是</Select.Option>
                    //             <Select.Option value="2">否</Select.Option>
                    //         </Select>
                    //     )
                    // },
                    {
                        name: 'time',
                        label: '送检日期',
                        children: <DatePicker.RangePicker format="YYYY-MM-DD" style={{ width: 220 }} />
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