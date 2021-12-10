import React, { useState } from 'react'
import { Input, Button, DatePicker, Select } from 'antd'
import { Link, useParams } from 'react-router-dom'
import { Page } from '../../common'
import { archives } from "./archives.json"
export default function ArchivesList(): React.ReactNode {
    const params = useParams<{ id: string, status: string, materialLeader: string }>();
    const [filterValue, setFilterValue] = useState({});
    const onFilterSubmit = (value: any) => {
        if (value.statusUpdateTime) {
            const formatDate = value.statusUpdateTime.map((item: any) => item.format("YYYY-MM-DD"))
            value.updateStatusTimeStart = formatDate[0] + ' 00:00:00';
            value.updateStatusTimeEnd = formatDate[1] + ' 23:59:59';
            delete value.statusUpdateTime
        }
        setFilterValue(value)
        return value
    }
    return (
        <Page
            path={`/tower-hr/employee/archives`}
            columns={[
                {
                    title: '序号',
                    dataIndex: 'index',
                    width: 50,
                    render: (_a: any, _b: any, index: number): React.ReactNode => (<span>{index + 1}</span>)
                },
                ...archives,
                {
                    title: '操作',
                    fixed: 'right',
                    width: 230,
                    dataIndex: 'operation',
                    render: (_: undefined, record: any): React.ReactNode => (
                        <>
                            <Button type="link" size="small"><Link to={`/employeeRelation/archives/detail/${record.id}`}>查看</Link></Button>
                            <Button type="link" size="small"><Link to={`/employeeRelation/archives/edit/${record.id}`}>编辑</Link></Button>
                        </>
                    )
                }
            ]}
            onFilterSubmit={onFilterSubmit}
            filterValue={filterValue}
            requestData={{ productCategory: params.id }}
            searchFormItems={[
                {
                    name: 'fuzzyMsg',
                    label: '模糊查询项',
                    children: <Input placeholder="请输入员工姓名/电话/身份证号" maxLength={200} />
                },
                {
                    name: 'employeeNature',
                    label: '员工性质',
                    children: <Select style={{ width: 100 }}>
                        <Select.Option value={1}>正式员工</Select.Option>
                        <Select.Option value={2}>短期派遣员工</Select.Option>
                        <Select.Option value={3}>超龄员工</Select.Option>
                        <Select.Option value={4}>实习员工</Select.Option>
                    </Select>
                },
                {
                    name: 'postName',
                    label: '员工分组',
                    children: <Input placeholder="请输入员工姓名/电话/身份证号进行查询" maxLength={200} />
                },
                {
                    name: 'statusUpdateTime',
                    label: '入职日期',
                    children: <DatePicker.RangePicker format="YYYY-MM-DD" />
                },
            ]}
        />
    )
}