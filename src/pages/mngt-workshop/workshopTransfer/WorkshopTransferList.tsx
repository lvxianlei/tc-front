import React, { useState } from 'react';
import { Space, Input, DatePicker, Select, Button, Popconfirm } from 'antd';
import { Page } from '../../common';
import { FixedType } from 'rc-table/lib/interface';
import { Link, useHistory } from 'react-router-dom';
import RequestUtil from '../../../utils/RequestUtil';

export default function WorkshopTransferList(): React.ReactNode {
    const [ refresh, setRefresh ] = useState<boolean>(false);
    const [ filterValue, setFilterValue ] = useState({});
    const history = useHistory();
    const columns = [
        {
            key: 'index',
            title: '序号',
            dataIndex: 'index',
            width: 50,
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <span>{ index + 1 }</span>
            )
        },
        {
            key: 'name',
            title: '转运单号',
            width: 150,
            dataIndex: 'name'
        },
        {
            key: 'steelProductShape',
            title: '计划号',
            dataIndex: 'steelProductShape',
            width: 120
        },
        {
            key: 'taskCode',
            title: '塔型',
            width: 150,
            dataIndex: 'taskCode'
        },
        {
            key: 'saleOrderNumber',
            title: '构件明细',
            dataIndex: 'saleOrderNumber',
            width: 200,
            render: (_: undefined, record: Record<string, any>): React.ReactNode => (
                <Space direction="horizontal" size="small">
                    <Button 
                        type='link' 
                        onClick={()=>{ 
                            history.push(`/workshopManagement/workshopTransfer/componentDetail/${ record.id }` )
                        }}
                    >
                        详情
                    </Button>
                </Space>
            )
        },
        {
            key: 'internalNumber',
            title: '加工车间',
            width: 200,
            dataIndex: 'internalNumber'
        },
        {
            key: 'internalNumber',
            title: '转运车间',
            width: 200,
            dataIndex: 'internalNumber'
        },
        {
            key: 'structureCount',
            title: '转运日期',
            width: 200,
            dataIndex: 'structureCount'
        },
        {
            key: 'steelAngleCount',
            title: '接收日期',
            width: 200,
            dataIndex: 'steelAngleCount',
        },
        {
            key: 'steelPlateCount',
            title: '状态',
            width: 200,
            dataIndex: 'steelPlateCount',
            render: (status: number): React.ReactNode => {
                switch (status) {
                    case 1:
                        return '已接收';
                    case 2:
                        return '未接收';
                }
                return <>{status}</>
            }
        },
        {
            key: 'operation',
            title: '操作',
            dataIndex: 'operation',
            fixed: 'right' as FixedType,
            width: 80,
            render: (_: undefined, record: Record<string, any>): React.ReactNode => (
                <Space direction="horizontal" size="small">
                    <Popconfirm
                        title="确认接收?"
                        onConfirm={ () => {
                            RequestUtil.delete(`/sinzetech-user/department?ids=${ record.id }`).then(res => {
                                setRefresh(!refresh);
                            });
                        } }
                        okText="确认"
                        cancelText="取消"
                    >
                        <Button type="link">确认接收</Button>
                    </Popconfirm>
                </Space>
            )
        }
    ]

    return <Page
        path="/tower-science/materialTask"
        columns={ columns }
        headTabs={ [] }
        // extraOperation={ <Button type="primary" ghost>导出</Button> }
        refresh={ refresh }
        searchFormItems={ [
            {
                name: 'pattern',
                label: '状态',
                children: <Select style={{ width: '120px' }} placeholder="请选择">
                    <Select.Option value={ "" } key="">全部</Select.Option>
                    <Select.Option value={ 1 } key="1">已接收</Select.Option>
                    <Select.Option value={ 2 } key="2">未接收</Select.Option>
                </Select>
            },
            {
                name: 'car',
                label: '加工车间',
                children: <Input/>
            },
            {
                name: 'time',
                label: '转运日期',
                children: <DatePicker.RangePicker />
            },
            {
                name: 'fuzzyMsg',
                label: '模糊查询项',
                children: <Input placeholder="请输入转运单号/塔型/计划号进行查询"/>
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