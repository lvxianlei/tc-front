import { Button } from 'antd';
import React, { useState } from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';
import RequestUtil from '../../../utils/RequestUtil';
import { Page } from '../../common';

export default function BoltCheck(): React.ReactNode {
    const match: any = useRouteMatch()
    const history = useHistory()
    const columns = [
        {
            title: '序号',
            dataIndex: 'index',
            width: 100,
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => {
                return <span>{index + 1}</span>
            }
        },
        {
            title: '塔位号',
            width: 150,
            dataIndex: 'typeName',
        },
        {
            title: '呼高m',
            width: 150,
            dataIndex: 'name',
        },
        {
            title: '基数',
            width: 150,
            dataIndex: 'level',
        },
        {
            title: '总重',
            width: 150,
            dataIndex: 'specs',
        },
        {
            title: '说明',
            dataIndex: 'unbuckleLength',
            width: 120,
        },
        {
            title: '操作',
            width: 120,
            dataIndex: 'operation',
            render: () => {
                return (
                    <div className='operation'>
                        <span
                            onClick={() => {
                                history.push('')
                            }}
                        >螺栓明细</span>
                    </div>
                )
            }
        },
    ]
    /**
     * 完成校验
     */
    const successCheck = async () => {
        await RequestUtil.put('/tower-science/boltRecord/completeCheck', {
            productCategoryId: match.params.id,
        })
    }
    return (
        <div>
            <Page
                path={`/tower-science/boltRecord/basicHeight/${match.params.id}`}
                columns={columns}
                extraOperation={
                    <div>
                        <Button type="primary" ghost>导出</Button>
                        <Button type="primary" ghost onClick={() => { successCheck() }} style={{ marginLeft: 10, }}>完成核验</Button>
                        <Button type="primary" ghost onClick={() => { history.go(-1) }} style={{ marginLeft: 10, }}>返回上一级</Button>
                    </div>
                }
                headTabs={[]}
                searchFormItems={[]}
            />
        </div>
    )
}