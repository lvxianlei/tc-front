/***
 * 新修改的原材料出库
 * 原文件地址当前目录：OriginalDocument.tsx
 * 时间：2022/01/11
 */
import React, { useState } from 'react';
import { Input, Select, DatePicker } from 'antd';
import { FixedType } from 'rc-table/lib/interface'
import { SearchTable as Page, IntgSelect } from '../../common';
import { Link, useHistory } from 'react-router-dom';
import { baseColumn } from "./rawMaterialExWarehouse.json";
export default function RawMaterialWarehousing(): React.ReactNode {
    const history = useHistory()
    const [filterValue, setFilterValue] = useState<any>({
        selectName: "",
        status: "",
        updateTimeStart: "",
        updateTimeEnd: "",
        departmentId: "",
        applyStaffId: "",
        ...history.location.state as object
    });

    // 查询按钮
    const onFilterSubmit = (value: any) => {
        if (value.startRefundTime) {
            const formatDate = value.startRefundTime.map((item: any) => item.format("YYYY-MM-DD"))
            value.updateTimeStart = `${formatDate[0]} 00:00:00`
            value.updateTimeEnd = `${formatDate[1]} 23:59:59`
            delete value.startRefundTime
        }
        if (value.batcherId) {
            value.applyStaffId = value.batcherId.value
        }
        setFilterValue({ ...value })
        return value
    }
    return (
        <>
            <Page
                path="/tower-storage/outStock"
                exportPath={"/tower-storage/outStock"}
                columns={[
                    {
                        key: 'index',
                        title: '序号',
                        dataIndex: 'index',
                        fixed: "left",
                        width: 30,
                        render: (_a: any, _b: any, index: number): React.ReactNode => (<span>{index + 1}</span>)
                    },
                    ...baseColumn as any,
                    {
                        title: '操作',
                        dataIndex: 'key',
                        width: 40,
                        fixed: 'right' as FixedType,
                        render: (_: undefined, record: any): React.ReactNode => (
                            <>
                                <Link to={`/stock/rawMaterialExWarehouse/detail/${record.id}?weight=${record.totalWeight}`}>明细</Link>
                            </>
                        )
                    }
                ]}
                onFilterSubmit={onFilterSubmit}
                filterValue={filterValue}
                searchFormItems={[
                    {
                        name: 'startRefundTime',
                        label: '最新状态变更时间',
                        children: <DatePicker.RangePicker format="YYYY-MM-DD" style={{ width: 220 }} />
                    },
                    {
                        name: 'status',
                        label: '状态',
                        children: (
                            <Select placeholder="请选择状态" style={{ width: "140px" }}>
                                <Select.Option value="0">待完成</Select.Option>
                                <Select.Option value="1">已完成</Select.Option>
                            </Select>
                        )
                    },
                    {
                        name: 'batcherId',
                        label: '申请人',
                        children: <IntgSelect width={200} />
                    },
                    {
                        name: 'fuzzyQuery',
                        label: "关键字",
                        children: <Input placeholder="请输入领料编号/生产批次进行查询" style={{ width: 300 }} />
                    }
                ]}
            />
        </>
    )
}