import React, { useState } from 'react';
import { Space, Input, DatePicker, Select, Button, Popconfirm } from 'antd';
import { Page } from '../common';
import { FixedType } from 'rc-table/lib/interface';
import styles from './SetOutTask.module.less';
import { Link } from 'react-router-dom';
import Deliverables from './Deliverables';
import RequestUtil from '../../utils/RequestUtil';

export default function SetOutTaskList(): React.ReactNode {
    const [ refresh, setRefresh ] = useState<boolean>(false);
    const [ filterValue, setFilterValue ] = useState({});
    
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
            key: 'status',
            title: '任务状态',
            dataIndex: 'status',
            width: 120,
            render: (status: number): React.ReactNode => {
                switch (status) {
                    case 0:
                        return '已拒绝';
                    case 1:
                        return '待确认';
                    case 2:
                        return '待指派';
                    case 3:
                        return '待完成';
                    case 4:
                        return '已完成';
                    case 5:
                        return '已提交';
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
            key: 'productCategory',
            title: '塔型完成进度',
            width: 150,
            dataIndex: 'productCategory',
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Link to={ `/setOutTask/setOutTaskTower/${ record.id }` }>{ record.productCategoryEndNum + '/' + record.productCategoryNum }</Link>
            )
        },
        {
            key: 'product',
            title: '杆塔完成进度',
            dataIndex: 'product',
            width: 200,
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Link to={ `/setOutTask/setOutTaskPole/${ record.id }` }>{ record.productEndNum + '/' + record.productNum }</Link>
            )
        },
        {
            key: 'weight',
            title: '重量（吨）',
            width: 200,
            dataIndex: 'weight'
        },
        {
            key: 'externalTaskNum',
            title: '任务单编号',
            width: 200,
            dataIndex: 'externalTaskNum'
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
            key: 'plannedDeliveryTime',
            title: '计划交付时间',
            width: 200,
            dataIndex: 'plannedDeliveryTime'
        },
        {
            key: 'operation',
            title: '操作',
            dataIndex: 'operation',
            fixed: 'right' as FixedType,
            width: 200,
            render: (_: undefined, record: Record<string, any>): React.ReactNode => (
                <Space direction="horizontal" size="small" className={ styles.operationBtn }>
                    <Link to={ `/setOutTask/setOutTaskDetail/${ record.id }` }>任务详情</Link>
                    {
                        record.status === 4 ? 
                        <>
                            <Deliverables id={ record.id }/>
                            <Popconfirm
                                title="确认提交?"
                                onConfirm={ () => {
                                    RequestUtil.post(`/tower-science/loftingTask/submit`, { id: record.id }).then(res => {
                                        setRefresh(!refresh);
                                    });
                                } }
                                okText="提交"
                                cancelText="取消"
                            >
                                <Button type="link">提交任务</Button>
                            </Popconfirm>
                        </>
                        : 
                        <>
                            <Button type="link" disabled>交付物</Button>
                            <Button type="link" disabled>提交任务</Button>
                        </>
                    }
                    
                </Space>
            )
        }
    ]

    return <Page
        path="/tower-science/loftingTask/taskPage"
        columns={ columns }
        headTabs={ [] }
        // extraOperation={ <Button type="primary" ghost>导出</Button> }
        refresh={ refresh }
        searchFormItems={ [
            {
                name: 'updateStatusTime',
                label: '最新状态变更时间',
                children: <DatePicker.RangePicker />
            },
            {
                name: 'status',
                label: '任务状态',
                children: <Select style={{ width: '120px' }} placeholder="请选择">
                    <Select.Option value={ "" } key="6">全部</Select.Option>
                    <Select.Option value={ 0 } key="0">已拒绝</Select.Option>
                    <Select.Option value={ 1 } key="1">待确认</Select.Option>
                    <Select.Option value={ 2 } key="2">待指派</Select.Option>
                    <Select.Option value={ 3 } key="3">待完成</Select.Option>
                    <Select.Option value={ 4 } key="4">已完成</Select.Option>
                    <Select.Option value={ 5 } key="5">已提交</Select.Option>
                </Select>
            },
            {
                name: 'plannedDeliveryTime',
                label: '计划交付时间',
                children: <DatePicker.RangePicker />
            },
            {
                name: 'fuzzyMsg',
                label: '模糊查询项',
                children: <Input placeholder="放样任务编号/任务单编号/订单编号/内部合同编号"/>
            }
        ] }
        filterValue={ filterValue }
        onFilterSubmit = { (values: Record<string, any>) => {
            if(values.updateStatusTime) {
                const formatDate = values.updateStatusTime.map((item: any) => item.format("YYYY-MM-DD"));
                values.updateStatusTimeStart = formatDate[0] + ' 00:00:00';
                values.updateStatusTimeEnd = formatDate[1] + ' 23:59:59';
            }
            if(values.plannedDeliveryTime) {
                const formatDate = values.plannedDeliveryTime.map((item: any) => item.format("YYYY-MM-DD"));
                values.plannedDeliveryTimeStart = formatDate[0] + ' 00:00:00';
                values.plannedDeliveryTimeEnd = formatDate[1] + ' 23:59:59';
            }
            setFilterValue(values);
            return values;
        } }
    />
}