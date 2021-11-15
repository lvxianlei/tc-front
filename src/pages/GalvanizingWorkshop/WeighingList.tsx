import React, { useState } from 'react';
import { Space, Input, DatePicker, Select, Button, Popconfirm, Form, Modal, Row, Col } from 'antd';
import { Page } from '../common';
import { FixedType } from 'rc-table/lib/interface';
import styles from './DailySchedule.module.less';
import { Link, useLocation } from 'react-router-dom';
import RequestUtil from '../../utils/RequestUtil';

interface IDetail {
    readonly accountEquipmentName?: string;
}

export default function WeighingList(): React.ReactNode {
    const [ refresh, setRefresh ] = useState<boolean>(false);
    const [ filterValue, setFilterValue ] = useState({});
    const location = useLocation<{ state: {} }>();
    
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
            title: '过磅单号',
            width: 150,
            dataIndex: 'taskNum'
        },
        {
            key: 'taskNum',
            title: '重量',
            width: 150,
            dataIndex: 'taskNum'
        },
        {
            key: 'taskNum',
            title: '抱杆号',
            width: 150,
            dataIndex: 'taskNum'
        },
        {
            key: 'taskNum',
            title: '类型',
            width: 150,
            dataIndex: 'taskNum'
        },
        {
            key: 'taskNum',
            title: '过磅日期',
            width: 150,
            dataIndex: 'taskNum'
        },
        {
            key: 'taskNum',
            title: '司磅员',
            width: 150,
            dataIndex: 'taskNum'
        },
        {
            key: 'taskNum',
            title: '穿挂班组',
            width: 150,
            dataIndex: 'taskNum'
        },
        {
            key: 'taskNum',
            title: '检修班组',
            width: 150,
            dataIndex: 'taskNum'
        },
        {
            key: 'taskNum',
            title: '酸洗班组',
            width: 150,
            dataIndex: 'taskNum'
        },
        {
            key: 'taskNum',
            title: '锌锅班组',
            width: 150,
            dataIndex: 'taskNum'
        },
        {
            key: 'taskNum',
            title: '穿卦班组',
            width: 150,
            dataIndex: 'taskNum'
        },
        {
            key: 'taskNum',
            title: '制单时间',
            width: 150,
            dataIndex: 'taskNum'
        },
        {
            key: 'operation',
            title: '操作',
            dataIndex: 'operation',
            fixed: 'right' as FixedType,
            width: 150,
            render: (_: undefined, record: Record<string, any>): React.ReactNode => (
                <Space direction="horizontal" size="small" className={ styles.operationBtn }>
                    <Link to={`/galvanizingWorkshop/weighingList/weighingSetting/${ record.id }`}><Button type="link">编辑</Button></Link>
                    <Popconfirm
                        title="确认删除?"
                        onConfirm={ () => {
                            RequestUtil.delete(``).then(res => {
                                setRefresh(!refresh); 
                            });
                        } }
                        okText="确认"
                        cancelText="取消"
                    >
                        <Button type="link">删除</Button>
                    </Popconfirm>
                </Space>
            )
        }
    ]

    return <Page
        path="/tower-science/loftingTask/taskPage"
        columns={ columns }
        headTabs={ [] }
        requestData={ { status: location.state } }
        extraOperation={ <Link to={`/galvanizingWorkshop/weighingList/weighingNew`}><Button type="primary">新增过磅单</Button></Link> }
        refresh={ refresh }
        searchFormItems={ [
            {
                name: 'fuzzyMsg',
                label: '',
                children: <Input style={{ width: '300px' }} placeholder="请输入塔型/抱杆号进行查询"/>
            },
            {
                name: 'updateStatusTime',
                label: '过磅日期',
                children: <DatePicker.RangePicker />
            }
        ] }
        filterValue={ filterValue }
        onFilterSubmit = { (values: Record<string, any>) => {
            if(values.updateStatusTime) {
                const formatDate = values.updateStatusTime.map((item: any) => item.format("YYYY-MM-DD"));
                values.updateStatusTimeStart = formatDate[0] + ' 00:00:00';
                values.updateStatusTimeEnd = formatDate[1] + ' 23:59:59';
            }
            setFilterValue(values);
            return values;
            } }
        />
}