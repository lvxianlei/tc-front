/***
 * 新修改的原材料入库详情
 * 原文件地址当前目录：OriginalDocument.tsx
 * 时间：2022/01/06
 */
 import React, { useState, useEffect, useRef } from 'react';
 import { Input, Select, DatePicker, Button, Modal, message } from 'antd';
 import { FixedType } from 'rc-table/lib/interface'
 import { Page } from '../../../common';
 import RequestUtil from '../../../../utils/RequestUtil';
 import useRequest from '@ahooksjs/use-request';
 import { useParams, useHistory } from 'react-router-dom';
 import { baseColumn } from "./detail.json";
 
 import '../../StockPublicStyle.less';
 import './detail.less';

 export default function RawMaterialWarehousing(): React.ReactNode {
    const params = useParams<{ id: string }>();
    const history = useHistory();
    const [ filterValue, setFilterValue ] = useState<any>({
        fuzzyQuery: "",
        receiveDetailStatus: "",
        startStatusUpdateTime: "",
        endStatusUpdateTime: "",
        receiveStockId: params.id,
    });

    // 批量入库
    const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);

    // 入库以及批量入库  待联调
    const { data: statisticsData, run } = useRequest<{ [key: string]: any }>(() => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(`/tower-storage/receiveStock/detailStatistics`, {
                fuzzyQuery: filterValue.fuzzyQuery || "",
                startStatusUpdateTime: filterValue.startStatusUpdateTime || '',
                endStatusUpdateTime: filterValue.endStatusUpdateTime || '',
                receiveStockId: params.id,
                receiveDetailStatus: filterValue.receiveDetailStatus || "",
            })
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), {  })

     // 查询按钮
     const onFilterSubmit = (value: any) => {
        const result = {
            fuzzyQuery: value.fuzzyQuery || "",
            receiveDetailStatus: value.receiveDetailStatus || "",
            startStatusUpdateTime: "",
            endStatusUpdateTime: "",
            receiveStockId: params.id,
        }
         if (value.startRefundTime) {
            const formatDate = value.startRefundTime.map((item: any) => item.format("YYYY-MM-DD"))
            result.startStatusUpdateTime = `${formatDate[0]} 00:00:00`
            result.endStatusUpdateTime = `${formatDate[1]} 23:59:59`
            delete value.startRefundTime
        }
        setFilterValue(result)
        return result
     }

    const handleWarehousingClick = () => {
        console.log("入库")
        if (selectedRowKeys.length < 1) {
            message.error("请选择原材料");
        }
    }
     return (
         <>
             <Page
                 path="/tower-storage/receiveStock/detail"
                 exportPath={"/tower-storage/receiveStock/detail"}
                 columns={[
                     {
                         key: 'index',
                         title: '序号',
                         dataIndex: 'index',
                         fixed: "left",
                         width: 50,
                         render: (_a: any, _b: any, index: number): React.ReactNode => (<span>{index + 1}</span>)
                     },
                     ...baseColumn,
                     {
                        title: '操作',
                        dataIndex: 'key',
                        width: 80,
                        fixed: 'right' as FixedType,
                        render: (_: undefined, record: any): React.ReactNode => (
                            <>
                                <Button className='btn-operation-link' type='link' disabled={record.receiveDetailStatus !== 0} onClick={() => {
                                    console.log("这里是单个入库")
                                }}>入库</Button>
                            </>
                        )
                    }
                ]}
                extraOperation={() =>
                    <>
                        <Button type="primary" ghost onClick={() => handleWarehousingClick()} >批量入库</Button>
                        <Button type="ghost" onClick={() => history.go(-1)}>返回</Button>
                        <div>已收货：重量(吨)合计：<span style={{marginRight: 12, color: "#FF8C00"}}>{statisticsData?.receiveWeight}</span>已收货：价税合计(元)合计：<span style={{marginRight: 12, color: "#FF8C00"}}>{statisticsData?.receivePrice}</span> 待收货：重量(吨)合计：<span style={{marginRight: 12, color: "#FF8C00"}}>{statisticsData?.waitWeight}</span>待收货：价税合计(元)合计：<span style={{marginRight: 12, color: "#FF8C00"}}>{statisticsData?.waitPrice}</span></div>
                    </>
                }
                 onFilterSubmit={onFilterSubmit}
                 filterValue={ filterValue }
                 searchFormItems={[]}
                 tableProps={{
                    rowSelection: {
                        type: "checkbox",
                        // selectedRowKeys: generateIds,
                        onChange: (selectedRowKeys: any[]) => {
                            console.log(selectedRowKeys)
                            setSelectedRowKeys(selectedRowKeys);
                        },
                        getCheckboxProps: (record: any) => ({ // 这里是禁用已入库的
                            disabled: record.parentId === "0"|| record.type === 2, // Column configuration not to be checked
                        })
                    }
                }}
             />
         </>
     )
 }