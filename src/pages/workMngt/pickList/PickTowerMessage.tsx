import React, { useState } from 'react'
import { Space, Input, DatePicker, Button, Form, Modal, Row, Col, Popconfirm, Select, message } from 'antd'
import { FixedType } from 'rc-table/lib/interface';
import { Link, useHistory, useParams } from 'react-router-dom'
import { Page } from '../../common'
import TowerPickAssign from './TowerPickAssign';
import RequestUtil from '../../../utils/RequestUtil';

export default function PickTowerMessage(): React.ReactNode {
    const history = useHistory();
    const [refresh, setRefresh] = useState<boolean>(false);
    const params = useParams<{ id: string }>();
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
            dataIndex: 'status'
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
                    <Link to={`/workMngt/pickList/pickTowerMessage/${params.id}/pick/${record.id}`}>提料</Link>
                    <Link to={`/workMngt/pickList/pickTowerMessage/${params.id}/check/${record.id}`}>校核</Link>
                    <Link to={`/workMngt/pickList/pickTowerMessage/${params.id}/detail/${record.id}`}>明细</Link>
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
                <Button type="primary">导出</Button>
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
                    <Button type="primary">提交</Button>
                </Popconfirm>
                <TowerPickAssign id={ params.id }/>
                <Button type="primary" onClick={()=>history.push('/workMngt/pickList')}>返回上一级</Button>
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
                    label: '放样状态',
                    children: <Select style={{width:'100px'}}>
                        <Select.Option value={''} key ={''}>全部</Select.Option>
                        <Select.Option value={1} key={1}>新放</Select.Option>
                        <Select.Option value={2} key={2}>重新出卡</Select.Option>
                        <Select.Option value={3} key={3}>套用</Select.Option>
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