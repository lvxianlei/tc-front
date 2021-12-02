import React, { useState } from 'react'
import { Input, Button } from 'antd'
import { Link } from 'react-router-dom'
import { Page } from '../../common'
import { archives } from "./archives.json"

export default function PlanList(): React.ReactNode {
    const [filterValue, setFilterValue] = useState({});
    const onFilterSubmit = (value: any) => {
        setFilterValue(value)
        return value
    }

    return (
        <Page
            path={`/tower-science/drawProductSegment`}
            columns={[
                {
                    key: 'index',
                    title: '序号',
                    dataIndex: 'index',
                    width: 50,
                    render: (_a: any, _b: any, index: number): React.ReactNode => (<span>{index + 1}</span>)
                },
                ...archives,
                {
                    key: 'operation',
                    title: '操作',
                    fixed: 'right',
                    width: 230,
                    dataIndex: 'operation',
                    render: (_: undefined, record: any): React.ReactNode => (
                        <>
                            <Button type="link" size="small"><Link to={`/socialSecurity/archives/detail/${record.id}`}>查看</Link></Button>
                            <Button type="link" size="small"><Link to={`/socialSecurity/archives/edit/${record.id}`}>编辑</Link></Button>
                        </>
                    )
                }
            ]}
            onFilterSubmit={onFilterSubmit}
            filterValue={filterValue}
            searchFormItems={[
                {
                    name: 'employeeName',
                    children: <Input placeholder="请输入员工姓名/身份证号" maxLength={200} />
                },
            ]}
        />
    )
}