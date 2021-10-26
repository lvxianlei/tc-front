import React, { useState } from 'react'
import { Input, DatePicker, Select, Button, Form } from 'antd'
import { useHistory } from 'react-router-dom'
import { Page } from '../../common';

export default function EnquiryList(): React.ReactNode {
    // const [user, setUser] = useState<any[] | undefined>([]);
    const [refresh, setRefresh] = useState<boolean>(false);
    const [confirmLeader, setConfirmLeader] = useState<any | undefined>([]);
    // const [department, setDepartment] = useState<any | undefined>([]);
    // const [assignVisible, setVisible] = useState<boolean>(false);
    const [filterValue, setFilterValue] = useState({});
    // const [drawTaskId, setDrawTaskId] = useState<string>('');
    // const [form] = Form.useForm();
    // const history = useHistory();
    const columns = [
        {
            key: 'index',
            title: '序号',
            dataIndex: 'index',
            width: 50,
            render: (_a: any, _b: any, index: number): React.ReactNode => (<span>{index + 1}</span>)
        },
        {
            key: 'rawMaterialTaskNum',
            title: '原材料任务编号',
            width: 100,
            dataIndex: 'rawMaterialTaskNum'
        },
        {
            key: 'insideContractNum',
            title: '内部合同编号',
            width: 100,
            dataIndex: 'insideContractNum',
        },
        {
            key: 'towerModel',
            title: '塔型(个)',
            width: 200,
            dataIndex: 'towerModel'
        },
        {
            key: 'poleTower',
            title: '杆塔(基)',
            width: 200,
            dataIndex: 'poleTower'
        },
        {
            key: 'burdeningLeader',
            title: '配料负责人',
            width: 100,
            dataIndex: 'burdeningLeader'
        },
        {
            key: 'burdeningState',
            title: '配料状态',
            width: 100,
            dataIndex: 'burdeningState'
        },
        {
            key: 'updateStatusTime',
            title: '最新状态变更时间',
            width: 100,
            dataIndex: 'updateStatusTime'
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
                    label: '配料状态',
                    children: <Select style={{ width: "100px" }} defaultValue="请选择">
                        <Select.Option value={1} key={1}>待接收</Select.Option>
                        <Select.Option value={3} key={3}>待完成</Select.Option>
                        <Select.Option value={4} key={4}>已完成</Select.Option>
                    </Select>
                },
                {
                    name: 'confirmId',
                    label: '配料人',
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
                    children: <Input placeholder="任务编号/任务单编号/订单编号/内部合同编号" maxLength={200} />
                },
            ]}
        />
    </>
}
