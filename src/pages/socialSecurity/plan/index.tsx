import React, { useState } from 'react'
import { Input, Button, message, Modal } from 'antd'
import { Page } from '../../common'
import { plan } from "./plan.json"
import { Link, useHistory } from 'react-router-dom';
import useRequest from '@ahooksjs/use-request'
import RequestUtil from '../../../utils/RequestUtil'
export default function ArchivesList(): React.ReactNode {
    const history = useHistory()
    const [filterValue, setFilterValue] = useState({});
    const onFilterSubmit = (value: any) => {
        setFilterValue(value)
        return value
    }

    const { run: changeStatusRun } = useRequest<{ [key: string]: any }>((data: any) => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.post(`/tower-hr/insurancePlan/submit`, data)
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    const handleSwichChange = (id: string, status: boolean) => {
        return Modal.confirm({
            title: `${status ? "启用" : "禁用"}方案`,
            content: `确定${status ? "启用" : "禁用"}？`,
            onOk: () => new Promise(async (resove, reject) => {
                try {
                    await changeStatusRun({ id, status: status ? 1 : 2 })
                    message.success(`${status ? "启用" : "禁用"}成功...`)
                    history.go(0)
                    resove(true)
                } catch (error) {
                    reject(false)
                }
            })
        })
    }

    return (
        <Page
            path={`/tower-hr/insurancePlan`}
            columns={[
                {
                    title: '序号',
                    dataIndex: 'index',
                    width: 50,
                    render: (_a: any, _b: any, index: number): React.ReactNode => (<span>{index + 1}</span>)
                },
                ...plan,
                {
                    title: '操作',
                    fixed: 'right',
                    width: 230,
                    dataIndex: 'operation',
                    render: (_: undefined, record: any): React.ReactNode => (
                        <>
                            <Button type="link" size="small"><Link to={`/socialSecurity/plan/detail/${record.id}`}>查看</Link></Button>
                            <Button type="link" size="small"><Link to={`/socialSecurity/plan/edit/${record.id}`}>编辑</Link></Button>
                            <Button type="link" size="small" disabled={record.status === 1} onClick={() => handleSwichChange(record.id, true)}>启用</Button>
                            <Button type="link" size="small" disabled={record.status === 2} onClick={() => handleSwichChange(record.id, false)}>禁用</Button>
                        </>
                    )
                }
            ]}
            onFilterSubmit={onFilterSubmit}
            filterValue={filterValue}
            extraOperation={
                <Button type="primary" ghost><Link to={`/socialSecurity/plan/new`}>新增方案</Link></Button>
            }
            searchFormItems={[
                {
                    name: 'insurancePlanName',
                    children: <Input placeholder="请输入方案名称" maxLength={200} />
                }
            ]}
        />
    )
}