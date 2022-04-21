/***
 * 新增配料方案
 * author: mschange
 * time: 2022/4/22
 */
import { Button } from 'antd';
import React, { useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { DetailTitle } from '../../common';
import CommonTable from '../../common/CommonAliTable';
import { MaterialSummary, SummaryBatchingScheme } from "./BatchingScheme.json";

import "./batchingScheme.less"
export default function BatchingScheme(): React.ReactNode {
    const history = useHistory()
    // 传递的参数
    const params = useParams<{ id: string }>();
    return (
        <div className='batchingSchemeWrapper'>
            <DetailTitle key={"detail"} title="材料汇总" />
            <div className='export_wrapper'>
                <Button type='primary' ghost>导出</Button>
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
                    ...MaterialSummary,
                ]} dataSource={[]} pagination={false} scroll={{ y: 400 }}
            />
            <DetailTitle key={"detail"} title="配料方案" />
            <div className='export_wrapper'>
                <Button type='primary' ghost>导出</Button>
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
                    ...SummaryBatchingScheme,
                ]} dataSource={[]} pagination={false} scroll={{ y: 400 }}
            />
        </div>
    )
}