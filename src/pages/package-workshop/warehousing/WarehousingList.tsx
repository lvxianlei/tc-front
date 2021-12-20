import React, { useState } from 'react';
import { Space, Input, DatePicker, Select, Button } from 'antd';
import { Page } from '../../common';
import { FixedType } from 'rc-table/lib/interface';
import { Link, useHistory } from 'react-router-dom';
import { productTypeOptions } from '../../../configuration/DictionaryOptions';

export default function WarehousingList(): React.ReactNode {
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
            key: 'warehouseCode',
            title: '入库单编号',
            width: 150,
            dataIndex: 'warehouseCode'
        },
        {
            key: 'internalNumber',
            title: '内部合同编号',
            dataIndex: 'internalNumber',
            width: 120
        },
        {
            key: 'saleOrderNumber',
            title: '订单号',
            width: 150,
            dataIndex: 'saleOrderNumber'
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
            key: 'productTypeName',
            title: '产品类型',
            width: 200,
            dataIndex: 'productTypeName'
        },
        {
            key: 'warehouse',
            title: '仓库',
            width: 200,
            dataIndex: 'warehouse'
        },
        {
            key: 'packagingTime',
            title: '包装日期',
            width: 200,
            dataIndex: 'packagingTime',
        },
        {
            key: 'pushWarehouseTime',
            title: '入库日期',
            width: 200,
            dataIndex: 'pushWarehouseTime',
        },
        {
            key: 'teamName',
            title: '班组',
            width: 200,
            dataIndex: 'teamName',
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
                    <Button type='link' onClick={()=>{ history.push(`/packagingWorkshop/warehousing/detail/${ record.id }` )}}>查看</Button>
                </Space>
            )
        }
    ]

    return <Page
        path="/tower-production/workshopDept/finishedProduct"
        columns={ columns }
        headTabs={ [] }
        // extraOperation={ <Button type="primary" ghost>导出</Button> }
        refresh={ refresh }
        searchFormItems={ [
            {
                name: 'pattern',
                label: '产品类型',
                children: <Select style={{ width: '120px' }} placeholder="请选择">
                    {productTypeOptions && productTypeOptions.map(({ id, name }, index) => {
                            return <Select.Option key={index} value={id}>
                                {name}
                            </Select.Option>
                    })}
                </Select>
            },
            {
                name: 'time',
                label: '入库日期',
                children: <DatePicker.RangePicker />
            },
            {
                name: 'fuzzyMsg',
                label: '模糊查询项',
                children: <Input placeholder="请输入内部合同编号/工程名称/计划号/订单号进行查询"/>
            }
        ] }
        filterValue={ filterValue }
        onFilterSubmit = { (values: Record<string, any>) => {
            if(values.time) {
                const formatDate = values.time.map((item: any) => item.format("YYYY-MM-DD"));
                values.startTime = formatDate[0] + ' 00:00:00';
                values.endTime = formatDate[1] + ' 23:59:59';
                delete values.time;
            }
            setFilterValue(values);
            return values;
        } }
    />
}