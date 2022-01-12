import React, { useState } from 'react';
import { Space, Input, DatePicker, Select } from 'antd';
import { Page } from '../../common';
import { FixedType } from 'rc-table/lib/interface';
import { Link } from 'react-router-dom';

export default function StockList(): React.ReactNode {
    const [ refresh, setRefresh ] = useState<boolean>(false);
    const [ filterValue, setFilterValue ] = useState({});
    
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
            key: 'warehouseName',
            title: '所在仓库',
            width: 150,
            dataIndex: 'warehouseName'
        },
        {
            key: 'teamName',
            title: '入库班组',
            dataIndex: 'teamName',
            width: 150
        },
        {
            key: 'warehousePosition',
            title: '库区',
            width: 150,
            dataIndex: 'warehousePosition'
        },
        {
            key: 'warehouseRegion',
            title: '区位',
            dataIndex: 'warehouseRegion',
            width: 150
        },
        {
            key: 'internalNumber',
            title: '内部合同编号',
            width: 200,
            dataIndex: 'internalNumber'
        },
        {
            key: 'orderProjectName',
            title: '工程名称',
            width: 200,
            dataIndex: 'orderProjectName'
        },
        {
            key: 'planNumber',
            title: '计划号',
            width: 200,
            dataIndex: 'planNumber',
        },
        {
            key: 'productCategoryName',
            title: '塔型',
            width: 200,
            dataIndex: 'productCategoryName',
        },
        {
            key: 'productHeight',
            title: '呼高',
            width: 100,
            dataIndex: 'productHeight',
            render: (_: number): React.ReactNode => ( 
                <span>{ _ === -1 ? '-' : _ }</span>
            )  
        },
        {
            key: 'productNumber',
            title: '杆塔号',
            width: 150,
            dataIndex: 'productNumber'
        },
        {
            key: 'balesCode',
            title: '包名',
            width: 100,
            dataIndex: 'balesCode'
        },
        {
            key: 'balesWeight',
            title: '包单重（kg）',
            width: 150,
            dataIndex: 'balesWeight',
            render: (_: number): React.ReactNode => ( 
                <span>{ _ === -1 ? '-' : _ }</span>
            )  
        },
        {
            key: 'balesWarehouseNumber',
            title: '库存数',
            width: 100,
            dataIndex: 'balesWarehouseNumber',
            render: (_: number): React.ReactNode => ( 
                <span>{ _ === -1 ? '-' : _ }</span>
            )  
        },
        {
            key: 'balesNumber',
            title: '包件数',
            width: 100,
            dataIndex: 'balesNumber',
            render: (_: number): React.ReactNode => ( 
                <span>{ _ === -1 ? '-' : _ }</span>
            )  
        }
    ]

    return <Page
        path="/tower-production/packageWorkshop/packageWarehouse"
        columns={ columns }
        headTabs={ [] }
        // extraOperation={ <Button type="primary" ghost>导出</Button> }
        refresh={ refresh }
        searchFormItems={ [
            {
                name: 'fuzzyMsg',
                children: <Input placeholder="请输入内部合同编号/工程名称/计划号进行查询" style={{width: '300px'}}/>
            }
        ] }
        filterValue={ filterValue }
        onFilterSubmit = { (values: Record<string, any>) => {
            setFilterValue(values);
            return values;
        } }
    />
}