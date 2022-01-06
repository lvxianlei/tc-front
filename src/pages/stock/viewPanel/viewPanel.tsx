/***
 * 新修改的库存看板
 * 原文件：当前目录下OriginalDocument.tsx
 * 时间：2022/01/05
 */
 import React, { useState, useEffect } from 'react';
 import { Input, Select } from 'antd';
 import { Page } from '../../common';
 import { materialStandardTypeOptions } from '../../../configuration/DictionaryOptions';
 import RequestUtil from '../../../utils/RequestUtil';
 
 export default function ViewPanel(): React.ReactNode {
     const [ filterValue, setFilterValue ] = useState<any>({
        condition: "",
        fuzzyQuery: "",
        materialTexture: "",
        standard: ""
     });
     let [selects, setSelects] = useState<any>({
        materialNames: [],
        materialTextures: [],
        specs: [],
    });

    const columns = [
        {
            key: 'productName',
            title: '品名',
            dataIndex: 'productName',
        },
        {
            key: 'standard',
            title: '标准',
            dataIndex: 'standard'
        },
        {
            key: 'spec',
            title: '规格',
            dataIndex: 'spec',
        },
        {
            key: 'materialTexture',
            title: '材质',
            dataIndex: 'materialTexture'
        },
        {
            key: 'stockWeight',
            title: '库存重量（吨）',
            dataIndex: 'stockWeight'
        },
        {
            key: 'onWayWeight',
            title: '在途重量（吨）',
            dataIndex: 'onWayWeight'
        },
        {
            key: 'canUseWeight',
            title: '可用库存（吨）',
            dataIndex: 'canUseWeight'
        },
        {
            key: 'noPickWeight',
            title: '生产未领料（吨）',
            dataIndex: 'noPickWeight'
        },
        {
            key: 'safeWeight',
            title: '安全库存（吨）',
            dataIndex: 'safeWeight'
        },
        {
            key: 'alarmWeight',
            title: '告警库存（吨）',
            dataIndex: 'alarmWeight'
        },
        {
            key: 'typeName',
            title: '库存状态',
            dataIndex: 'typeName',
            isExport: true,
            render: (text: any, item: any, index: any) => {
                return (
                    <div>
                        {
                            item.type === 0 ?
                                <span style={{ padding: '5px 8px', color: '#000' }}>正常</span> :
                                item.type === 1 ?
                                    <span style={{ padding: '5px 8px', backgroundColor: 'yellow', color: '#111' }}>提醒</span> :
                                    <span style={{ padding: '5px 8px', backgroundColor: 'red', color: '#FF8C00' }}>告警</span>
                        }
                    </div>
                )
            }
        },
    ]

    // 获取选择框信息
    const getSelectDetail = async () => {
        const data: any = await RequestUtil.get('/tower-system/material/selectDetail')
        setSelects(data)
    }

    useEffect(() => {
        getSelectDetail()
    }, []);

     // 查询按钮
     const onFilterSubmit = (value: any) => {
        const result = {
            condition: value.condition || "",
            fuzzyQuery: value.fuzzyQuery || "",
            materialTexture: value.materialTexture || "",
            standard: value.standard || ""
         }
         setFilterValue(result)
        return result
     }
 
     return (
         <>
             <Page
                 path="/tower-storage/safetyStock/board"
                 exportPath={"/tower-storage/safetyStock/board"}
                 columns={[
                     {
                         key: 'index',
                         title: '序号',
                         dataIndex: 'index',
                         fixed: "left",
                         width: 50,
                         render: (_a: any, _b: any, index: number): React.ReactNode => (<span>{index + 1}</span>)
                     },
                     ...columns
                ]}
                 onFilterSubmit={onFilterSubmit}
                 filterValue={ filterValue }
                 searchFormItems={[
                    {
                        name: 'materialTexture',
                        label: '材质',
                        children: (
                            <Select placeholder="请选择回款类型" style={{ width: "140px" }}>
                                {
                                    selects.materialNames.map((item: string) => {
                                        return (
                                            <Select.Option value={item} key={item}>{item}</Select.Option>
                                        )
                                    })
                                }
                            </Select>
                        )
                    },
                    {
                        name: 'standard',
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
                        name: 'condition',
                        label: '库存状态',
                        children: (
                            <Select placeholder="请选择库存状态" style={{ width: "140px" }}>
                                <Select.Option value={'0'}>正常</Select.Option>
                                <Select.Option value={'1'}>提醒</Select.Option>
                                <Select.Option value={'2'}>告警</Select.Option>
                            </Select>
                        )
                    },
                    {
                        name: 'fuzzyQuery',
                        label: "品名/规格",
                        children: <Input placeholder="请输入品名/规进行查询" style={{ width: 300 }} />
                    }
                 ]}
             />
         </>
     )
 }