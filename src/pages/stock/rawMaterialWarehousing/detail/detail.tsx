/**
 * 新修改的原材料入库详情
 * 原文件地址当前目录：OriginalDocument.tsx
 * 时间：2022/01/06
 */
import React, { useState } from 'react';
import { Button, message, Popconfirm, Space } from 'antd';
import { FixedType } from 'rc-table/lib/interface'
import { SearchTable as Page } from '../../../common';
import RequestUtil from '../../../../utils/RequestUtil';
import useRequest from '@ahooksjs/use-request';
import { useParams, useHistory } from 'react-router-dom';
import { baseColumn } from "./detail.json";
import '../../StockPublicStyle.less';
import './detail.less';

export default function RawMaterialWarehousing(): React.ReactNode {
    const params = useParams<{ id: string }>();
    const history = useHistory();
    const [filterValue, setFilterValue] = useState<any>({
        fuzzyQuery: "",
        receiveDetailStatus: "",
        startStatusUpdateTime: "",
        endStatusUpdateTime: "",
        receiveStockId: params.id,
    });

    // 批量入库
    const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);

    // 入库以及批量入库  待联调
    const { data: statisticsDatas, run: saveRun } = useRequest<any[]>((data) => new Promise(async (resole, reject) => {
        try {
            const result: any = await RequestUtil.put(`/tower-storage/warehousingEntry/batchSaveWarehousingEntry`, { warehousingDetailIds: data })
            message.success("入库成功！");
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    // 统计信息接口
    const { data: statisticsData, run } = useRequest<{ [key: string]: any }>(() => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(`/tower-storage/warehousingEntry/statisticsWarehousingEntry`,{warehousingEntryId: params.id})
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), {})

    const handleWarehousingClick = async () => {
        if (selectedRowKeys.length < 1) {
            message.error("请选择原材料");
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
        await saveRun(selectedRowKeys);
        history.go(0);
    }
    return (
        <>
            <Page
                path={`/tower-storage/warehousingEntry/warehousingEntryDetail?warehousingEntryId=${params.id}`}
                exportPath={`/tower-storage/warehousingEntry/warehousingEntryDetail?warehousingEntryId=${params.id}`}
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
                        width: 100,
                        fixed: 'right' as FixedType,
                        render: (_: undefined, record: any): React.ReactNode => (
                            <>
                                <Button className='btn-operation-link' type='link' disabled={record.warehousingEntryStatus === 1} onClick={async () => {
                                    const result = [
                                        {
                                            id: record.id,
                                            warehousingEntryType: 1
                                        }
                                    ]
                                    await saveRun(result);
                                    history.go(0);
                                }}>入库</Button>
                                <Popconfirm
                                    title="确认撤销?"
                                    onConfirm={() => {
                                        RequestUtil.put(`/tower-storage/warehousingEntry/detail/repeal/${record.id}`).then(res => {
                                            message.success("成功撤销...")
                                            history.go(0)
                                        });
                                    }}
                                    okText="确认"
                                    cancelText="取消"
                                    disabled={record.state === 1}
                                >
                                    <Button type="link" disabled={record.state === 1}>撤销</Button>
                                </Popconfirm>
                                <Popconfirm
                                    title="确认删除?"
                                    onConfirm={() => {
                                        RequestUtil.delete(`/tower-storage/warehousingEntry/detail/${record.id}`).then(res => {
                                            message.success("成功删除...")
                                            history.go(0)
                                        });
                                    }}
                                    okText="确认"
                                    cancelText="取消"
                                    disabled={record.state === 1}
                                >
                                    <Button type="link" disabled={record.state === 1}>删除</Button>
                                </Popconfirm>
                            </>
                        )
                    }
                ]}
                extraOperation={() =>
                    <>
                        <Button type="primary" ghost onClick={() => handleWarehousingClick()} >批量入库</Button>
                        <Button type="ghost" onClick={() => history.go(-1)}>返回</Button>
                        <div>已收货：重量(吨)合计：<span style={{ marginRight: 12, color: "#FF8C00" }}>{statisticsData?.receiveWeight}</span>已收货：价税合计(元)合计：<span style={{ marginRight: 12, color: "#FF8C00" }}>{statisticsData?.receivePrice}</span> 待收货：重量(吨)合计：<span style={{ marginRight: 12, color: "#FF8C00" }}>{statisticsData?.waitWeight}</span>待收货：价税合计(元)合计：<span style={{ marginRight: 12, color: "#FF8C00" }}>{statisticsData?.waitPrice}</span></div>
                    </>
                }
                filterValue={filterValue}
                searchFormItems={[]}
                tableProps={{
                    rowSelection: {
                        type: "checkbox",
                        selectedRowKeys: selectedRowKeys,
                        onChange: (selectedRowKeys: any[]) => {
                            setSelectedRowKeys(selectedRowKeys);
                        },
                        getCheckboxProps: (record: any) => record.warehousingEntryStatus === 1
                    }
                }}
            />
        </>
    )
}