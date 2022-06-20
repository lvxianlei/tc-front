/***
 * 新修改的库存看板
 * 原文件：当前目录下OriginalDocument.tsx
 * 时间：2022/01/05
 */
import React, { useState, useEffect } from 'react';
import { Input, Select } from 'antd';
import { SearchTable as Page } from '../../common';
import { materialStandardTypeOptions } from '../../../configuration/DictionaryOptions';
import RequestUtil from '../../../utils/RequestUtil';
import {
    baseColunm
} from "./viewPanel.json";
import useRequest from '@ahooksjs/use-request';

export default function ViewPanel(): React.ReactNode {
    const [filterValue, setFilterValue] = useState<any>({});
    
    // 统计数据
    const { run: saveRun, data } = useRequest<{ [key: string]: any }>(() => new Promise(async (resove, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(`/tower-storage/materialStock/summary/weight`, filterValue)
            resove(result)
        } catch (error) {
            reject(error)
        }
    }), {  })

    // 查询按钮
    const onFilterSubmit = (value: any) => {
        setFilterValue(value)
        return value
    }

    return (
        <>
            <Page
                path="/tower-storage/materialStock/summary"
                exportPath={"/tower-storage/materialStock/summary"}
                columns={[
                    {
                        title: '序号',
                        dataIndex: 'index',
                        fixed: "left",
                        width: 50,
                        render: (_a: any, _b: any, index: number): React.ReactNode => (<span>{index + 1}</span>)
                    },
                    ...baseColunm.map((item: any) => {
                        // 可用重量
                        // 可用重量 < 告警重量 红
                        // 可用重量 > 告警重量 && 可用重量 < 安全重量 标黄
                        if (item.dataIndex === "usableTotalWeight") {
                            return ({
                                title: item.title,
                                dataIndex: item.dataIndex,
                                width: 120,
                                render: (_: any, record: any): React.ReactNode => {
                                    return (
                                        <span style={{background: 
                                            record.usableTotalWeight < record.warningStockWeight ? "red"
                                            : (record.usableTotalWeight > record.warningStockWeight && record.safetyStockWeight) ?
                                            "yellow" : ""
                                        }}>
                                            {record.usableTotalWeight}
                                        </span>
                                    )
                                }
                            })
                        }
                        return item;
                    })
                ]}
                onFilterSubmit={onFilterSubmit}
                extraOperation={<span style={{ marginLeft: "20px" }}>重量合计（吨）：{ data?.weight || 0 }</span>}
                filterValue={filterValue}
                searchFormItems={[
                    {
                        label: "类型",
                        name: 'materialCategoryName',
                        children: <Input placeholder="请输入类型进行查询" style={{ width: 300 }} />
                    },
                    {
                        label: "品名",
                        name: 'materialName',
                        children: <Input placeholder="请输入品名进行查询" style={{ width: 300 }} />
                    },
                    {
                        name: 'materialStandard',
                        label: '标准',
                        children: (
                            <Select placeholder="请选择标准" style={{ width: "300px" }}>
                                {
                                    materialStandardTypeOptions?.map((item: any, index: number) => {
                                        return <Select.Option value={item.id} key={index}>{item.name}</Select.Option>
                                    })
                                }
                            </Select>
                        )
                    },
                    {
                        label: "材质",
                        name: 'structureTexture',
                        children: <Input placeholder="请输入材质进行查询" style={{ width: 300 }} />
                    },
                    {
                        label: "规格",
                        name: 'structureSpec',
                        children: <Input placeholder="请输入规格进行查询" style={{ width: 300 }} />
                    },
                    {
                        label: "长度",
                        name: 'length',
                        children: <Input placeholder="请输入长度进行查询" style={{ width: 300 }} />
                    },
                    {
                        label: "宽度",
                        name: 'width',
                        children: <Input placeholder="请输入宽度进行查询" style={{ width: 300 }} />
                    }
                ]}
            />
        </>
    )
}