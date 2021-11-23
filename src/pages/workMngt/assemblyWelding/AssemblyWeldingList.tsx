/**
 * @author zyc
 * @copyright © 2021 
 * @description 工作管理-组焊列表
 */

import React, { useState } from 'react';
import { Space, Input, DatePicker, Select, Button, Popconfirm, Form } from 'antd';
import { Page } from '../../common';
import { FixedType } from 'rc-table/lib/interface';
import styles from './AssemblyWelding.module.less';
import { Link, useLocation } from 'react-router-dom';
import RequestUtil from '../../../utils/RequestUtil';
import AuthUtil from '../../../utils/AuthUtil';

enum PriorityType {
    HIGH = '1',              
    MIDDLE ='2',         
    LOW = '3',                       
}

export default function AssemblyWeldingList(): React.ReactNode {
    const columns = [
        {
            key: 'index',
            title: '序号',
            dataIndex: 'index',
            width: 50,
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (<span>{ index + 1 }</span>)
        },
        {
            key: 'taskNum',
            title: '放样任务编号',
            width: 150,
            dataIndex: 'taskNum'
        },
        {
            key: 'priority',
            title: '优先级',
            width: 150,
            dataIndex: 'priority',
            render: (priority: string): React.ReactNode => {
                switch (priority) {
                    case PriorityType.HIGH:
                        return '高';
                    case PriorityType.LOW:
                        return '低';
                    case PriorityType.MIDDLE:
                        return '中';
                }
            }         
        },
        {
            key: 'taskNumber',
            title: '任务单编号',
            width: 150,
            dataIndex: 'taskNumber'
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
            key: 'productType',
            title: '塔型',
            width: 200,
            dataIndex: 'productType'
        },
        {
            key: 'plannedDeliveryTime',
            title: '计划交付时间',
            dataIndex: 'plannedDeliveryTime',
            width: 200,
        },
        {
            key: 'weldingLeaderName',
            title: '组焊负责人',
            width: 200,
            dataIndex: 'weldingLeaderName'
        },
        {
            key: 'status',
            title: '组焊清单状态',
            width: 200,
            dataIndex: 'status',
            render: (status: number): React.ReactNode => {
                switch (status) {
                    case 0:
                        return '已拒绝';
                    case 1:
                        return '待开始';
                    case 2:
                        return '组焊中';
                    case 4:
                        return '已完成';
                }
            }    
        },
        {
            key: 'updateStatusTime',
            title: '最新状态变更时间',
            width: 200,
            dataIndex: 'updateStatusTime'
        },
        {
            key: 'operation',
            title: '操作',
            dataIndex: 'operation',
            fixed: 'right' as FixedType,
            width: 200,
            render: (_: undefined, record: Record<string, any>): React.ReactNode => (
                <Space direction="horizontal" size="small" className={ styles.operationBtn }>
                    <Link to={ `/workMngt/assemblyWeldingList/assemblyWeldingInformation/${ record.id }` }>组焊信息</Link>
                    {
                        record.weldingLeader === userId ? <Link to={ { pathname: `/workMngt/assemblyWeldingList/assemblyWeldingListing/${ record.id }/${ record.productCategoryId }`, state: { status: record.status } } }>组焊清单</Link> : <Button type="link" disabled>组焊清单</Button>
                    } 
                </Space>
            )
        }
    ]

    const [ refresh, setRefresh ] = useState(false);
    const location = useLocation<{ state: {} }>();
    const userId = AuthUtil.getUserId();
    return <Page
        path="/tower-science/welding"
        columns={ columns }
        headTabs={ [] }
        refresh={ refresh }
        requestData={ { status: location.state } }
        // extraOperation={ <Button type="primary" ghost>导出</Button> }
        searchFormItems={ [
            {
                name: 'updateTime',
                label: '最新状态变更时间',
                children: <DatePicker.RangePicker />
            },
            {
                name: 'status',
                label: '组焊清单状态',
                children: <Form.Item name="status" initialValue={ location.state }>
                    <Select style={{ width: '120px' }} placeholder="请选择">
                        <Select.Option value="" key="6">全部</Select.Option>
                        <Select.Option value={1} key="1">待开始</Select.Option>
                        <Select.Option value={2} key="2">组焊中</Select.Option>
                        <Select.Option value={4} key="4">已完成</Select.Option>
                    </Select>
                </Form.Item>
            },
            {
                name: 'plannedTime',
                label: '计划交付时间',
                children: <DatePicker.RangePicker />
            },
            {
                name: 'priority',
                label: '优先级',
                children: <Select style={{ width: '120px' }} placeholder="请选择">
                    <Select.Option value="" key="0">全部</Select.Option>
                    <Select.Option value="1" key="1">高</Select.Option>
                    <Select.Option value="2" key="2">中</Select.Option>
                    <Select.Option value="3" key="3">低</Select.Option>
                </Select>
            },
            {
                name: 'fuzzyMsg',
                label: '模糊查询项',
                children: <Input placeholder="放样任务编号/任务单编号/订单编号/内部合同编号/塔型"/>
            }
        ] }
        onFilterSubmit = { (values: Record<string, any>) => {
            if(values.updateTime) {
                const formatDate = values.updateTime.map((item: any) => item.format("YYYY-MM-DD"));
                values.updateStatusTimeStart = formatDate[0] + ' 00:00:00';
                values.updateStatusTimeEnd = formatDate[1] + ' 23:59:59';
            }
            if(values.plannedTime) {
                const formatDate = values.plannedTime.map((item: any) => item.format("YYYY-MM-DD"));
                values.plannedDeliveryTimeStart = formatDate[0] + ' 00:00:00';;
                values.plannedDeliveryTimeEnd = formatDate[1] + ' 23:59:59';;
            }
            return values;
        } }
    />
}