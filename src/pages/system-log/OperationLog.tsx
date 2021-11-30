import React, { useState } from 'react'
import { Select, Form } from 'antd'
import { useLocation } from 'react-router-dom'
import { Page } from '../common';

export default function OperationLog(): React.ReactNode {
    const [filterValue, setFilterValue] = useState({});
    const location = useLocation<{ state: {} }>();

    const columns = [
        {
            key: 'index',
            title: '操作时间',
            dataIndex: 'index',
            width: 100
        },
        {
            key: 'taskNum',
            title: '操作用户',
            width: 100,
            dataIndex: 'taskNum'
        },
        {
            key: 'status',
            title: '模块',
            width: 100,
            dataIndex: 'status'
        },
        {
            key: 'updateStatusTime',
            title: '功能',
            width: 200,
            dataIndex: 'updateStatusTime'
        },
        {
            key: 'confirmName',
            title: '变更数据',
            width: 200,
            dataIndex: 'confirmName'
        },
        {
            key: 'contractName',
            title: '操作IP',
            width: 100,
            dataIndex: 'contractName'
        },
        {
            key: 'aeName',
            title: '操作终端',
            width: 100,
            dataIndex: 'aeName'
        },
        {
            key: 'aeName',
            title: '备注',
            width: 200,
            dataIndex: 'aeName'
        }
    ]

    const onFilterSubmit = (value: any) => {
        setFilterValue(value)
        return value
    }
    
    return <>
       
        <Page
            path="/tower-science/drawTask"
            columns={ columns }
            filterValue={ filterValue }
            onFilterSubmit={onFilterSubmit}
            searchFormItems={[
                {
                    name: 'status',
                    label: '',
                    children: <Form.Item name="status" initialValue={ location.state }>
                        <Select style={{width:"100px"}}>
                            <Select.Option value={''} key ={''}>全部</Select.Option>
                            <Select.Option value={1} key={1}>营销中心</Select.Option>
                            <Select.Option value={2} key={2}>应用中心</Select.Option>
                        </Select>
                    </Form.Item>
                }
            ]}
        />
    </>
}