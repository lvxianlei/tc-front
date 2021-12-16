import React from 'react';
import { Button, Input, Space } from 'antd'
import { useHistory } from 'react-router'
import { Link } from 'react-router-dom'
import { IAbstractMngtComponentState } from '../../components/AbstractMngtComponent'
import ConfirmableButton from '../../components/ConfirmableButton'
import { IClient } from '../IClient'
import RequestUtil from '../../utils/RequestUtil'
import { Page } from '../common'
import { clientMngt } from "./clientMngt.json"

export interface IClientMngtState extends IAbstractMngtComponentState {
    readonly tableDataSource: IClient[];
    readonly name?: string;
}

export default function ClientMngt() {
    const history = useHistory()
    const onFilterSubmit = (value: any) => {
        if (value.startUpdateTime) {
            const formatDate = value.startUpdateTime.map((item: any) => item.format("YYYY-MM-DD"))
            value.startUpdateTime = formatDate[0] + " 00:00:00"
            value.endUpdateTime = formatDate[1] + " 23:59:59"
        }
        return value
    }
    return <Page
        path="/tower-customer/customer"
        extraOperation={[
            <Button key="new" type="primary"><Link to={`/client/mngt/new`}>新增</Link></Button>
        ]}
        columns={[...clientMngt, {
            title: "操作",
            dataIndex: "opration",
            render: (_: undefined, record: any) => <Space direction="horizontal" size="small">
                <Link to={`/client/mngt/edit/${(record as IClient).id}`}>编辑</Link>
                <ConfirmableButton
                    confirmTitle="要删除该客户吗？"
                    type="link"
                    placement="topRight"
                    onConfirm={async () => {
                        await RequestUtil.delete(`/tower-customer/customer?customerId=${(record as IClient).id}`);
                        history.go(0)
                    }}
                >
                    删除
                </ConfirmableButton>
            </Space>
        }]}
        onFilterSubmit={onFilterSubmit}
        searchFormItems={[{
            name: 'name',
            children: <Input placeholder="搜索客户名称关键词" maxLength={200} />
        }]}
    />
}

