/**
 * @author zyc
 * @copyright © 2021 
 * @description 工作管理-组焊列表
 */

import React, { useState } from 'react';
import { Space, Input, DatePicker, Select, Button, Form } from 'antd';
import { Page } from '../../common';
import { FixedType } from 'rc-table/lib/interface';
import styles from './AssemblyWelding.module.less';
import { Link, useLocation } from 'react-router-dom';
import AuthUtil from '../../../utils/AuthUtil';
import useRequest from '@ahooksjs/use-request';
import RequestUtil from '../../../utils/RequestUtil';

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
            key: 'priorityName',
            title: '优先级',
            width: 150,
            dataIndex: 'priorityName'       
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
            key: 'statusName',
            title: '组焊清单状态',
            width: 200,
            dataIndex: 'statusName'
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
    const location = useLocation<{ state?: number, userId?: string }>();
    const userId = AuthUtil.getUserId();
    const [ filterValue, setFilterValue ] = useState<Record<string, any>>();
    const { loading, data } = useRequest(() => new Promise(async (resole, reject) => {
        const data:any = await RequestUtil.get(`/sinzetech-user/user?size=1000`);
        resole(data?.records);
    }), {})
    const checkUser: any = data || [];

    return <Page
        path="/tower-science/welding"
        exportPath={`/tower-science/welding`}
        columns={ columns }
        headTabs={ [] }
        refresh={ refresh }
        requestData={ { status: location.state?.state, weldingLeader: location.state?.userId } }
        filterValue={filterValue}
        searchFormItems={ [
            {
                name: 'updateTime',
                label: '最新状态变更时间',
                children: <DatePicker.RangePicker />
            },
            {
                name: 'status',
                label: '组焊清单状态',
                children: <Form.Item name="status" initialValue={ location.state?.state }>
                    <Select style={{ width: '120px' }} placeholder="请选择">
                        <Select.Option value="" key="6">全部</Select.Option>
                        <Select.Option value={1} key="1">待开始</Select.Option>
                        <Select.Option value={2} key="2">组焊中</Select.Option>
                        <Select.Option value={3} key="3">已完成</Select.Option>
                    </Select>
                </Form.Item>
            },
            {
                name: 'weldingLeader',
                label: '组焊负责人',
                children: <Form.Item name="weldingLeader" initialValue={location.state?.userId || ""}>
                    <Select placeholder="请选择" style={{ width: "150px" }}>  
                        <Select.Option value="" key="6">全部</Select.Option>
                        { checkUser && checkUser.map((item: any) => {
                            return <Select.Option key={ item.id } value={ item.id }>{ item.name }</Select.Option>
                        }) }
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
                    <Select.Option value="" key="4">全部</Select.Option>
                    <Select.Option value="0" key="0">紧急</Select.Option>
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
            setFilterValue(values);
            return values;
        } }
    />
}