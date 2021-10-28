/**
 * @author zyc
 * @copyright © 2021 
 * @description 工作管理-螺栓列表
 */

import React, { useState } from 'react';
import { Space, Input, DatePicker, Select, Button, Popconfirm } from 'antd';
import { Page } from '../../common';
import { FixedType } from 'rc-table/lib/interface';
import styles from './BoltList.module.less';
import { Link, useLocation } from 'react-router-dom';
import RequestUtil from '../../../utils/RequestUtil';

enum PriorityType {
    HIGH = 1,              
    MIDDLE =2,         
    LOW = 3,                       
}

export default function BoltList(): React.ReactNode {
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
            render: (priority: number): React.ReactNode => {
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
            dataIndex: 'boltStatus',
            render: (status: number): React.ReactNode => {
                switch (status) {
                    case 0:
                        return '已拒绝';
                    case 1:
                        return '待开始';
                    case 2:
                        return '进行中';
                    case 3:
                        return '校核中';
                    case 4:
                        return '已完成';
                    case 5:
                        return '已提交';
                }
            }    
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
                <Space direction="horizontal" size="small" className={ styles.operationBtn }>
                    <Link to={ `/workMngt/boltList/boltInformation/${ record.loftingTask }/${ record.id }` }>螺栓信息</Link>
                    {
                        record.boltStatus === 2 ? <Link to={ `/workMngt/boltList/boltListing/${ record.id }` }>螺栓清单</Link> : <Button type="link" disabled>螺栓清单</Button>
                    }
                    {
                        record.boltStatus === 3 ? <Link to={ `/workMngt/boltList/boltCheck/${ record.id }` }>校核</Link> : <Button type="link" disabled>校核</Button>
                    }
                    {
                        record.boltStatus === 4 ? 
                        <Popconfirm
                            title="确认提交?"
                            onConfirm={ () => RequestUtil.put(`/tower-science/boltRecord/submit?id=${ record.id }`).then(res => {
                                setRefresh(!refresh)
                            }) }
                            okText="提交"
                            cancelText="取消"
                        >
                            <Button type="link">提交任务</Button>
                        </Popconfirm> : <Button type="link" disabled>提交任务</Button>
                    }
                </Space>
            )
        }
    ]

    const [ refresh, setRefresh ] = useState(false);
    const location = useLocation<{ state: {} }>();
    return <Page
        path="/tower-science/boltRecord"
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
                name: 'boltStatus',
                label: '螺栓清单状态',
                children: <Select style={{ width: '120px' }} placeholder="请选择">
                    <Select.Option value="" key="6">全部</Select.Option>
                    <Select.Option value="1" key="1">待开始</Select.Option>
                    <Select.Option value="2" key="2">进行中</Select.Option>
                    <Select.Option value="3" key="3">校核中</Select.Option>
                    <Select.Option value="4" key="4">已完成</Select.Option>
                    <Select.Option value="5" key="5">已提交</Select.Option>
                </Select>
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
                children: <Input placeholder="放样任务编号/任务单编号/订单编号/内部合同编号/塔型/塔型钢印号"/>
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
                values.boltDeliverTimeStart = formatDate[0] + ' 00:00:00';
                values.boltDeliverTimeEnd = formatDate[1] + ' 23:59:59';
            }
            return values;
        } }
    />
}