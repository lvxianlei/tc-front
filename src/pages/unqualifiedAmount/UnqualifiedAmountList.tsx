import React, { useState } from 'react'
import { Space, Input, DatePicker, Button, Select, Form, Popconfirm } from 'antd'
import { useHistory, useLocation } from 'react-router-dom'
import { FixedType } from 'rc-table/lib/interface';
import { Page } from '../common'
import { TreeNode } from 'antd/lib/tree-select';
import useRequest from '@ahooksjs/use-request';
import RequestUtil from '../../utils/RequestUtil';
import { DataNode as SelectDataNode } from 'rc-tree-select/es/interface';
import AuthUtil from '../../utils/AuthUtil';

export default function UnqualifiedAmountList(): React.ReactNode {
    const [filterValue, setFilterValue] = useState({});
    const [refresh, setRefresh] = useState<boolean>(false);
    const location = useLocation<{ state?: number, userId?: string }>();
    const history = useHistory();
    const { loading, data } = useRequest<any>(() => new Promise(async (resole, reject) => {
        const data: any = await RequestUtil.get(`/tower-system/employee?size=1000`);
        resole(data)
    }), {})
    const confirmLeader: any = data?.records || [];
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
            title: '生产环节',
            width: 100,
            dataIndex: 'taskNum'
        },
        {
            key: 'contractName',
            title: '生产单元',
            width: 100,
            dataIndex: 'contractName'
        },
        {
            key: 'plannedDeliveryTime',
            title: '不合格项目',
            width: 200,
            dataIndex: 'plannedDeliveryTime'
        },
        {
            key: 'confirmName',
            title: '责任工序',
            width: 200,
            dataIndex: 'confirmName'
        },
        {
            key: 'statusName',
            title: '处理类型',
            width: 200,
            dataIndex: 'statusName'
        },
        {
            key: 'updateStatusTime',
            title: '罚款类别（元）',
            width: 200,
            dataIndex: 'updateStatusTime'
        },
        {
            key: 'updateStatusTime',
            title: '说明',
            width: 200,
            dataIndex: 'updateStatusTime'
        },
        {
            key: 'updateStatusTime',
            title: '制单人',
            width: 200,
            dataIndex: 'updateStatusTime'
        },
        {
            key: 'updateStatusTime',
            title: '是否有效',
            width: 200,
            dataIndex: 'updateStatusTime'
        },
        {
            key: 'operation',
            title: '操作',
            fixed: 'right' as FixedType,
            width: 100,
            dataIndex: 'operation',
            render: (_: undefined, record: any): React.ReactNode => (
                <Space direction="horizontal" size="small">
                    <Button type='link' onClick={() => { 
                        history.push(`/workMngt/confirmList/confirmMessage/${record.id}`) 
                    }} disabled={AuthUtil.getUserId() !== record.confirmId}>编辑</Button>
                    <Popconfirm
                        title="确认删除?"
                        onConfirm={() => {
                            RequestUtil.delete(`/tower-system/notice?ids=${record.id}`).then(res => {
                                setRefresh(!refresh);
                            });
                        }}
                        okText="确认"
                        cancelText="取消"
                        disabled={record.state === 1}
                    >
                        <Button type="link" disabled={record.state === 1}>删除</Button>
                    </Popconfirm>
                </Space>
            )
        }
    ];
    const onFilterSubmit = (value: any) => {
        setFilterValue(value)
        return value
    }
    return (
        <Page
            path="/tower-science/drawProductDetail"
            columns={columns}
            filterValue={filterValue}
            exportPath="/tower-science/drawProductDetail"
            refresh={refresh}
            // extraOperation={<Button type="primary">导出</Button>}
            onFilterSubmit={onFilterSubmit}
            searchFormItems={[
                {
                    name: 'status',
                    label: '车间',
                    children: <Form.Item name="status" initialValue={location.state?.state}>
                        <Select style={{ width: "100px" }}>
                            <Select.Option value={''} key={''}>全部</Select.Option>
                            <Select.Option value={3} key={3}>待完成</Select.Option>
                            <Select.Option value={4} key={4}>已完成</Select.Option>
                        </Select>
                    </Form.Item>
                },
                {
                    name: 'status',
                    label: '生产环节',
                    children: <Form.Item name="status" initialValue={location.state?.state}>
                        <Select style={{ width: "100px" }}>
                            <Select.Option value={''} key={''}>全部</Select.Option>
                            <Select.Option value={3} key={3}>待完成</Select.Option>
                            <Select.Option value={4} key={4}>已完成</Select.Option>
                        </Select>
                    </Form.Item>
                },
                {
                    name: 'status',
                    label: '不合格项目',
                    children: <Form.Item name="status" initialValue={location.state?.state}>
                        <Select style={{ width: "100px" }}>
                            <Select.Option value={''} key={''}>全部</Select.Option>
                            <Select.Option value={3} key={3}>待完成</Select.Option>
                            <Select.Option value={4} key={4}>已完成</Select.Option>
                        </Select>
                    </Form.Item>
                },
                {
                    name: 'status',
                    label: '责任工序',
                    children: <Form.Item name="status" initialValue={location.state?.state}>
                        <Select style={{ width: "100px" }}>
                            <Select.Option value={''} key={''}>全部</Select.Option>
                            <Select.Option value={3} key={3}>待完成</Select.Option>
                            <Select.Option value={4} key={4}>已完成</Select.Option>
                        </Select>
                    </Form.Item>
                },
                {
                    name: 'status',
                    label: '处理类型',
                    children: <Form.Item name="status" initialValue={location.state?.state}>
                        <Select style={{ width: "100px" }}>
                            <Select.Option value={''} key={''}>全部</Select.Option>
                            <Select.Option value={3} key={3}>待完成</Select.Option>
                            <Select.Option value={4} key={4}>已完成</Select.Option>
                        </Select>
                    </Form.Item>
                }
            ]}
        />
    )
}