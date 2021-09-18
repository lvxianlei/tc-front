import React from 'react';
import { Button, Input } from 'antd';
import { Page } from '../common';

export default function PlanSetOut(): React.ReactNode {
    const columns = [
        {
            key: 'index',
            title: '序号',
            dataIndex: 'index',
            width: 50,
            render: (_a: any, _b: any, index: number): React.ReactNode => (<span>{index + 1}</span>)
        },
        {
            key: 'typeName',
            title: '放样任务编号',
            width: 100,
            dataIndex: 'typeName'
        },
        {
            key: 'phone',
            title: '任务单编号',
            width: 100,
            dataIndex: 'phone'
        },
        {
            key: 'linkman',
            title: '订单编号',
            width: 100,
            dataIndex: 'linkman'
        },
        {
            key: 'linkman',
            title: '内部合同编号',
            width: 100,
            dataIndex: 'linkman'
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
            title: '重量',
            width: 100,
            dataIndex: 'description'
        },
        {
            key: 'createTime',
            title: '模式',
            width: 100,
            dataIndex: 'createTime'
        },
        {
            key: 'description',
            title: '塔型提料状态',
            width: 100,
            dataIndex: 'description'
        },
        {
            key: 'createTime',
            title: '提料负责人',
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
            title: '提料配段负责人',
            width: 100,
            dataIndex: 'createTime'
        },
        {
            key: 'phone',
            title: '提料配段计划交付时间',
            width: 200,
            dataIndex: 'phone'
        },
        {
            key: 'description',
            title: '提料配段实际交付时间',
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
            key: 'createTime',
            title: '放样负责人',
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
            title: '放样配段负责人',
            width: 100,
            dataIndex: 'createTime'
        },
        {
            key: 'phone',
            title: '放样配段计划交付时间',
            width: 200,
            dataIndex: 'phone'
        },
        {
            key: 'description',
            title: '放样配段实际交付时间',
            width: 200,
            dataIndex: 'description'
        },
        {
            key: 'description',
            title: '组焊清单',
            width: 100,
            dataIndex: 'description'
        },
        {
            key: 'description',
            title: '组焊计划交付时间',
            width: 200,
            dataIndex: 'description'
        },
        {
            key: 'description',
            title: '组焊实际交付时间',
            width: 200,
            dataIndex: 'description'
        },
        {
            key: 'description',
            title: '小样图负责人',
            width: 100,
            dataIndex: 'description'
        },
        {
            key: 'description',
            title: '小样图计划交付时间',
            width: 200,
            dataIndex: 'description'
        },
        {
            key: 'description',
            title: '小样图实际交付时间',
            width: 200,
            dataIndex: 'description'
        },
        {
            key: 'description',
            title: '螺栓清单',
            width: 100,
            dataIndex: 'description'
        },
        {
            key: 'description',
            title: '螺栓计划交付时间',
            width: 200,
            dataIndex: 'description'
        },
        {
            key: 'description',
            title: '螺栓实际交付时间',
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