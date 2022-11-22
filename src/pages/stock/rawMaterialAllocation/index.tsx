/***
 * 原材料调拨
 * 时间：2022/11/04
 */
import React, { useEffect, useState } from 'react';
import { Input, Select, DatePicker, Button, Radio, message, Popconfirm, InputNumber, Spin } from 'antd';
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
                        onClick={
                            () => {
                                setIsOpenId(true)
                                setEditId(record.allocationId)
                                setOperationType("view")
                            }
                        }
                    >查看</Button>
                    <Button
                        type="link"
                        disabled={record.allocationStatus === 1}
                        onClick={
                            () => {
                                setIsOpenId(true)
                                setEditId(record.allocationId)
                                setOperationType("edit")
                            }
                        }>编辑</Button>
                    {/* <Popconfirm
                        title="确认删除?"
                        onConfirm={() => handleDelete(record?.id)}
                        okText="确认"
                        cancelText="取消"
                    >
                        <Button type="link" disabled={record.stockStatus === 2}>删除</Button>
                    </Popconfirm> */}

                </>
            )
        }
    ]
    const history = useHistory()
    const [editId, setEditId] = useState<string>();
    const [oprationType, setOperationType] = useState<"create" | "edit"| "view">("create")
    const [pagePath, setPagePath] = useState<string>("/tower-storage/allocationStock")
    const [columns, setColumns] = useState<any[]>(outStockList)
    const [isOpenId, setIsOpenId] = useState<boolean>(false);
    const [ReservoirArea, setReservoirArea] = useState<any[]>([]);//入库库区数据
    const [Location, setLocation] = useState<any[]>([]);//入库库位数据
    const [InReservoirArea, setInReservoirArea] = useState<any[]>([]);//入库库区数据
    const [InLocation, setInLocation] = useState<any[]>([]);//入库库位数据
    const [batchingStrategy, setBatchingStrategy] = useState<any[]>([]);
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
    // 获取仓库/库区/库位
    const getWarehousing = async (id?: any, type?: any) => {
        const data: any = await RequestUtil.get(`/tower-storage/warehouse/tree`, {
            id,
            type,
        });
        switch (type) {
            case 1:
                setReservoirArea(data)
                break;
            case 2:
                setLocation(data)
                break;
            default:
                break;
        }
    }
    // 获取仓库/库区/库位
    const getInWarehousing = async (id?: any, type?: any) => {
       const data: any = await RequestUtil.get(`/tower-storage/warehouse/tree`, {
           id,
           type,
       });
       switch (type) {
           case 1:
               setInReservoirArea(data)
               break;
           case 2:
               setInLocation(data)
               break;
           default:
               break;
       }
   }
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
        if (value.applyTime) {
            const formatDate = value.applyTime.map((item: any) => item.format("YYYY-MM-DD"))
            value.startApplyTime = `${formatDate[0]} 00:00:00`
            value.endApplyTime = `${formatDate[1]} 23:59:59`
            delete value.applyTime
        }
        if (value.allocationTime) {
            const formatDate = value.allocationTime.map((item: any) => item.format("YYYY-MM-DD"))
            value.startAllocationTime = `${formatDate[0]} 00:00:00`
            value.endAllocationTime = `${formatDate[1]} 23:59:59`
            delete value.allocationTime
        }
        if (value.allocationUser) {
            value.allocationUser = value.allocationUser.value
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
    // useEffect(()=>{
    //     getBatchingStrategy()
    // })
    // 获取所有的仓库
    const { loading, data  } = useRequest(() => new Promise(async (resole, reject) => {
        const result: any[] = await RequestUtil.get(`/tower-storage/warehouse/getWarehouses`);
        setBatchingStrategy(result)
        resole(result)
    }), {})
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
                    </>
                }
                searchFormItems={[
                    {
                        name: 'applyTime',
                        label: '申请日期',
                        children: <DatePicker.RangePicker format="YYYY-MM-DD" style={{ width: 220 }} />
                    },
                    {
                        name: 'allocationTime',
                        label: '调拨日期',
                        children: <DatePicker.RangePicker format="YYYY-MM-DD" style={{ width: 220 }} />
                    },
                    {
                        name: 'allocationUser',
                        label: '申请人/调拨人',
                        children: <IntgSelect width={200} />
                    },
                    {
                        name: 'allocationStatus',
                        label: '状态',
                        children: (
                            <Select placeholder="请选择" style={{ width: "140px" }}>
                                <Select.Option value="0">待完成</Select.Option>
                                <Select.Option value="1">已完成</Select.Option>
                            </Select>
                        )
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
                        name: 'allocationWarehouseIn',
                        label: '调入仓库',
                        children: (
                            <Select placeholder="请选择" style={{ width: "140px" }} onChange={(val) => {  getWarehousing(val, 1) }}>
                                <Select.Option value='' key={'aa'}>全部</Select.Option>
                                {
                                    batchingStrategy.map((item: { id: string, name: string }) => <Select.Option
                                        value={item.id}
                                        key={item.id}>{item.name}</Select.Option>)
                                }
                            </Select>
                        )
                    },
                    {
                        name: 'inReservoirId',
                        label: '调入库区',
                        children: (
                            <Select placeholder="请选择" style={{ width: "140px" }}>
                                <Select.Option value='' key={'aa'}>全部</Select.Option>
                                {
                                    ReservoirArea?.map((item: { id: string, name: string }) => <Select.Option
                                        value={item.id}
                                        key={item.id}>{item.name}</Select.Option>)
                                }
                            </Select>
                        )
                    },
                    {
                        name: 'inLocatorId',
                        label: '调入库位',
                        children: (
                            <Select placeholder="请选择" style={{ width: "140px" }}>
                                <Select.Option value='' key={'aa'}>全部</Select.Option>
                                {
                                    Location?.map((item: { id: string, name: string }) => <Select.Option
                                        value={item.id}
                                        key={item.id}>{item.name}</Select.Option>)
                                }
                            </Select>
                        )
                    },
                    {
                        name: 'allocationWarehouseOut',
                        label: '调出仓库',
                        children: (
                            <Select placeholder="请选择" style={{ width: "140px" }} onChange={(val) => { getInWarehousing(val, 1) }}>
                                <Select.Option value='' key={'aa'}>全部</Select.Option>
                                {
                                    batchingStrategy.map((item: { id: string, name: string }) => <Select.Option
                                        value={item.id}
                                        key={item.id}>{item.name}</Select.Option>)
                                }
                            </Select>
                        )
                    },
                    {
                        name: 'reservoirId',
                        label: '调出库区',
                        children: (
                            <Select placeholder="请选择" style={{ width: "140px" }}>
                                <Select.Option value='' key={'aa'}>全部</Select.Option>
                                {
                                    InReservoirArea?.map((item: { id: string, name: string }) => <Select.Option
                                        value={item.id}
                                        key={item.id}>{item.name}</Select.Option>)
                                }
                            </Select>
                        )
                    },
                    {
                        name: 'locatorId',
                        label: '调出库位',
                        children: (
                            <Select placeholder="请选择" style={{ width: "140px" }}>
                                <Select.Option value='' key={'aa'}>全部</Select.Option>
                                {
                                    InLocation?.map((item: { id: string, name: string }) => <Select.Option
                                        value={item.id}
                                        key={item.id}>{item.name}</Select.Option>)
                                }
                            </Select>
                        )
                    },
                    {
                        name: 'fuzzyQuery',
                        label: "模糊查询",
                        children: <Input placeholder="请输入调拨单号进行查询" style={{ width: 200 }} />
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