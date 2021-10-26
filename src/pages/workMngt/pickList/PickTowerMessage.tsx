import React, { useState } from 'react'
import { Space, Input, DatePicker, Button, Form, Modal, Row, Col, Popconfirm, Select, message } from 'antd'
import { FixedType } from 'rc-table/lib/interface';
import { Link, useHistory, useParams } from 'react-router-dom'
import { Page } from '../../common'
import TowerPickAssign from './TowerPickAssign';
import RequestUtil from '../../../utils/RequestUtil';
import AuthUtil from '../../../utils/AuthUtil';

export default function PickTowerMessage(): React.ReactNode {
    const history = useHistory();
    const [refresh, setRefresh] = useState<boolean>(false);
    const params = useParams<{ id: string, status: string }>();
    const [filterValue, setFilterValue] = useState({});
    const columns = [
        {
            key: 'index',
            title: '序号',
            dataIndex: 'index',
            width: 50,
            render: (_a: any, _b: any, index: number): React.ReactNode => (<span>{index + 1}</span>)
        },
        {
            key: 'productCategoryName',
            title: '塔型',
            width: 100,
            dataIndex: 'productCategoryName'
        },
        {
            key: 'name',
            title: '段名',
            width: 100,
            dataIndex: 'name'
        },
        {
            key: 'pattern',
            title: '模式',
            width: 100,
            dataIndex: 'pattern',
            render: (value: number, record: object): React.ReactNode => {
                const renderEnum: any = [
                  {
                    value: 1,
                    label: "新放"
                  },
                  {
                    value: 2,
                    label: "重新出卡"
                  },
                  {
                    value: 3,
                    label: "套用"
                  },
                ]
                return <>{value&&value!==-1?renderEnum.find((item: any) => item.value === value).label:null}</>
            }
        },
        {
            key: 'plannedDeliveryTime',
            title: '计划交付时间',
            width: 100,
            dataIndex: 'plannedDeliveryTime'
        },
        {
            key: 'materialLeaderName',
            title: '提料人',
            width: 100,
            dataIndex: 'materialLeaderName'
        },
        {
            key: 'materialCheckLeaderName',
            title: '校对人',
            width: 100,
            dataIndex: 'materialCheckLeaderName'
        },
        {
            key: 'status',
            title: '提料状态',
            width: 100,
            dataIndex: 'status',
            render: (value: number, record: object): React.ReactNode => {
                const renderEnum: any = [
                    {
                        value: 1,
                        label: "提料中"
                    },
                    {
                        value: 2,
                        label: "校核中"
                    },
                    {
                        value: 3,
                        label: "已完成"
                    },
                    {
                        value: 4,
                        label: "已提交"
                    }
                ]
                     return <>{value&&renderEnum.find((item: any) => item.value === value).label}</>
            }
        },
        {
            key: 'updateStatusTime',
            title: '最新状态变更时间',
            width: 200,
            dataIndex: 'updateStatusTime'
        },
        {
            key: 'operation',
            title: '操作',
            fixed: 'right' as FixedType,
            width: 230,
            dataIndex: 'operation',
            render: (_: undefined, record: any): React.ReactNode => (
                <Space direction="horizontal" size="small">
                    <Button onClick={()=>{history.push(`/workMngt/pickList/pickTowerMessage/${params.id}/${params.status}/pick/${record.id}`)}} type='link' disabled={record.status!==1||AuthUtil.getUserId()!==record.materialLeader}>提料</Button>
                    <Button onClick={()=>{history.push(`/workMngt/pickList/pickTowerMessage/${params.id}/${params.status}/check/${record.id}/${record.materialLeader}`)}} type='link' disabled={record.status!==2||AuthUtil.getUserId()!==record.materialCheckLeader}>校核</Button>
                    <Button onClick={()=>{history.push(`/workMngt/pickList/pickTowerMessage/${params.id}/${params.status}/detail/${record.id}`)}} type='link' disabled={record.status<3}>明细</Button>
                </Space>
            )
        }
    ]
    const onFilterSubmit = (value: any) => {
        if (value.statusUpdateTime) {
            const formatDate = value.statusUpdateTime.map((item: any) => item.format("YYYY-MM-DD"))
            value.updateStatusTimeStart = formatDate[0]+ ' 00:00:00';
            value.updateStatusTimeEnd = formatDate[1]+ ' 23:59:59';
            delete value.statusUpdateTime
        }
        setFilterValue(value)
        return value
    }
    const onRefresh=()=>{
        setRefresh(!refresh);
    }
    return (
        <Page
            // path="/tower-market/bidInfo"
            path={`/tower-science/drawProductSegment`}
            columns={columns}
            refresh={refresh}
            onFilterSubmit={onFilterSubmit}
            filterValue={ filterValue }
            requestData={{ productCategory: params.id }}
            extraOperation={
                <Space>
                <Button type="primary" ghost>导出</Button>
                <Popconfirm
                    title="确认提交?"
                    onConfirm={ async () => {
                        await RequestUtil.post(`/tower-science/drawProductSegment/${params.id}/submit`).then(()=>{
                            message.success('提交成功')
                        })
                    } }
                    okText="确认"
                    cancelText="取消"
                >   
                    <Button type="primary" ghost>提交</Button>
                </Popconfirm>
                { params.status==='1' ? <TowerPickAssign id={ params.id } onRefresh={onRefresh}/> : null }
                <Button type="primary" onClick={()=>history.push('/workMngt/pickList')} ghost>返回上一级</Button>
                </Space>
            }
            searchFormItems={[
                {
                    name: 'statusUpdateTime',
                    label: '最新状态变更时间',
                    children: <DatePicker.RangePicker format="YYYY-MM-DD" />
                },
                {
                    name: 'status',
                    label: '提料状态',
                    children: <Select style={{width:'100px'}}>
                        <Select.Option value={''} key ={''}>全部</Select.Option>
                        <Select.Option value={1} key={1}>提料中</Select.Option>
                        <Select.Option value={2} key={2}>校核中</Select.Option>
                        <Select.Option value={3} key={3}>已完成</Select.Option>
                        <Select.Option value={4} key={4}>已提交</Select.Option>
                    </Select>
                },
                {
                    name: 'materialLeader',
                    label: '提料人',
                    children: <Input />
                },
                {
                    name: 'materialCheckLeader',
                    label: '校核人',
                    children: <Input />
                },
            ]}
        />
    )
}