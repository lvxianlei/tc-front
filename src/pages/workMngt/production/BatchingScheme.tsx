/***
 * 新增配料方案
 * author: mschange
 * time: 2022/4/22
 */
import useRequest from '@ahooksjs/use-request';
import { Button, Spin } from 'antd';
import React, { useState } from 'react'
import { useHistory, useLocation, useParams, useRouteMatch } from 'react-router-dom'
import ExportList from '../../../components/export/list';
import RequestUtil from '../../../utils/RequestUtil';
import { DetailTitle } from '../../common';
import CommonTable from '../../common/CommonAliTable';
import { MaterialSummary, SummaryBatchingScheme } from "./BatchingScheme.json";

import "./batchingScheme.less"
export default function BatchingScheme(): React.ReactNode {
    const history = useHistory()
    // 传递的参数
    const params = useParams<{ id: string }>();
    const match = useRouteMatch()
    const location = useLocation<{ state: {} }>();
    const [isExport, setIsExportStoreList] = useState(false);
    const [status, setStatus] = useState<number>(1);

    // 查看配料方案
    const { run: getIngredient, data: IngredientData, loading } = useRequest<{ [key: string]: any }>((spec: string) => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(`/tower-supply/task/scheme/detail/${params.id}`);
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), {  })
    
    // 材料汇总
    const { run: getPurchaseBatchingScheme, data: PurchaseBatchingSchemeData, loading: lodingPurchaseBatchingScheme } = useRequest<{ [key: string]: any }>((spec: string) => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(`/tower-supply/task/scheme/summary/${params.id}`);
            resole(result || [])
        } catch (error) {
            reject(error)
        }
    }), {  })

    return (
        <Spin spinning={loading}>
            <div className='batchingSchemeWrapper'>
                <DetailTitle key={"detail"} title="材料汇总" />
                <div className='export_wrapper'>
                    <Button type='primary' ghost onClick={() => {
                        setStatus(1);
                        setIsExportStoreList(true);
                    }}>导出</Button>
                    <Button type='primary' ghost onClick={() => history.go(-1)}>返回上一级</Button>
                </div>
                <CommonTable
                    columns={[
                        {
                            key: 'index',
                            title: '序号',
                            dataIndex: 'index',
                            fixed: "left",
                            width: 50,
                            render: (_a: any, _b: any, index: number): React.ReactNode => {
                                return (
                                    <span>
                                        {index + 1}
                                    </span>
                                )
                            }
                        },
                        ...MaterialSummary.map((item:any)=>{
                            if (["alreadyPickingNum"].includes(item.dataIndex)) {
                                return ({
                                    ...item,
                                    width: 160,
                                    render: (value: string, records: any, key: number) => { 
                                        return   <div className={Number(value)<Number(records?.num)?'':Number(value)===Number(records?.num)?'green':'red'}>{value}</div>
                                       
                                }})
                            }
                            return item;
                        }),
                    ]} dataSource={(PurchaseBatchingSchemeData as any) || []}  scroll={{ y: 400 }}
                />
                <DetailTitle key={"detail"} title="配料方案" />
                <div className='export_wrapper'>
                    <Button type='primary' ghost onClick={() => {
                        setStatus(2);
                        setIsExportStoreList(true);
                    }}>导出</Button>
                </div>
                <CommonTable
                    columns={[
                        {
                            key: 'index',
                            title: '序号',
                            dataIndex: 'index',
                            fixed: "left",
                            width: 50,
                            render: (_a: any, _b: any, index: number): React.ReactNode => {
                                return (
                                    <span>
                                        {index + 1}
                                    </span>
                                )
                            }
                        },
                        ...SummaryBatchingScheme.map((item: any) => {
                            if (item.dataIndex === "utilizationRate") {
                                return ({
                                    title: item.title,
                                    dataIndex: item.dataIndex,
                                    width: 50,
                                    render: (_: any, record: any): React.ReactNode => (
                                        <span>{record[item.dataIndex] || 0}%</span>
                                    )
                                })
                            }
                            return item;
                        }),
                    ]} dataSource={(IngredientData as any) || []}  scroll={{ y: 400 }}
                />
            </div>
                {isExport ? <ExportList
                history={history}
                location={location}
                match={match}
                columnsKey={() => {
                    let keys = status === 1 ? MaterialSummary : SummaryBatchingScheme
                    return keys
                }}
                current={1}
                size={(IngredientData as any).length}
                total={(IngredientData as any).length}
                url={status === 1 ? `/tower-supply/task/scheme/summary/${params.id}` : `/tower-supply/task/scheme/detail/${params.id}`}
                serchObj={{}}
                closeExportList={() => { setIsExportStoreList(false) }}
            /> : null}
        </Spin>
    )
}