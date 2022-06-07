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
    const { run: saveRun } = useRequest<{ [key: string]: any }>(() => new Promise(async (resove, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.post(`/tower-storage/materialStock/summary/weight`)
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
                    ...baseColunm
                ]}
                onFilterSubmit={onFilterSubmit}
                extraOperation={<span style={{ marginLeft: "20px" }}>重量合计（吨）：3456.78</span>}
                filterValue={filterValue}
                searchFormItems={[
                    {
                        label: "类型",
                        name: 'fuzzyQuery',
                        children: <Input placeholder="请输入类型进行查询" style={{ width: 300 }} />
                    },
                    {
                        label: "品名",
                        name: 'fuzzyQuery',
                        children: <Input placeholder="请输入品名进行查询" style={{ width: 300 }} />
                    },
                    {
                        name: 'materialStandard',
                        label: '标准',
                        children: (
                            <Select placeholder="请选择标准" style={{ width: "140px" }}>
                                {
                                    materialStandardTypeOptions?.map((item: any, index: number) => {
                                        return <Select.Option value={item.name} key={index}>{item.name}</Select.Option>
                                    })
                                }
                            </Select>
                        )
                    },
                    {
                        label: "材质",
                        name: 'fuzzyQuery',
                        children: <Input placeholder="请输入材质进行查询" style={{ width: 300 }} />
                    },
                    {
                        label: "规格",
                        name: 'fuzzyQuery',
                        children: <Input placeholder="请输入规格进行查询" style={{ width: 300 }} />
                    },
                    {
                        label: "长度",
                        name: 'fuzzyQuery',
                        children: <Input placeholder="请输入长度进行查询" style={{ width: 300 }} />
                    },
                    {
                        label: "宽度",
                        name: 'fuzzyQuery',
                        children: <Input placeholder="请输入宽度进行查询" style={{ width: 300 }} />
                    }
                ]}
            />
        </>
    )
}