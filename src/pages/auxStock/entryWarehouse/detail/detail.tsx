/**
 * 新修改的原材料入库详情
 * 原文件地址当前目录：OriginalDocument.tsx
 * 时间：2022/01/06
 */
import React, { useState } from 'react';
import { Button, message, Popconfirm } from 'antd';
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

    // 批量入库
    const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);

    // 入库以及批量入库
    const { run: saveRun } = useRequest<any[]>((data) => new Promise(async (resole, reject) => {
        try {
            const result: any = await RequestUtil.put(
                `/tower-storage/warehousingEntry/auxiliary/detail/entry`,
                { warehousingDetailIds: data }
            )
            message.success("入库成功！");
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    // 统计信息接口
    const { data: statisticsData, run } = useRequest<{ [key: string]: any }>(() => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(`/tower-storage/warehousingEntry/statisticsWarehousingEntry`,{warehousingEntryId: params.id, materialType: 2})
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), {})

    // 撤销
    const { loading: revocating, run: revocationRun } = useRequest<{ [key: string]: any }>((id: string) => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.put(
                `/tower-storage/warehousingEntry/auxiliary/detail/repeal/${id}`
            )
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    // 删除
    const { loading: deleting, run: deleteRun } = useRequest<{ [key: string]: any }>((id: string) => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.delete(`/tower-storage/warehousingEntry/auxiliary/detail/${id}`)
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    const handleWarehousingClick = async () => {
        if (selectedRowKeys.length < 1) {
            message.error("请选择原材料");
            return false;
        }
        await saveRun(selectedRowKeys);
        history.go(0);
    }

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
                path={`/tower-storage/warehousingEntry/auxiliary/detailList`}
                exportPath={`/tower-storage/warehousingEntry/auxiliary/detailList`}
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
                        width: 160,
                        fixed: 'right' as FixedType,
                        render: (_: undefined, record: any): React.ReactNode => (
                            <>
                                <Button className='btn-operation-link' type='link' disabled={record.warehousingEntryStatus === 1} onClick={async () => {
                                    await saveRun([record.id]);
                                    history.go(0);
                                }}>入库</Button>
                                <Popconfirm
                                    title="确认撤销?"
                                    onConfirm={() => handleRevocation(record.id)}
                                    disabled={record.warehousingEntryStatus !== 1}
                                    okText="确认"
                                    cancelText="取消"
                                >
                                    <Button loading={revocating} disabled={record.warehousingEntryStatus !== 1} type="link">撤销</Button>
                                </Popconfirm>
                                <Popconfirm
                                    title="确认删除?"
                                    onConfirm={() => handleDelete(record?.id)}
                                    okText="确认"
                                    disabled={record.warehousingEntryStatus !== 0}
                                    cancelText="取消"
                                >
                                    <Button loading={deleting} disabled={record.warehousingEntryStatus !== 0} type="link">删除</Button>
                                </Popconfirm>
                            </>
                        )
                    }
                ]}
                extraOperation={() =>
                    <>
                        <Button type="primary" ghost onClick={() => handleWarehousingClick()} >批量入库</Button>
                        <Button type="ghost" onClick={() => history.go(-1)}>返回</Button>
                        <div>已入库：数量合计：
                            <span
                                style={{
                                    marginRight: 12,
                                    color: "#FF8C00"
                                }}>{statisticsData?.entryNum}</span>
                            已入库：价税合计(元)合计：
                            <span
                                style={{
                                    marginRight: 12,
                                    color: "#FF8C00"
                                }}
                            >{statisticsData?.receivePrice}</span>
                            待入库：数量(吨)合计：
                            <span
                                style={{
                                    marginRight: 12,
                                    color: "#FF8C00"
                                }}>{statisticsData?.waitEntryNum}</span>
                            待入库：价税合计(元)合计：
                            <span
                                style={{
                                    marginRight: 12,
                                    color: "#FF8C00"
                                }}>{statisticsData?.waitPrice}</span>
                        </div>
                    </>
                }
                filterValue={{
                    warehousingEntryId: params.id
                }}
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