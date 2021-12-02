/**
 * @author zyc
 * @copyright © 2021 
 * @description 工作管理-螺栓列表
 */

import React from 'react';
import { Space, Input, DatePicker, Select, Button, Form } from 'antd';
import { Page } from '../../common';
import { FixedType } from 'rc-table/lib/interface';
import styles from './BoltList.module.less';
import { Link, useLocation } from 'react-router-dom';
import AuthUtil from '../../../utils/AuthUtil';
import RequestUtil from '../../../utils/RequestUtil';
import useRequest from '@ahooksjs/use-request';

enum PriorityType {
    EMERGENCY = 0,
    HIGH = 1,
    MIDDLE = 2,
    LOW = 3,
}

export default function BoltList(): React.ReactNode {
    const columns = [
        {
            key: 'index',
            title: '序号',
            dataIndex: 'index',
            width: 50,
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (<span>{index + 1}</span>)
        },
        {
            key: 'taskNum',
            title: '放样任务编号',
            width: 150,
            dataIndex: 'taskNum'
        },
        {
            key: 'priorityName',
            title: '优先级',
            width: 150,
            dataIndex: 'priorityName',
        },
        {
            key: 'externalTaskNum',
            title: '任务单编号',
            width: 150,
            dataIndex: 'externalTaskNum'
        },
        {
            key: 'saleOrderNumber',
            title: '订单编号',
            width: 150,
            dataIndex: 'saleOrderNumber'
        },
        {
            key: 'internalNumber',
            title: '内部合同编号',
            dataIndex: 'internalNumber',
            width: 120
        },
        {
            key: 'productCategoryName',
            title: '塔型',
            width: 200,
            dataIndex: 'productCategoryName'
        },
        {
            key: 'steelProductShape',
            title: '塔型钢印号',
            width: 200,
            dataIndex: 'steelProductShape'
        },
        {
            key: 'boltDeliverTime',
            title: '计划交付时间',
            dataIndex: 'boltDeliverTime',
            width: 200,
        },
        {
            key: 'boltLeaderName',
            title: '螺栓负责人',
            width: 200,
            dataIndex: 'boltLeaderName'
        },
        {
            key: 'boltStatus',
            title: '螺栓清单状态',
            width: 200,
            dataIndex: 'boltStatusName',
        },
        {
            key: 'boltUpdateStatusTime',
            title: '最新状态变更时间',
            width: 200,
            dataIndex: 'boltUpdateStatusTime'
        },
        {
            key: 'operation',
            title: '操作',
            dataIndex: 'operation',
            fixed: 'right' as FixedType,
            width: 200,
            render: (_: undefined, record: Record<string, any>): React.ReactNode => (
                <Space direction="horizontal" size="small" className={styles.operationBtn}>
                    {
                        record.boltLeader === userId ? <Link to={`/workMngt/boltList/boltListing/${record.id}/${record.boltLeader}/${record.boltStatus}`}>螺栓清单</Link> : <Button type="link" disabled>螺栓清单</Button>
                    }
                    {
                        record.boltStatus === 3 && record.loftingLeader === userId ? <Link to={`/workMngt/boltList/boltCheck/${record.id}`}>校核</Link> : <Button type="link" disabled>校核</Button>
                    }
                </Space>
            )
        }
    ]

    const location = useLocation<{ state: {} }>();
    const userId = AuthUtil.getUserId();
    const { loading, data } = useRequest(() => new Promise(async (resole, reject) => {
        const data:any = await RequestUtil.get(`/sinzetech-user/user?size=1000`);
        resole(data?.records);
    }), {})
    const checkUser: any = data || [];

    return <Page
        path="/tower-science/boltRecord"
        columns={columns}
        headTabs={[]}
        exportPath={`/tower-science/boltRecord`}
        requestData={{ boltStatus: location.state }}
        searchFormItems={[
            {
                name: 'updateTime',
                label: '最新状态变更时间',
                children: <DatePicker.RangePicker />
            },
            {
                name: 'boltStatus',
                label: '螺栓清单状态',
                children: <Form.Item name="boltStatus" initialValue={location.state}>
                    <Select style={{ width: '120px' }} placeholder="请选择">
                        <Select.Option value="" key="6">全部</Select.Option>
                        <Select.Option value="1" key="1">待开始</Select.Option>
                        <Select.Option value="2" key="2">进行中</Select.Option>
                        <Select.Option value="3" key="3">校核中</Select.Option>
                        <Select.Option value="4" key="4">已完成</Select.Option>
                    </Select>
                </Form.Item>
            },
            {
                name: 'boltLeader',
                label: '螺栓负责人',
                children: <Select placeholder="请选择" style={{ width: "150px" }}>
                    { checkUser && checkUser.map((item: any) => {
                        return <Select.Option key={ item.id } value={ item.id }>{ item.name }</Select.Option>
                    }) }
                </Select>
            },
            {
                name: 'priority',
                label: '优先级',
                children: <Select style={{ width: '120px' }} placeholder="请选择">
                    <Select.Option value="" key="">全部</Select.Option>
                    <Select.Option value="" key="0">紧急</Select.Option>
                    <Select.Option value="1" key="1">高</Select.Option>
                    <Select.Option value="2" key="2">中</Select.Option>
                    <Select.Option value="3" key="3">低</Select.Option>
                </Select>
            },
            {
                name: 'fuzzyMsg',
                label: '模糊查询项',
                children: <Input placeholder="放样任务编号/任务单编号/订单编号/内部合同编号/塔型/塔型钢印号" />
            }
        ]}
        onFilterSubmit={(values: Record<string, any>) => {
            if (values.updateTime) {
                const formatDate = values.updateTime.map((item: any) => item.format("YYYY-MM-DD"));
                values.updateStatusTimeStart = formatDate[0] + ' 00:00:00';
                values.updateStatusTimeEnd = formatDate[1] + ' 23:59:59';
            }
            return values;
        }}
    />
}