import React, { useState } from 'react'
import { Select, Form } from 'antd'
import { useLocation } from 'react-router-dom'
import { Page } from '../common';

export default function Login(): React.ReactNode {
    const [refresh, setRefresh] = useState<boolean>(false);
    const [filterValue, setFilterValue] = useState({});
    const location = useLocation<{ state: {} }>();

    const columns = [
        {
            key: 'index',
            title: '登录时间',
            dataIndex: 'index',
            width: 100
        },
        {
            key: 'taskNum',
            title: '登录人员',
            width: 100,
            dataIndex: 'taskNum'
        },
        {
            key: 'status',
            title: '终端类型',
            width: 100,
            dataIndex: 'status',
            render: (value: number, record: object): React.ReactNode => {
                const renderEnum: any = [
                    {
                        value: 1,
                        label: "WEB端"
                    },
                    {
                        value: 2,
                        label: "移动端"
                    }
                  ]
                return <>{renderEnum.find((item: any) => item.value === value).label}</>
            }
        },
        {
            key: 'updateStatusTime',
            title: '浏览器/终端版本',
            width: 200,
            dataIndex: 'updateStatusTime'
        },
        {
            key: 'confirmName',
            title: '操作系统',
            width: 200,
            dataIndex: 'confirmName'
        },
        {
            key: 'contractName',
            title: '设备名称',
            width: 100,
            dataIndex: 'contractName'
        },
        {
            key: 'aeName',
            title: 'MAC地址',
            width: 100,
            dataIndex: 'aeName'
        },
        {
            key: 'aeName',
            title: '登录IP',
            width: 100,
            dataIndex: 'aeName'
        },
        {
            key: 'aeName',
            title: '地址',
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
            columns={columns}
            refresh={ refresh }
            // extraOperation={<Button type="primary">导出</Button>}
            filterValue={ filterValue }
            onFilterSubmit={onFilterSubmit}
            searchFormItems={[
                {
                    name: 'status',
                    label: '',
                    children: <Form.Item name="status" initialValue={ location.state }>
                        <Select style={{width:"100px"}}>
                            <Select.Option value={''} key ={''}>全部</Select.Option>
                            <Select.Option value={1} key={1}>WEB端</Select.Option>
                            <Select.Option value={2} key={2}>移动端</Select.Option>
                        </Select>
                    </Form.Item>
                }
            ]}
        />
    </>
}