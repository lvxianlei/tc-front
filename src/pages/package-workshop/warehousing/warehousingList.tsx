import React, { useState } from 'react';
import { Space, Input, DatePicker, Select, Button } from 'antd';
import { Page } from '../../common';
import { FixedType } from 'rc-table/lib/interface';
import { Link, useHistory } from 'react-router-dom';

export default function DrawTowerMngt(): React.ReactNode {
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
            key: 'name',
            title: '入库单编号',
            width: 150,
            dataIndex: 'name'
        },
        {
            key: 'steelProductShape',
            title: '内部合同编号',
            dataIndex: 'steelProductShape',
            width: 120
        },
        {
            key: 'taskCode',
            title: '订单号',
            width: 150,
            dataIndex: 'taskCode'
        },
        {
            key: 'saleOrderNumber',
            title: '工程名称',
            dataIndex: 'saleOrderNumber',
            width: 200
        },
        {
            key: 'internalNumber',
            title: '计划号',
            width: 200,
            dataIndex: 'internalNumber'
        },
        {
            key: 'structureCount',
            title: '仓库',
            width: 200,
            dataIndex: 'structureCount'
        },
        {
            key: 'steelAngleCount',
            title: '包装日期',
            width: 200,
            dataIndex: 'steelAngleCount',
        },
        {
            key: 'steelPlateCount',
            title: '入库日期',
            width: 200,
            dataIndex: 'steelPlateCount',
        },
        {
            key: 'steelPlateCount',
            title: '班组',
            width: 200,
            dataIndex: 'steelPlateCount',
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
                    <Button type='primary' ghost onClick={()=>{ history.push(`/packagingWorkshop/warehousing/detail/${ record.id }` )}}>查看</Button>
                </Space>
            )
        }
    ]

    return <Page
        path="/tower-science/productCategory/draw/page"
        columns={ columns }
        headTabs={ [] }
        // extraOperation={ <Button type="primary" ghost>导出</Button> }
        refresh={ refresh }
        searchFormItems={ [
            {
                name: 'pattern',
                label: '出库状态',
                children: <Select style={{ width: '120px' }} placeholder="请选择">
                    <Select.Option value={ "" } key="">全部</Select.Option>
                    <Select.Option value={ 1 } key="1">已出库</Select.Option>
                    <Select.Option value={ 2 } key="2">部分出库</Select.Option>
                    <Select.Option value={ 3 } key="3">未出库</Select.Option>
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
                values.creationTimeStart = formatDate[0] + ' 00:00:00';
                values.creationTimeEnd = formatDate[1] + ' 23:59:59';
                delete values.time;
            }
            setFilterValue(values);
            return values;
        } }
    />
}