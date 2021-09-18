import React from 'react';
import { Button, Input } from 'antd';
import { Link } from 'react-router-dom';
import { Page } from '../common';

export default function PlanTrack(): React.ReactNode {
    const columns = [
        {
            key: 'index',
            title: '序号',
            width: 50,
            dataIndex: 'index',
            render: (_a: any, _b: any, index: number): React.ReactNode => (<span>{index + 1}</span>)
        },
        {
            key: 'name',
            title: '业务员',
            dataIndex: 'name',
            width: 100,
            render: (_: undefined, record: any): React.ReactNode => {
                return <Link to={`/approvalm/management/detail/${record.id}`}>{record.name}</Link>
            }
        },
        {
            key: 'typeName',
            title: '放样任务编号',
            width: 100,
            dataIndex: 'typeName'
        },
        {
            key: 'linkman',
            title: '内部合同号',
            width: 100,
            dataIndex: 'linkman'
        },
        {
            key: 'phone',
            title: '任务单编号',
            width: 100,
            dataIndex: 'phone'
        },
        {
            key: 'description',
            title: '塔型',
            width: 100,
            dataIndex: 'description'
        },
        {
            key: 'createTime',
            title: '优先级',
            width: 100,
            dataIndex: 'createTime'
        },
        {
            key: 'phone',
            title: '基数',
            width: 100,
            dataIndex: 'phone'
        },
        {
            key: 'description',
            title: '合同总量',
            width: 100,
            dataIndex: 'description'
        },
        {
            key: 'createTime',
            title: '塔型提料状态',
            width: 100,
            dataIndex: 'createTime'
        },
        {
            key: 'phone',
            title: '提料计划交付时间',
            width: 200,
            dataIndex: 'phone'
        },
        {
            key: 'description',
            title: '提料实际交付时间',
            width: 200,
            dataIndex: 'description'
        },
        {
            key: 'createTime',
            title: '塔型放样状态',
            width: 100,
            dataIndex: 'createTime'
        },
        {
            key: 'phone',
            title: '放样计划交付时间',
            width: 200,
            dataIndex: 'phone'
        },
        {
            key: 'description',
            title: '放样实际交付时间',
            width: 200,
            dataIndex: 'description'
        },
        {
            key: 'createTime',
            title: '备注',
            width: 200,
            dataIndex: 'createTime'
        },
    ]
    return <Page
        path="/audit/getAuditRecord"
        columns={columns}
        extraOperation={<Button type="primary">导出</Button>}
        searchFormItems={[
            {
                name: 'name',
                label: '最新状态变更时间',
                children: <Input placeholder="请输入项目名称/项目编码/审批编号/关联合同/制单人进行查询" maxLength={200} />
            },
            {
                name: '1',
                label: '任务状态',
                children: <Input placeholder="" maxLength={200} />
            },
            {
                name: '2',
                label: '优先级',
                children: <Input placeholder="" maxLength={200} />
            },
            {
                name: '3',
                label: '模糊查询项',
                children: <Input placeholder="请输入任务编号/合同名称/业务经理进行查询" maxLength={200} />
            },
        ]}
    />
}