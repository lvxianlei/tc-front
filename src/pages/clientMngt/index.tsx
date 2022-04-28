import React, { useState } from 'react'
import { Button, Input, message, Popconfirm } from 'antd'
import { Link, useHistory } from 'react-router-dom'
import RequestUtil from '../../utils/RequestUtil'
import { clientMegt } from "./clientMegt.json"
import { SearchTable as Page } from '../common'
import useRequest from '@ahooksjs/use-request'

export default function Index(): JSX.Element {
    const history = useHistory()
    const { run: deleteRun } = useRequest<{ [key: string]: any }>((id: string) => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.delete(`/tower-market/customer?customerId=${id}`)
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    return <Page
        path="/tower-market/customer"
        extraOperation={
            <Button type="primary"><Link to="/client/mngt/edit/new">新增客户</Link></Button>
        }
        columns={[
            {
                title: '序号',
                dataIndex: 'index',
                fixed: "left",
                width: 50,
                render: (_a: any, _b: any, index: number): React.ReactNode => (<span>{index + 1}</span>)
            },
            ...(clientMegt as any),
            {
                title: '操作',
                dataIndex: 'operation',
                width: 100,
                fixed: "right",
                render: (_: undefined, record: any): React.ReactNode => (
                    <>
                        <Link to={`/client/mngt/edit/${record?.id}`}>编辑</Link>
                        <Popconfirm
                            title="确认删除?"
                            onConfirm={async () => {
                                await deleteRun(record?.id)
                                message.success("删除成功...")
                                history.go(0)
                            }}
                            okText="确认"
                            cancelText="取消"
                        >
                            <Button type="link">删除</Button>
                        </Popconfirm>
                    </>
                )
            }]}
        searchFormItems={[
            {
                name: 'name',
                children: <Input placeholder="搜索客户名称关键词" maxLength={200} />
            }
        ]}
    />
}
