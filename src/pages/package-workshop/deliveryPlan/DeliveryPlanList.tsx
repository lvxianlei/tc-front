import React, { useState } from 'react';
import { Space, Input, DatePicker, Select, Button } from 'antd';
import { Page } from '../../common';
import { FixedType } from 'rc-table/lib/interface';
import { Link, useHistory } from 'react-router-dom';

export default function DeliveryPlanList(): React.ReactNode {
    const [ refresh, setRefresh ] = useState<boolean>(false);
    const [ filterValue, setFilterValue ] = useState({});
    const history = useHistory();
    const columns = [
        {
            key: 'index',
            title: '序号',
            dataIndex: 'index',
            width: 50,
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (<span>{ index + 1 }</span>)
        },
        {
            key: 'taskCode',
            title: '出库任务编号',
            width: 150,
            dataIndex: 'taskCode'
        },
        {
            key: 'deliveryNoticeCode',
            title: '发货通知单编号',
            dataIndex: 'deliveryNoticeCode',
            width: 120
        },
        // {
        //     key: 'pattern',
        //     title: '类型',
        //     width: 200,
        //     dataIndex: 'pattern',
        //     render: (status: number): React.ReactNode => {
        //         switch (status) {
        //             case 1:
        //                 return '新放';
        //             case 2:
        //                 return '重新出卡';
        //             case 3:
        //                 return '套用';
        //         }
        //     }
        // },
        {
            key: 'shippingTime',
            title: '发运日期',
            width: 150,
            dataIndex: 'shippingTime'
        },
        {
            key: 'projectName',
            title: '工程名称',
            dataIndex: 'projectName',
            width: 200
        },
        {
            key: 'planNum',
            title: '计划号',
            width: 200,
            dataIndex: 'planNum'
        },
        {
            key: 'driver',
            title: '司机',
            width: 200,
            dataIndex: 'driver'
        },
        {
            key: 'carNum',
            title: '车牌号',
            width: 200,
            dataIndex: 'carNum',
        },
        {
            key: 'status',
            title: '出库状态',
            width: 200,
            dataIndex: 'status',
            render: (status: number): React.ReactNode => {
                switch (status) {
                    case -1:
                        return '-';
                    case 0:
                        return '未出库';
                    case 1:
                        return '部分出库';
                    case 2:
                        return '已出库';
                }
            }
        },
        {
            key: 'description',
            title: '备注',
            width: 200,
            dataIndex: 'description',
        },
        {
            key: 'operation',
            title: '操作',
            dataIndex: 'operation',
            fixed: 'right' as FixedType,
            width: 200,
            render: (_: undefined, record: Record<string, any>): React.ReactNode => (
                <Space direction="horizontal" size="small">
                    <Button type='link' onClick={()=>{ history.push(`/packagingWorkshop/deliveryPlan/detail/${ record.id }` )}}>查看</Button>
                    <Button type='link' onClick={()=>{ history.push(`/packagingWorkshop/deliveryPlan/delivery/${ record.id }` )}}>成品出库</Button>
                </Space>
            )
        }
    ]

    return <Page
        path="/tower-production/productionLines/exPage"
        columns={ columns }
        headTabs={ [] }
        // extraOperation={ <Button type="primary" ghost>导出</Button> }
        refresh={ refresh }
        searchFormItems={ [
            {
                name: 'status',
                label: '出库状态',
                children: <Select style={{ width: '120px' }} placeholder="请选择">
                    <Select.Option value={ "" } key="">全部</Select.Option>
                    <Select.Option value={ 0 } key="0">未出库</Select.Option>
                    <Select.Option value={ 1 } key="1">部分出库</Select.Option>
                    <Select.Option value={ 2 } key="2">已出库</Select.Option>
                </Select>
            },
            {
                name: 'time',
                label: '发运日期',
                children: <DatePicker.RangePicker />
            },
            {
                name: 'fuzzyMsg',
                label: '模糊查询项',
                children: <Input placeholder="请输入发货通知单编号/工程名称/计划号进行查询"/>
            }
        ] }
        filterValue={ filterValue }
        onFilterSubmit = { (values: Record<string, any>) => {
            if(values.time) {
                const formatDate = values.time.map((item: any) => item.format("YYYY-MM-DD"));
                values.shippingTimeStart = formatDate[0] + ' 00:00:00';
                values.shippingTimeEnd = formatDate[1] + ' 23:59:59';
                delete values.time;
            }
            setFilterValue(values);
            return values;
        } }
    />
}