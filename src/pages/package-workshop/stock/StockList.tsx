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
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (<span>{ index + 1 }</span>)
        },
        {
            key: 'name',
            title: '所在仓库',
            width: 150,
            dataIndex: 'name'
        },
        {
            key: 'steelProductShape',
            title: '入库班组',
            dataIndex: 'steelProductShape',
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
            key: 'taskCode',
            title: '库位',
            width: 150,
            dataIndex: 'taskCode'
        },
        {
            key: 'saleOrderNumber',
            title: '区位',
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
            title: '工程名称',
            width: 200,
            dataIndex: 'structureCount'
        },
        {
            key: 'steelAngleCount',
            title: '计划号',
            width: 200,
            dataIndex: 'steelAngleCount',
            render: (_: number): React.ReactNode => ( 
                <span>{ _ === -1 ? undefined : _ }</span>
            )
        },
        {
            key: 'steelPlateCount',
            title: '塔型',
            width: 200,
            dataIndex: 'steelPlateCount',
            render: (_: number): React.ReactNode => ( 
                <span>{ _ === -1 ? undefined : _ }</span>
            )  
        },
        {
            key: 'createTime',
            title: '呼高',
            width: 200,
            dataIndex: 'createTime',
            render: (_: number): React.ReactNode => ( 
                <span>{ _ === -1 ? undefined : _ }</span>
            )  
        },
        {
            key: 'updateUserName',
            title: '杆塔号',
            width: 200,
            dataIndex: 'updateUserName'
        },
        {
            key: 'updateTime',
            title: '包名',
            width: 200,
            dataIndex: 'updateTime'
        },
        {
            key: 'updateTime',
            title: '包单重',
            width: 200,
            dataIndex: 'updateTime',
            render: (_: number): React.ReactNode => ( 
                <span>{ _ === -1 ? undefined : _ }</span>
            )  
        },
        {
            key: 'updateTime',
            title: '库存数',
            width: 200,
            dataIndex: 'updateTime',
            render: (_: number): React.ReactNode => ( 
                <span>{ _ === -1 ? undefined : _ }</span>
            )  
        },
        {
            key: 'updateTime',
            title: '包件数',
            width: 200,
            dataIndex: 'updateTime',
            render: (_: number): React.ReactNode => ( 
                <span>{ _ === -1 ? undefined : _ }</span>
            )  
        },
        // {
        //     key: 'operation',
        //     title: '操作',
        //     dataIndex: 'operation',
        //     fixed: 'right' as FixedType,
        //     width: 200,
        //     render: (_: undefined, record: Record<string, any>): React.ReactNode => (
        //         <Space direction="horizontal" size="small" className={ styles.operationBtn }>
        //             <Link to={ `/drawTower/drawTowerMngt/towerInformation/${ record.id }` }>塔型信息</Link>
        //             <Link to={ `/drawTower/drawTowerMngt/componentInformation/${ record.id }/${ record.structureCount === -1 ? 0 : record.structureCount }` }>塔型构件</Link>
        //         </Space>
        //     )
        // }
    ]

    return <Page
        path="/tower-science/productCategory/draw/page"
        columns={ columns }
        headTabs={ [] }
        // extraOperation={ <Button type="primary" ghost>导出</Button> }
        refresh={ refresh }
        searchFormItems={ [
            {
                name: 'fuzzyMsg',
                label: '模糊查询项',
                children: <Input placeholder="请输入内部合同编号/工程名称/计划号进行查询"/>
            }
        ] }
        filterValue={ filterValue }
        onFilterSubmit = { (values: Record<string, any>) => {
            setFilterValue(values);
            return values;
        } }
    />
}