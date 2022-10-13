/**
 * 新修改的原材料入库详情
 * 原文件地址当前目录：OriginalDocument.tsx
 * 时间：2022/01/06
 */
import React, { useState } from 'react';
import { Button, message } from 'antd';
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
    const { data: statisticsData } = useRequest<{ [key: string]: any }>(() => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(`/tower-storage/warehousingEntry/statisticsWarehousingEntry/${params.id}`)
            resole(result)
        } catch (error) {
            reject(error)
        }
    }))

    const handleWarehousingClick = async () => {
        if (selectedRowKeys.length < 1) {
            message.error("请选择原材料");
            return false;
        }
        await saveRun(selectedRowKeys);
        history.go(0);
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
                        width: 80,
                        fixed: 'right' as FixedType,
                        render: (_: undefined, record: any): React.ReactNode => (
                            <>
                                <Button className='btn-operation-link' type='link' disabled={record.warehousingEntryStatus === 1} onClick={async () => {
                                    await saveRun([record.id]);
                                    history.go(0);
                                }}>入库</Button>
                            </>
                        )
                    }
                ]}
                extraOperation={() =>
                    <>
                        <Button type="primary" ghost onClick={() => handleWarehousingClick()} >批量入库</Button>
                        <Button type="ghost" onClick={() => history.go(-1)}>返回</Button>
                        <div>已收货：数量合计：<span
                            style={{
                                marginRight: 12,
                                color: "#FF8C00"
                            }}>{statisticsData?.receiveWeight}</span>已收货：价税合计(元)合计：<span
                                style={{
                                    marginRight: 12,
                                    color: "#FF8C00"
                                }}>{statisticsData?.receivePrice}</span> 待收货：数量(吨)合计：<span
                                    style={{
                                        marginRight: 12,
                                        color: "#FF8C00"
                                    }}>{statisticsData?.waitWeight}</span>待收货：价税合计(元)合计：<span
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
                        // selectedRowKeys: generateIds,
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