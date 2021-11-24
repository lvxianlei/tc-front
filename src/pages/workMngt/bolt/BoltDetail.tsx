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
            title: '螺栓类型',
            width: 150,
            dataIndex: 'typeName',
        },
        {
            title: '名称',
            width: 150,
            dataIndex: 'name',
        },
        {
            title: '等级',
            width: 150,
            dataIndex: 'level',
        },
        {
            title: '规格',
            width: 150,
            dataIndex: 'specs',
        },
        {
            title: '无扣长（mm）',
            dataIndex: 'unbuckleLength',
            width: 120,
        },
        {
            title: '小计',
            width: 150,
            dataIndex: 'specs',
        },
        {
            title: '合计',
            width: 150,
            dataIndex: 'specs',
        },
        {
            title: '单重（kg）',
            width: 150,
            dataIndex: 'specs',
        },
        {
            title: '合计重（kg）',
            width: 150,
            dataIndex: 'specs',
        },
        {
            title: '备注',
            width: 150,
            dataIndex: 'specs',
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
                            }}
                        >删除</span>
                    </div>
                )
            }
        },
    ]
    return (
        <div>
            <Page
                path={`/tower-science/boltRecord/basicHeight/${match.params.id}`}
                columns={columns}
                extraOperation={
                    <div>
                        <Button type="primary" ghost>模板下载</Button>
                        <Button type="primary" ghost onClick={() => { }} style={{ marginLeft: 10, }}>编辑/锁定</Button>
                        <Button type="primary" ghost onClick={() => { }} style={{ marginLeft: 10, }}>导入</Button>
                        <Button type="primary" ghost onClick={() => { }} style={{ marginLeft: 10, }}>添加</Button>
                        <Button type="primary" ghost onClick={() => { history.go(-1) }} style={{ marginLeft: 10, }}>返回上一级</Button>
                    </div>
                }
                headTabs={[]}
                searchFormItems={[]}
            />
        </div>
    )
}