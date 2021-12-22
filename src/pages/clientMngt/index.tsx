import { Button, Input, message, Modal } from 'antd'
import React, { useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import RequestUtil from '../../utils/RequestUtil'
import { clientMegt } from "./clientMegt.json"
import { Page } from '../common'
import useRequest from '@ahooksjs/use-request'

export default function Index(): JSX.Element {
    const history = useHistory()
    const [filterValue, setFilterValue] = useState<Object>({})
    const { run: deleteRun } = useRequest<{ [key: string]: any }>((id: string) => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.delete(`/tower-customer/customer?customerId=${id}`)
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    const onFilterSubmit = (value: any) => {
        setFilterValue(value)
        return value
    }
    const handleDelete = (id: string) => {
        Modal.confirm({
            title: "删除",
            content: "确定删除此客户信息吗？",
            onOk: () => new Promise(async (resove, reject) => {
                try {
                    resove(await deleteRun(id))
                    message.success("删除成功...")
                    history.go(0)
                } catch (error) {
                    reject(error)
                }
            })
        })
    }
    return <Page
        path="/tower-customer/customer"
        filterValue={filterValue}
        extraOperation={[
            <Button key="new" type="primary"><Link to="/client/mngt/new">新增客户</Link></Button>
        ]}
        columns={[...clientMegt, {
            title: '操作',
            dataIndex: 'operation',
            render: (_: undefined, record: any): React.ReactNode => (
                <>
                    <Button type="link" size="small"><Link to={`/client/mngt/edit/${record?.id}`}>编辑</Link></Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => handleDelete(record?.id)}
                    >删除</Button>
                </>
            )
        }]}
        onFilterSubmit={onFilterSubmit}
        searchFormItems={[
            {
                name: 'name',
                children: <Input placeholder="搜索客户名称关键词" maxLength={200} />
            }
        ]}
    />
}
