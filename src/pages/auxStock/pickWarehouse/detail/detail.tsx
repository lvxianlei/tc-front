/***
 * 原材料领料详情
 * 时间：2023/01/16
 */
import React, { useState } from 'react';
import { Input, Select, DatePicker, Button, Modal, message, Table, Popconfirm } from 'antd';
import { FixedType } from 'rc-table/lib/interface'
import { SearchTable as Page, IntgSelect, PopTableContent } from '../../../common';
import { useHistory, useLocation, useParams, useRouteMatch } from 'react-router-dom';
import useRequest from '@ahooksjs/use-request'
import RequestUtil from '../../../../utils/RequestUtil';
import { materialStandardOptions, materialTextureOptions } from '../../../../configuration/DictionaryOptions';
import { baseColumn } from "./detail.json";

import '../../StockPublicStyle.less';
import './detail.less';

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
    const params = useParams<{ id: string, approval: string, user:string, dept:string, team:string }>();
    const match = useRouteMatch()
    const location = useLocation<{ state: {} }>();
    const SelectChange = (selectedRowKeys: React.Key[], selectedRows: any[]): void => {
        setSelectedKeys(selectedRowKeys);
        setSelectedRows(selectedRows)
    }

    const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([]);
    const [selectedRows, setSelectedRows] = useState<any[]>([]);


    const [filterValue, setFilterValue] = useState<any>({
        id: params.id,
    });

    // 获取统计的数据
    const { run: getUser, data: weightData } = useRequest<{ [key: string]: any }>((id: string) => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(`/tower-storage/auxiliaryMaterialPicking/detail/statistics`, {
                ...filterValue,
                id:params.id
            })
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), {})

 
    const { loading, data: baseData } = useRequest<{ [key: string]: any }>(() => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(
                `/tower-storage/auxiliaryMaterialPicking/${params.id}`
            )
            resole({
                ...result,
            })
        } catch (error) {
            reject(error)
        }
    }))
    const { loading: madeLoading, run: madeRun } = useRequest<{ [key: string]: any }>(() => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.post(`/tower-storage/auxiliaryMaterialPicking/createOutStock`,{
                materialPickingDetailIds: selectedKeys,
                materialPickingId: params.id
            })
            message.success('出库成功！')
            history.go(0)
            resole({
                ...result,
            })
        } catch (error) {
            reject(error)
        }
    }),{manual: true})

    // 查询按钮
    const onFilterSubmit = (value: any) => {
        if (value.updateTime) {
            const formatDate = value.updateTime.map((item: any) => item.format("YYYY-MM-DD"))
            value.startUpdateTime = `${formatDate[0]} 00:00:00`
            value.endUpdateTime = `${formatDate[1]} 23:59:59`
            delete value.updateTime
        }
        if (value.outStockUser) {
            value.outStockUser = value.outStockUser.value
        }else{
            value.outStockUser = ''
        }
        setFilterValue({...value, id: params.id  })
        return value
    }


 
    return (
        <>
            <Page
                path="/tower-storage/auxiliaryMaterialPicking/detail"
                exportPath={"/tower-storage/auxiliaryMaterialPicking/detail"}
                exportObject={{ id: params.id }}
                exportFileName="辅材单领料单明细"
                extraOperation={(data: any) => {
                    return <>
                        {/* <Button type='primary' key="add" ghost  disabled={!(selectedKeys.length > 0)} onClick={() => setVisible(true)}>关联下达单</Button> */}
                        <Button type="primary" ghost onClick={()=>{madeRun()}} loading={madeLoading} disabled={!(selectedKeys.length>0)}>生成出库单</Button>
                        <Button type="primary" ghost onClick={async () => { 
                            if([undefined,'undefined',null,'null',0,'0',2,'2',3,'3',4,'4'].includes(params?.approval)){
                                await RequestUtil.get(`/tower-storage/auxiliaryMaterialPicking/workflow/start/${params.id}`)
                                message.success('审批发起成功！')
                                history.go(-1)
                            }else{
                                message.error("当前不可发起审批！")
                            }
                        }} >发起审批</Button>
                        <Button type="primary" ghost onClick={async () => {
                            if([1,'1'].includes(params?.approval)){
                                await RequestUtil.get(`/tower-storage/auxiliaryMaterialPicking/workflow/cancel/${params.id}`)
                                message.success('撤销成功！')
                                history.go(-1)
                            }else{
                                message.error('不可撤销！')
                            }
                            // message.error("当前不可撤销审批！")
                        }} >撤销审批</Button>
                        {/* <Button type="primary" ghost onClick={handleExport}>用友表格导出</Button> */}
                        <Button onClick={() => history.goBack()}>返回上一级</Button>
                        <span style={{ marginLeft: "20px" }}>
                            申请人： {baseData?.createUserName } 
                        </span>
                        <span style={{ marginLeft: "10px" }}>
                            领料车间：{baseData?.deptName} 
                        </span>
                        <span style={{ marginLeft: "10px" }}>
                            领料班组：{baseData?.pickingTeamName} 
                        </span>
                        <span style={{ marginLeft: "10px" }}>
                            总数量：{weightData?.totalNum || "0.00"} 
                        </span>
                    </>
                }}
                tableProps={{
                    rowSelection: {
                        selectedRowKeys: selectedKeys,
                        onChange: SelectChange,
                        getCheckboxProps: (record: any) => record.pickingStatus !== 0
                    }
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
                    ...(baseColumn as any),
                ]}
                onFilterSubmit={onFilterSubmit}
                filterValue={filterValue}
                searchFormItems={[
                    {
                        name: 'updateTime',
                        label: '最新状态变更时间',
                        children: <DatePicker.RangePicker format="YYYY-MM-DD" style={{ width: 220 }} />
                    },
                    {
                        name: 'pickingStatus',
                        label: '状态',
                        children: (
                            <Select placeholder="请选择" style={{ width: "140px" }}>
                                <Select.Option value={0}>未发料</Select.Option>
                                <Select.Option value={1}>部分发料</Select.Option>
                                <Select.Option value={2}>已发料</Select.Option>
                            </Select>
                        )
                    },
                    {
                        name: 'outStockUser',
                        label: '出库人',
                        children: <IntgSelect width={200} />
                    },
                    // {
                    //     name: 'structureTexture',
                    //     label: '材质',
                    //     children: (
                    //         <Select placeholder="请选择材质" style={{ width: "140px" }}>
                    //             {
                    //                 materialEnum && materialEnum.length > 0 && materialEnum.map((item: any, index: number) => {
                    //                     return <Select.Option value={item.label} key={index}>{item.label}</Select.Option>
                    //                 })
                    //             }
                    //         </Select>
                    //     )
                    // },
                    // {
                    //     name: 'materialStandard',
                    //     label: '标准',
                    //     children: (
                    //         <Select placeholder="请选择标准" style={{ width: "140px" }}>
                    //             {
                    //                 standardEnum && standardEnum.length > 0 && standardEnum.map((item: any, index: number) => {
                    //                     return <Select.Option value={item.value} key={index}>{item.label}</Select.Option>
                    //                 })
                    //             }
                    //         </Select>
                    //     )
                    // },
                    {
                        name: 'fuzzyQuery',
                        label: "模糊查询",
                        children: <Input placeholder="请输入品名/规格进行查询" style={{ width: 300 }} />
                    }
                ]}
            />
        </>
    )
}