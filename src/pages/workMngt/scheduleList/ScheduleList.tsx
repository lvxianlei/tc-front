import React, { useState } from 'react'
import { Space, Input, DatePicker, Select, Form } from 'antd'
import { Link, useLocation } from 'react-router-dom'
import { Page } from '../../common'
import { FixedType } from 'rc-table/lib/interface';

export default function ScheduleList(): React.ReactNode {
    const [filterValue, setFilterValue] = useState({});
    const location = useLocation<{ state?: number }>();
    const columns = [
        {
            key: 'index',
            title: '序号',
            dataIndex: 'index',
            width: 50,
            render: (_a: any, _b: any, index: number): React.ReactNode => (<span>{index + 1}</span>)
        },
        {
            key: 'taskNum',
            title: '放样任务编号',
            width: 100,
            dataIndex: 'taskNum'
        },
        {
            key: 'planNumber',
            title: '计划号',
            width: 100,
            dataIndex: 'planNumber'
        },
        {
            key: 'saleOrderNumber',
            title: '订单编号',
            width: 100,
            dataIndex: 'saleOrderNumber'
        },
        {
            key: 'internalNumber',
            title: '内部合同编号',
            width: 100,
            dataIndex: 'internalNumber'
        },
        {
            key: 'plannedDeliveryTime',
            title: '计划交付时间',
            width: 200,
            dataIndex: 'plannedDeliveryTime'
        },
        {
            key: 'weight',
            title: '重量（吨）',
            width: 200,
            dataIndex: 'weight'
        },
        {
            key: 'productCategoryNum',
            title: '塔型（个）',
            width: 80,
            dataIndex: 'productCategoryNum'
        },
        {
            key: 'projectName',
            title: '工程名称',
            width: 150,
            dataIndex: 'projectName'
        },
        {
            key: 'productCategoryName',
            title: '塔型',
            width: 150,
            dataIndex: 'productCategoryName'
        },
        {
            key: 'productNum',
            title: '杆塔（基）',
            width: 80,
            dataIndex: 'productNum'
        },
        {
            key: 'statusName',
            title: '状态',
            dataIndex: 'statusName'
        },
        {
            key: 'updateStatusTime',
            title: '最新状态变更时间',
            dataIndex: 'updateStatusTime'
        },
        {
            key: 'operation',
            title: '操作',
            dataIndex: 'operation',
            fixed: 'right' as FixedType,
            render: (_: undefined, record: any): React.ReactNode => (
                <Space direction="horizontal" size="small">
                    <Link to={`/workMngt/scheduleList/scheduleView/${record.id}/${record.status}`}>查看</Link>
                </Space>
            )
        }
    ]


    const onFilterSubmit = (value: any) => {
        if (value.statusUpdateTime) {
            const formatDate = value.statusUpdateTime.map((item: any) => item.format("YYYY-MM-DD"))
            value.updateStatusTimeStart = formatDate[0] + ' 00:00:00';
            value.updateStatusTimeEnd = formatDate[1] + ' 23:59:59';
            delete value.statusUpdateTime
        }
        if (value.planTime) {
            const formatDate = value.planTime.map((item: any) => item.format("YYYY-MM-DD"))
            value.plannedDeliveryTimeStart = formatDate[0] + ' 00:00:00';
            value.plannedDeliveryTimeEnd = formatDate[1] + ' 23:59:59';
            delete value.planTime
        }
        setFilterValue(value)
        return value
    }

    return (
        <Page
            path="/tower-science/loftingTask"
            columns={columns}
            exportPath="/tower-science/loftingTask"
            onFilterSubmit={onFilterSubmit}
            filterValue={filterValue}
            requestData={{
                status: location.state?.state
            }}
            tableProps={{
                pagination: {
                    pageSize: 100
                }
            }}
            searchFormItems={[
                {
                    name: 'statusUpdateTime',
                    label: '最新状态变更时间',
                    children: <DatePicker.RangePicker format='YYYY-MM-DD' />
                },
                {
                    name: 'status',
                    label: '任务状态',
                    children: <Form.Item name="status" initialValue={location.state?.state || ''}>
                        <Select style={{ width: "100px" }}>
                            <Select.Option value={''} key={''}>全部</Select.Option>
                            <Select.Option value={2} key={2}>待指派</Select.Option>
                            <Select.Option value={3} key={3}>待完成</Select.Option>
                        </Select>
                    </Form.Item>
                },
                {
                    name: 'fuzzyMsg',
                    label: '模糊查询项',
                    children: <Input placeholder="放样任务编号/计划号/订单编号/内部合同编号/塔型"  style={{ width: "350px" }} />
                },
            ]}
        />
    )
}