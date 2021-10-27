import React, { useState } from 'react';
import { Space, Input, DatePicker, Select } from 'antd';
import { Page } from '../common';
import { FixedType } from 'rc-table/lib/interface';
import styles from './DrawTower.module.less';
import { Link } from 'react-router-dom';
import DeliverablesListing from './DeliverablesListing';

export default function DrawTowerMngt(): React.ReactNode {
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
            key: 'name',
            title: '塔型',
            width: 150,
            dataIndex: 'name'
        },
        {
            key: 'steelProductShape',
            title: '塔型钢印号',
            dataIndex: 'steelProductShape',
            width: 120
        },
        {
            key: 'pattern',
            title: '类型',
            width: 200,
            dataIndex: 'pattern',
            render: (status: number): React.ReactNode => {
                switch (status) {
                    case 1:
                        return '新放';
                    case 2:
                        return '重新出卡';
                    case 3:
                        return '套用';
                }
            }
        },
        {
            key: 'taskCode',
            title: '任务单编号',
            width: 150,
            dataIndex: 'taskCode'
        },
        {
            key: 'saleOrderNumber',
            title: '订单编号',
            dataIndex: 'saleOrderNumber',
            width: 200
        },
        {
            key: 'internalNumber',
            title: '内部合同编号',
            width: 200,
            dataIndex: 'internalNumber'
        },
        {
            key: 'structureCount',
            title: '件号数',
            width: 200,
            dataIndex: 'structureCount',
            render: (_: number): React.ReactNode => ( 
                <span>{ _ === -1 ? undefined : _ }</span>
            )
        },
        {
            key: 'steelAngleCount',
            title: '角钢件号数',
            width: 200,
            dataIndex: 'steelAngleCount',
            render: (_: number): React.ReactNode => ( 
                <span>{ _ === -1 ? undefined : _ }</span>
            )
        },
        {
            key: 'steelPlateCount',
            title: '钢板件号数',
            width: 200,
            dataIndex: 'steelPlateCount',
            render: (_: number): React.ReactNode => ( 
                <span>{ _ === -1 ? undefined : _ }</span>
            )  
        },
        {
            key: 'createTime',
            title: '创建时间',
            width: 200,
            dataIndex: 'createTime'
        },
        {
            key: 'updateUserName',
            title: '最后更新人',
            width: 200,
            dataIndex: 'updateUserName'
        },
        {
            key: 'updateTime',
            title: '最后更新时间',
            width: 200,
            dataIndex: 'updateTime'
        },
        {
            key: 'operation',
            title: '操作',
            dataIndex: 'operation',
            fixed: 'right' as FixedType,
            width: 200,
            render: (_: undefined, record: Record<string, any>): React.ReactNode => (
                <Space direction="horizontal" size="small" className={ styles.operationBtn }>
                    <Link to={ `/drawTower/drawTowerMngt/towerInformation/${ record.id }` }>塔型信息</Link>
                    <Link to={ `/drawTower/drawTowerMngt/componentInformation/${ record.id }/${ record.structureCount === -1 ? 0 : record.structureCount }` }>塔型构件</Link>
                    <DeliverablesListing id={ record.id } />
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
                label: '类型',
                children: <Select style={{ width: '120px' }} placeholder="请选择">
                    <Select.Option value={ "" } key="4">全部</Select.Option>
                    <Select.Option value={ 1 } key="1">新放</Select.Option>
                    <Select.Option value={ 2 } key="2">重新出卡</Select.Option>
                    <Select.Option value={ 3 } key="3">套用</Select.Option>
                </Select>
            },
            {
                name: 'time',
                label: '创建时间',
                children: <DatePicker.RangePicker />
            },
            {
                name: 'fuzzyMsg',
                label: '模糊查询项',
                children: <Input placeholder="塔型/塔型钢印号任务单编号/订单编号/内部合同编号· 0"/>
            }
        ] }
        filterValue={ filterValue }
        onFilterSubmit = { (values: Record<string, any>) => {
            if(values.time) {
                const formatDate = values.time.map((item: any) => item.format("YYYY-MM-DD"));
                values.creationTimeStart = formatDate[0] + ' 00:00:00';
                values.creationTimeEnd = formatDate[1] + ' 23:59:59';
            }
            setFilterValue(values);
            return values;
        } }
    />
}