import React, { useState } from 'react'
import { Space, Input, Button, Popconfirm, message, Select } from 'antd'
import { FixedType } from 'rc-table/lib/interface';
import { useHistory, useParams } from 'react-router-dom'
import { Page } from '../../common'
import RequestUtil from '../../../utils/RequestUtil';
import AuthUtil from '../../../utils/AuthUtil';

export default function FullList(): React.ReactNode {
    const history = useHistory();
    const [refresh, setRefresh] = useState<boolean>(false);
    const params = useParams<{ id: string, status: string, materialLeader: string }>();
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
            key: 'name',
            title: '员工姓名',
            width: 100,
            dataIndex: 'name'
        },
        {
            key: 'pattern',
            title: '岗位',
            width: 100,
            dataIndex: 'pattern'
        },
        {
            key: 'name',
            title: '入职时间',
            width: 100,
            dataIndex: 'name'
        },
        {
            key: 'pattern',
            title: '试用期',
            width: 100,
            dataIndex: 'pattern',
        },
        {
            key: 'plannedDeliveryTime',
            title: '转正日期',
            width: 100,
            dataIndex: 'plannedDeliveryTime'
        },
        {
            key: 'materialLeaderName',
            title: '考核结果',
            width: 150,
            dataIndex: 'materialLeaderName'
        },
        {
            key: 'materialCheckLeaderName',
            title: '转正评语',
            width: 100,
            dataIndex: 'materialCheckLeaderName'
        },
        {
            key: 'status',
            title: '转正状态',
            width: 100,
            dataIndex: 'status',
        },
        {
            key: 'updateStatusTime',
            title: '审批状态',
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
                    <Button onClick={()=>{history.push(`/workMngt/pickList/pickTowerMessage/${params.id}/${params.status}/${params.materialLeader}/pick/${record.id}`)}} type='link' disabled={record.status!==1||AuthUtil.getUserId()!==record.materialLeader}>查看</Button>
                    <Button onClick={()=>{history.push(`/workMngt/pickList/pickTowerMessage/${params.id}/${params.status}/${params.materialLeader}/check/${record.id}/${record.materialLeader}`)}} type='link' disabled={record.status!==2||AuthUtil.getUserId()!==record.materialCheckLeader}>转正</Button>
                </Space>
            )
        }
    ];
    const onFilterSubmit = (value: any) => {
        setFilterValue(value)
        return value
    }
    const onRefresh=()=>{
        setRefresh(!refresh);
    }
    return (
            <Page
                path={`/tower-science/drawProductSegment`}
                columns={columns}
                refresh={refresh}
                onFilterSubmit={onFilterSubmit}
                filterValue={ filterValue }
                searchFormItems={[
                    {
                        name: 'fuzzyMsg',
                        label: '模糊查询项',
                        children: <Input placeholder="请输入员工名称进行查询" maxLength={200} />
                    },
                    {
                        name: 'fuzzyMsg',
                        label: '考核结果',
                        children: <Select placeholder="请选择" style={{ width: "150px" }}>
                            <Select.Option value={''} key="">全部</Select.Option>
                            <Select.Option value={0} key="0">提前转正</Select.Option>
                            <Select.Option value={1} key="1">正常转正</Select.Option>
                            <Select.Option value={2} key="2">延期转正</Select.Option>
                        </Select>
                    },
                    {
                        name: 'fuzzyMsg',
                        label: '转正状态',
                        children: <Select placeholder="请选择" style={{ width: "150px" }}>
                            <Select.Option value={''} key="">全部</Select.Option>
                            <Select.Option value={0} key="0">待转正</Select.Option>
                            <Select.Option value={1} key="1">已转正</Select.Option>
                        </Select>
                    },
                ]}
            />
    )
}