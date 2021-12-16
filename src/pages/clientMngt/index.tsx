import { Button, Input, message } from 'antd'
import React, { useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import ConfirmableButton from '../../components/ConfirmableButton'
import { IClient } from '../IClient'
import RequestUtil from '../../utils/RequestUtil'
import { clientMegt } from "./clientMegt.json"
import { Page } from '../common'

export default function Index(): JSX.Element {
    const history = useHistory()
    const [filterValue, setFilterValue] = useState<Object>({})
    const onFilterSubmit = (value: any) => {
        setFilterValue(value)
        return value
    }
    return <Page
        path="/tower-customer/customer"
        filterValue={filterValue}
        extraOperation={[
            <Button type="primary"><Link to="/client/mngt/new">新增客户</Link></Button>
        ]}
        columns={[...clientMegt, {
            title: '操作',
            dataIndex: 'operation',
            render: (_: undefined, record: object): React.ReactNode => (
                <>
                    <Button type="link" size="small"><Link to={`/client/mngt/edit/${(record as IClient).id}`}>编辑</Link></Button>
                    <ConfirmableButton
                        confirmTitle="要删除该客户吗？"
                        type="link"
                        placement="topRight"
                        onConfirm={async () => {
                            await RequestUtil.delete(`/tower-customer/customer?customerId=${(record as IClient).id}`)
                            message.success("删除成功...")
                            history.go(0)
                        }}
                    >
                        删除
                    </ConfirmableButton>
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