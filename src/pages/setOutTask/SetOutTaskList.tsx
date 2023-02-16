import React, { useState } from 'react';
import { Space, Input, DatePicker, Select, Button, Form, Modal, message } from 'antd';
import { Page, SearchTable } from '../common';
import { FixedType } from 'rc-table/lib/interface';
import styles from './SetOutTask.module.less';
import { Link, useLocation } from 'react-router-dom';
import Deliverables from './Deliverables';
import RequestUtil from '../../utils/RequestUtil';

export default function SetOutTaskList(): React.ReactNode {
    const [refresh, setRefresh] = useState<boolean>(false);
    const [filterValue, setFilterValue] = useState({});
    const location = useLocation<{ state?: number }>();

    const columns = [
        {
            key: 'index',
            title: '序号',
            dataIndex: 'index',
            width: 50,
            fixed: 'left' as FixedType,
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (<span>{index + 1}</span>)
        },
        {
            key: 'planNumber',
            title: '计划号',
            width: 200,
            dataIndex: 'planNumber'
        },
        {
            key: 'projectName',
            title: '工程名称',
            width: 200,
            dataIndex: 'projectName'
        },
        {
            key: 'productCategoryName',
            title: '塔型',
            width: 200,
            dataIndex: 'productCategoryName'
        },
        {
            key: 'productCategoryProportion',
            title: '塔型完成进度',
            width: 150,
            dataIndex: 'productCategoryProportion',
            // render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
            //     <Link to={`/taskMngt/setOutTaskList/setOutTaskTower/${record.id}`}>{_}</Link>
            // )
        },
        {
            key: 'productProportion',
            title: '杆塔完成进度',
            dataIndex: 'productProportion',
            width: 200,
            // render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
            //     <Link to={`/taskMngt/setOutTaskList/setOutTaskPole/${record.id}`}>{_}</Link>
            // )
        },
        {
            key: 'weight',
            title: '重量（吨）',
            width: 200,
            dataIndex: 'weight'
        },
        {
            key: 'statusName',
            title: '任务状态',
            dataIndex: 'statusName',
            width: 120
        },
        {
            key: 'updateStatusTime',
            title: '时间',
            width: 200,
            dataIndex: 'updateStatusTime'
        },
        {
            key: 'plannedDeliveryTime',
            title: '计划交付时间',
            width: 200,
            dataIndex: 'plannedDeliveryTime',
            "type": "date",
            "format": "YYYY-MM-DD"
        },
        {
            key: 'taskNum',
            title: '放样任务编号',
            width: 150,
            dataIndex: 'taskNum'
        },
        {
            key: 'saleOrderNumber',
            title: '订单编号',
            width: 200,
            dataIndex: 'saleOrderNumber'
        },
        {
            key: 'internalNumber',
            title: '内部合同编号',
            width: 200,
            dataIndex: 'internalNumber'
        },
        {
            key: 'operation',
            title: '操作',
            dataIndex: 'operation',
            fixed: 'right' as FixedType,
            width: 200,
            render: (_: undefined, record: Record<string, any>): React.ReactNode => (
                <Space direction="horizontal" size="small">
                    <Link to={`/taskMngt/setOutTaskList/setOutTaskDetail/${record.id}`}>任务详情</Link>
                    {
                        record.status === 3 || record.status === 4 || record.status === 5 ?
                            <Deliverables id={record.id} />
                            :
                            <Button type="link" disabled>交付物</Button>
                    }

                    {
                        record.status === 4 ?
                            <Button type="link" onClick={() => {
                                Modal.confirm({
                                    title: "确认提交?",
                                    onOk: async () => new Promise(async (resove, reject) => {
                                        try {
                                            RequestUtil.post(`/tower-science/loftingTask/submit`, { id: record.id }).then(res => {
                                                message.success("提交成功");
                                                setRefresh(!refresh);
                                            });
                                            resove(true)
                                        } catch (error) {
                                            reject(error)
                                        }
                                    })
                                })
                            }}>提交任务</Button>
                            :
                            <Button type="link" disabled>提交任务</Button>
                    }
                </Space>
            )
        }
    ]

    return <SearchTable
        path="/tower-science/loftingTask/taskPage"
        columns={columns as any}
        headTabs={[]}
        requestData={{ status: location.state?.state }}
        exportPath={`/tower-science/loftingTask/taskPage`}
        refresh={refresh}
        searchFormItems={[
            {
                name: 'updateStatusTime',
                label: '最新状态变更时间',
                children: <DatePicker.RangePicker />
            },
            {
                name: 'status',
                label: '任务状态',
                children: <Form.Item name="status" initialValue={location.state?.state}>
                    <Select style={{ width: '120px' }} placeholder="请选择">
                        <Select.Option value={""} key="6">全部</Select.Option>
                        <Select.Option value={0} key="0">已拒绝</Select.Option>
                        <Select.Option value={2} key="2">待指派</Select.Option>
                        <Select.Option value={3} key="3">待完成</Select.Option>
                        <Select.Option value={4} key="4">已完成</Select.Option>
                        <Select.Option value={5} key="5">已提交</Select.Option>
                    </Select>
                </Form.Item>
            },
            {
                name: 'productCategoryName',
                label: '塔型名称',
                children: <Input placeholder="请输入" />
            },
            {
                name: 'fuzzyMsg',
                label: '模糊查询项',
                children: <Input style={{ width: '300px' }} placeholder="放样任务编号/计划号/订单编号/内部合同编号" />
            }
        ]}
        filterValue={filterValue}
        onFilterSubmit={(values: any) => {
            if (values.updateStatusTime) {
                const formatDate = values.updateStatusTime.map((item: any) => item.format("YYYY-MM-DD"));
                values.updateStatusTimeStart = formatDate[0] + ' 00:00:00';
                values.updateStatusTimeEnd = formatDate[1] + ' 23:59:59';
            }
            setFilterValue(values);
            return values;
        }}
    />
}