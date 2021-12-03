import React, { useState } from 'react'
import { Input, Button } from 'antd'
import { Page } from '../../common'
import { plan } from "./plan.json"
import { Link } from 'react-router-dom';
export default function ArchivesList(): React.ReactNode {
    const [filterValue, setFilterValue] = useState({});
    const onFilterSubmit = (value: any) => {
        setFilterValue(value)
        return value
    }
    return (
        <Page
            path={
                // `/tower-hr/insurancePlan`
                `/tower-finance/invoicing`
            }
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
                            <Button type="link" size="small">启用</Button>
                            <Button type="link" size="small">禁用</Button>
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