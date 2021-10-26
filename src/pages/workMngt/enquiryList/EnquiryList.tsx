import React, { useState } from 'react'
import { Space, Input, DatePicker, Select, Button, Modal, Form, Popconfirm, Row, Col, TreeSelect, message } from 'antd'
import { useHistory } from 'react-router-dom'
import { Page } from '../../common';

export default function EnquiryList(): React.ReactNode {
    const [user, setUser] = useState<any[] | undefined>([]);
    const [refresh, setRefresh] = useState<boolean>(false);
    const [confirmLeader, setConfirmLeader] = useState<any | undefined>([]);
    const [department, setDepartment] = useState<any | undefined>([]);
    const [assignVisible, setVisible] = useState<boolean>(false);
    const [filterValue, setFilterValue] = useState({});
    const [drawTaskId, setDrawTaskId] = useState<string>('');
    const [form] = Form.useForm();
    const history = useHistory();
    const columns = [
        {
            key: 'index',
            title: '序号',
            dataIndex: 'index',
            width: 50,
            // render: (_a: any, _b: any, index: number): React.ReactNode => (<span>{index + 1}</span>)
        },
        {
            key: 'enquiryTaskNum',
            title: '询价任务编号',
            width: 100,
            dataIndex: 'enquiryTaskNum'
        },
        {
            key: 'projectName',
            title: '项目名称',
            width: 100,
            dataIndex: 'projectName',
        },
        {
            key: 'customerName',
            title: '客户名称',
            width: 200,
            dataIndex: 'customerName'
        },
        {
            key: 'projectLeader',
            title: '项目负责人',
            width: 200,
            dataIndex: 'projectLeader'
        },
        {
            key: 'bidCutTime',
            title: '投标截止时间',
            width: 100,
            dataIndex: 'bidCutTime'
        },
        {
            key: 'PlannedDeliveryTime',
            title: '计划交付时间',
            width: 100,
            dataIndex: 'PlannedDeliveryTime'
        },
        {
            key: 'taskState',
            title: '任务状态',
            // fixed: 'right' as FixedType,
            width: 250,
            dataIndex: 'taskState',
        },
        {
            key: 'updateStatusTime',
            title: '最新状态变更时间',
            width: 100,
            dataIndex: 'updateStatusTime'
        },
        {
            key: 'inquirer',
            title: '询价人',
            width: 100,
            dataIndex: 'inquirer'
        },
        {
            key: 'operation',
            title: '操作',
            width: 100,
            dataIndex: 'operation'
        }
    ]
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

    return <>
        <Page
            path="/tower-science/drawTask"
            columns={columns}
            refresh={refresh}
            extraOperation={<Button type="primary">导出</Button>}
            filterValue={filterValue}
            onFilterSubmit={onFilterSubmit}
            searchFormItems={[
                {
                    name: 'statusUpdateTime',
                    label: '最新状态变更时间',
                    children: <DatePicker.RangePicker format="YYYY-MM-DD" />
                },
                {
                    name: 'status',
                    label: '任务状态',
                    children: <Select style={{ width: "100px" }}>
                        <Select.Option value={''} key={''}>全部</Select.Option>
                        <Select.Option value={1} key={1}>待确认</Select.Option>
                        <Select.Option value={2} key={2}>待指派</Select.Option>
                        <Select.Option value={3} key={3}>待完成</Select.Option>
                        <Select.Option value={4} key={4}>已完成</Select.Option>
                        <Select.Option value={5} key={5}>已提交</Select.Option>
                        <Select.Option value={0} key={0}>已拒绝</Select.Option>
                    </Select>
                },
                {
                    name: 'statusUpdateTime',
                    label: '计划交付时间',
                    children: <DatePicker.RangePicker format="YYYY-MM-DD" />
                },
                {
                    name: 'confirmId',
                    label: '询价人',
                    children: <div>
                        <Select style={{ width: '100px' }} defaultValue="部门">
                            {confirmLeader && confirmLeader.map((item: any) => {
                                return <Select.Option key={item.id} value={item.id}>{item.name}</Select.Option>
                            })}
                        </Select>
                        <Select style={{ width: '100px' }} defaultValue="人员">
                            {confirmLeader && confirmLeader.map((item: any) => {
                                return <Select.Option key={item.id} value={item.id}>{item.name}</Select.Option>
                            })}
                        </Select>
                    </div>
                },
                {
                    name: 'fuzzyMsg',
                    label: '查询',
                    children: <Input placeholder="任务编号/项目名称/项目负责人/客户名称" maxLength={200} />
                },
            ]}
        />
    </>
}






