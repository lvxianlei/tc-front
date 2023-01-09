/***
 * 新修改的原材料回库详情
 * 原文件地址当前目录：OriginalDocument.tsx
 * 时间：2022/01/11
 */
import React, { useState } from 'react';
import { Input, Select, DatePicker, Button, Modal, message, Table, Popconfirm } from 'antd';
import { FixedType } from 'rc-table/lib/interface'
import { SearchTable as Page, IntgSelect } from '../../../common';
import { useHistory, useLocation, useParams, useRouteMatch } from 'react-router-dom';
import useRequest from '@ahooksjs/use-request'
import RequestUtil from '../../../../utils/RequestUtil';
import { materialStandardOptions, materialTextureOptions } from '../../../../configuration/DictionaryOptions';
import { baseBackColumn } from "./detail.json";

import '../../StockPublicStyle.less';
import './detail.less';
import AuthUtil from '@utils/AuthUtil';
import { exportDown } from '@utils/Export';

export default function RawMaterialWarehousing(): React.ReactNode {
    // 标准
    const standardEnum = materialStandardOptions?.map((item: { id: string, name: string }) => ({
        value: item.id,
        label: item.name
    }))

    // 材质 
    const materialEnum = materialTextureOptions?.map((item: { id: string, name: string }) => ({
        value: item.id,
        label: item.name
    }))
    const history = useHistory();
    const params = useParams<{ id: string, approval: string }>();
    const match = useRouteMatch()
    const location = useLocation<{ state: {} }>();
// 批量入库
const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);


    const [filterValue, setFilterValue] = useState<any>({
        id: params.id,
    });

    // 获取统计的数据
    const { run: getUser, data: weightData } = useRequest<{ [key: string]: any }>((id: string) => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(`/tower-storage/outStock/detail/statistics`, {
                ...filterValue
            })
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), {})
    // 回库
    const { loading: backing, run: backRun } = useRequest<{ [key: string]: any }>((data) => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.post(`/tower-storage/outStock/excess`,{outStockDetailIds:data, outStockId: params.id})
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    // 撤销
    const { loading: revocating, run: revocationRun } = useRequest<{ [key: string]: any }>((id: string) => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.post(`/tower-storage/outStock/excess/revocation/${id}`,)
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    // 删除
    const { loading: deleting, run: deleteRun } = useRequest<{ [key: string]: any }>((id: string) => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.delete(`/tower-storage/outStock/detail/${id}`)
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    // 用友格式导出
    const { run: exportRun } = useRequest<{ [key: string]: any }>(() => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(
                `/tower-storage/outStock/export/${params.id}`,
                {},
                {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': `Basic ${AuthUtil.getAuthorization()}`,
                    'Tenant-Id': AuthUtil.getTenantId(),
                    'Sinzetech-Auth': AuthUtil.getSinzetechAuth(),
                    isExport: 'true',
                }
            )
            const data = await result.blob()
            console.log(data, "----------")
            var blob = new Blob([data]);
            var reader = new FileReader();
            reader.readAsDataURL(blob);
            reader.onload = function (e) {
                var a = document.createElement('a');
                a.download = `出库明细-${params.id}` + '.xlsx';
                a.href = URL.createObjectURL(blob);
                a.click();
            }
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    // 查询按钮
    const onFilterSubmit = (value: any) => {
        if (value.updateTime) {
            const formatDate = value.updateTime.map((item: any) => item.format("YYYY-MM-DD"))
            value.updateTimeStart = `${formatDate[0]} 00:00:00`
            value.updateTimeEnd = `${formatDate[1]} 23:59:59`
            delete value.updateTime
        }
        if (value.outStockStaffId) {
            value.outStockStaffId = value.outStockStaffId.value
        }
        setFilterValue({ ...filterValue, ...value })
        return value
    }

    


    const handleBackWarehousingClick = async () => {
        if (selectedRowKeys.length < 1) {
            message.error("请选择回库数据");
            return false;
        }
        // const result: any = [];
        // for (let i = 0; i < selectedRowKeys.length; i += 1) {
        //     const v = {
        //         id: selectedRowKeys[i],  
        //         warehousingEntryType: 1
        //     }
        //     result.push(v)
        // }
        await backRun(selectedRowKeys);
        history.go(0);
    }

    const handleExport = () => exportDown(
        `/tower-storage/outStock/export/${params.id}`,
        "GET",
        {},
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        `出库明细-${params.id}`
    )



    const handleRevocation = async (id: string) => {
        await revocationRun(id)
        await message.success("撤销成功...")
        history.go(0)
    }

    const handleDelete = async (id: string) => {
        await deleteRun(id)
        await message.success("成功删除...")
        history.go(0)
    }

    return (
        <>
            <Page
                path="/tower-storage/outStock/detail"
                exportPath={"/tower-storage/outStock/detail"}
                exportObject={{ id: params.id }}
                exportFileName="原材料回库明细"
                extraOperation={(data: any) => {
                    return <>
                        <Button type="primary" ghost onClick={handleExport}>用友表格导出</Button>
                        <Button type="primary" ghost onClick={() => handleBackWarehousingClick()} >批量回库</Button>
                        <Button type="primary" ghost onClick={async () => { 
                            if([undefined,'undefined', null,'null',0,'0',2,'2',3,'3',4,'4'].includes(params?.approval)){
                                await RequestUtil.get(`/tower-storage/outStock/workflow/start/${params.id}`)
                                message.success('审批发起成功！')
                                history.go(-1)
                            }else{
                                message.error("当前不可发起审批！")
                            }
                        }} >发起审批</Button>
                        <Button type="primary" ghost onClick={async () => {
                            if([1,'1'].includes(params?.approval)){
                                await RequestUtil.get(`/tower-storage/outStock/workflow/cancel/${params.id}`)
                                message.success('撤销成功！')
                                history.go(-1)
                            }else{
                                message.error('不可撤销！')
                            }
                        }} >撤销审批</Button>
                        <Button onClick={() => history.goBack()}>返回上一级</Button>
                        <span style={{ marginLeft: "20px" }}>
                            总重量： {weightData?.weightCount || "0.00"} 吨
                        </span>
                        <span style={{ marginLeft: "10px" }}>
                            待回库重量：{weightData?.excessWeight || "0.00"} 吨
                        </span>
                    </>
                }}
                columns={[
                    {
                        key: 'index',
                        title: '序号',
                        dataIndex: 'index',
                        fixed: "left",
                        width: 50,
                        render: (_a: any, _b: any, index: number): React.ReactNode => (<span>{index + 1}</span>)
                    },
                    ...(baseBackColumn as any).map((item:any)=>{
                        if (["num"].includes(item.dataIndex)) {
                            return ({
                                ...item,
                                render: (value: number, records: any, key: number) => <span>{value+''}</span>
                            })
                        }
                        return item
                    }),
                    {
                        title: '操作',
                        width: 180,
                        fixed: 'right' as FixedType,
                        render: (_: undefined, record: any): React.ReactNode => (
                            // 0待出库 2 已出库  1缺料中 3待回库  4已回库
                            <>
                                
                                <Button className='btn-operation-link' type='link'  disabled={record.outStockItemStatus === 2} onClick={async () => {
                                    const result = [ record.id ]
                                    await backRun(result);
                                    history.go(0);
                                }}>回库</Button>
                                <Popconfirm
                                    title="确认撤销?"
                                    onConfirm={() => handleRevocation(record.id)}
                                    okText="确认"
                                    cancelText="取消"
                                >
                                    <Button loading={revocating} disabled={record.outStockItemStatus === 0} type="link">撤销</Button>
                                </Popconfirm>
                                <Popconfirm
                                    title="确认删除?"
                                    onConfirm={() => handleDelete(record?.id)}
                                    okText="确认"
                                    cancelText="取消"
                                >
                                    <Button loading={deleting} disabled={record.outStockItemStatus === 2} type="link">删除</Button>
                                </Popconfirm>
                            </>
                        )
                    }
                ]}
                onFilterSubmit={onFilterSubmit}
                filterValue={filterValue}
                tableProps={{
                    rowSelection: {
                        type: "checkbox",
                        selectedRowKeys: selectedRowKeys,
                            onChange: (selectedRowKeys: any[]) => {
                                setSelectedRowKeys(selectedRowKeys);
                            },
                        getCheckboxProps: (record: any) => record.outStockItemStatus === 4
                    }
                }}
                searchFormItems={[
                //  {
                //      name: 'updateTime',
                //      label: '最新状态变更时间',
                //      children: <DatePicker.RangePicker format="YYYY-MM-DD" style={{ width: 220 }} />
                //  },
                //  {
                //      name: 'status',
                //      label: '状态',
                //      children: (
                //          <Select placeholder="请选择状态" style={{ width: "140px" }}>
                //              <Select.Option value="3">待回库</Select.Option>
                //              <Select.Option value="4">已回库</Select.Option>
                //          </Select>
                //      )
                //  },
                //  {
                //      name: 'outStockStaffId',
                //      label: '出库人',
                //      children: <IntgSelect width={200} />
                //  },
                //  {
                //      name: 'structureTexture',
                //      label: '材质',
                //      children: (
                //          <Select placeholder="请选择材质" style={{ width: "140px" }}>
                //              {
                //                  materialEnum && materialEnum.length > 0 && materialEnum.map((item: any, index: number) => {
                //                      return <Select.Option value={item.label} key={index}>{item.label}</Select.Option>
                //                  })
                //              }
                //          </Select>
                //      )
                //  },
                //  {
                //      name: 'materialStandard',
                //      label: '标准',
                //      children: (
                //          <Select placeholder="请选择标准" style={{ width: "140px" }}>
                //              {
                //                  standardEnum && standardEnum.length > 0 && standardEnum.map((item: any, index: number) => {
                //                      return <Select.Option value={item.value} key={index}>{item.label}</Select.Option>
                //                  })
                //              }
                //          </Select>
                //      )
                //  },
                //  {
                //      name: 'fuzzyQuery',
                //      label: "模糊查询",
                //      children: <Input placeholder="请输入品名/炉批号/内部合同号/杆塔号/批号、质保书号、轧制批号进行查询" style={{ width: 300 }} />
                //  }
                ]}
            />
        </>
    )
}