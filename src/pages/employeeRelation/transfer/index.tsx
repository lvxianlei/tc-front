import React, { useState } from 'react'
import { Input, Button, Select, DatePicker } from 'antd'
import { transferList } from "./transfer.json"
import { Link, useParams } from 'react-router-dom'
import { Page } from '../../common'

export default function TransferList(): React.ReactNode {
    const [filterValue, setFilterValue] = useState<object>({})
    const params = useParams<{ id: string, status: string, materialLeader: string }>();
    const onFilterSubmit = (value: any) => {
        if (value.transferDateStart) {
            const formatDate = value.transferDateStart.map((item: any) => item.format("YYYY-MM-DD"))
            value.transferDateStart = formatDate[0] + ' 00:00:00';
            value.transferDateEnd = formatDate[1] + ' 23:59:59';
        }
        setFilterValue(value)
        return value
    }
    return (
        <Page
            path={`/tower-hr/employeeTransfer`}
            columns={[
                {
                    "title": "序号",
                    "dataIndex": "index",
                    "width": 50,
                    render: (_: any, _b: object, index: number) => <>{index + 1}</>
                },
                ...transferList,
                {
                    "title": "操作",
                    "fixed": "right",
                    "width": 230,
                    "dataIndex": "operation",
                    render: (_: undefined, record: any): React.ReactNode => (
                        <>
                            <Button type="link" className='btn-operation-link' size="small"><Link to={`/employeeRelation/transfer/detail/${record.id}`}>查看</Link></Button>
                            <Button disabled={[2, 3].includes(record.status)} type="link" className='btn-operation-link' size="small"><Link to={`/employeeRelation/transfer/edit/${record.id}`}>编辑</Link></Button>
                        </>
                    )
                }]}
            onFilterSubmit={onFilterSubmit}
            filterValue={filterValue}
            requestData={{ productCategory: params.id }}
            extraOperation={
                <Button type="primary" ghost><Link to={`/employeeRelation/transfer/new`}>新增员工调动</Link></Button>
            }
            searchFormItems={[
                {
                    name: 'employeeName',
                    label: '',
                    children: <Input placeholder="请输入员工姓名" maxLength={200} />
                },
                {
                    name: 'transferType',
                    label: '调派类型',
                    children: <Select placeholder="请选择" style={{ width: "150px" }}>
                        <Select.Option value={''} key="">全部</Select.Option>
                        <Select.Option value={1} key="1">晋升</Select.Option>
                        <Select.Option value={2} key="2">调动</Select.Option>
                        <Select.Option value={3} key="3">借调</Select.Option>
                        <Select.Option value={4} key="4">外派</Select.Option>
                        <Select.Option value={5} key="5">工商调动</Select.Option>
                    </Select>
                },
                {
                    name: 'transferDateStart',
                    label: '调动日期',
                    children: <DatePicker.RangePicker format="YYYY-MM-DD" />
                },
            ]}
        />
    )
}