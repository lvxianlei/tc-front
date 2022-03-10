import React, { useState } from 'react';
import { Input, Select } from 'antd';
import { Page } from '../common';
import moment from 'moment';
import { FixedType } from 'rc-table/lib/interface';

export default function PlanTrack(): React.ReactNode {
    const [filterValue, setFilterValue] = useState({});
    const columns = [
        {
            key: 'index',
            title: '序号',
            width: 50,
            dataIndex: 'index',
            fixed: "left" as FixedType,
            render: (_a: any, _b: any, index: number) => { return index + 1 }
        },
        {
            key: 'businessUserName',
            title: '业务员',
            dataIndex: 'businessUserName',
            width: 100,
        },
        // {
        //     key: 'taskNum',
        //     title: '放样任务编号',
        //     width: 100,
        //     dataIndex: 'taskNum'
        // },
        {
            key: 'internalNumber',
            title: '内部合同号',
            width: 100,
            dataIndex: 'internalNumber'
        },
        {
            key: 'planNumber',
            title: '计划号',
            width: 100,
            dataIndex: 'planNumber'
        },
        {
            key: 'productCategoryName',
            title: '塔型',
            width: 100,
            dataIndex: 'productCategoryName'
        },
        {
            key: 'priorityName',
            title: '优先级',
            width: 100,
            dataIndex: 'priorityName'
        },
        {
            key: 'num',
            title: '基数',
            width: 100,
            dataIndex: 'num'
        },
        {
            key: 'totalWeight',
            title: '合同总量',
            width: 100,
            dataIndex: 'totalWeight'
        },
        {
            key: 'materialStatusName',
            title: '塔型提料状态',
            width: 200,
            dataIndex: 'materialStatusName'
        },
        {
            key: 'materialDeliverTime',
            title: '提料计划交付时间',
            width: 200,
            dataIndex: 'materialDeliverTime'
        },
        {
            key: 'materialDeliverRealTime',
            title: '提料实际交付时间',
            width: 200,
            dataIndex: 'materialDeliverRealTime'
        },
        {
            key: 'loftingStatusName',
            title: '塔型放样状态',
            width: 200,
            dataIndex: 'loftingStatusName'
        },
        {
            key: 'loftingDeliverTime',
            title: '放样计划交付时间',
            width: 200,
            dataIndex: 'loftingDeliverTime'
        },
        {
            key: 'loftingDeliverRealTime',
            title: '放样实际交付时间',
            width: 200,
            dataIndex: 'loftingDeliverRealTime'
        },
        {
            key: 'description',
            title: '备注',
            width: 200,
            dataIndex: 'description'
        },
    ];
    const onFilterSubmit = (value: any) => {
        setFilterValue(value)
        return value;
    }

    const columnsSetting = columns.map(col => {

        return {
            ...col,
            render: col.render ? col.render : (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                col.dataIndex === 'index' ? index + 1
                    : col.dataIndex === 'loftingDeliverRealTime' && moment(record.loftingDeliverTime) < moment(record.loftingDeliverRealTime ? record.loftingDeliverRealTime : undefined) ? <div style={{ backgroundColor: '#F9A1A1', color: '#FFF' }}>{_ ? _ : '-'}</div>
                        : col.dataIndex === 'materialDeliverRealTime' && record.materialDeliverTime && moment(record.materialDeliverTime) < moment(record.materialDeliverRealTime ? record.materialDeliverRealTime : undefined) ? <div style={{ backgroundColor: '#F9A1A1', color: '#fff' }}>{_ ? _ : '-'}</div>
                            : <span>{_ ? _ : '-'}</span>
            )
        }
    })
    return <Page
        path="/tower-science/loftingTask/planTrack"
        columns={columnsSetting}
        filterValue={filterValue}
        onFilterSubmit={onFilterSubmit}
        exportPath="/tower-science/loftingTask/planTrack"
        searchFormItems={[
            {
                name: 'priority',
                label: '优先级',
                children: <Select style={{ width: '100px' }} defaultValue={''}>
                    <Select.Option value={''} key={''}>全部</Select.Option>
                    <Select.Option value={0} key={0}>紧急</Select.Option>
                    <Select.Option value={1} key={1}>高</Select.Option>
                    <Select.Option value={2} key={2}>中</Select.Option>
                    <Select.Option value={3} key={3}>低</Select.Option>
                </Select>
            },
            {
                name: 'materialStatus',
                label: '塔型提料状态',
                children: <Select style={{ width: '100px' }} defaultValue={''}>
                    <Select.Option value={''} key={''}>全部</Select.Option>
                    <Select.Option value={1} key={1}>待指派</Select.Option>
                    <Select.Option value={2} key={2}>提料中</Select.Option>
                    <Select.Option value={3} key={3}>配段中</Select.Option>
                    <Select.Option value={4} key={4}>已完成</Select.Option>
                </Select>
            },
            {
                name: 'loftingStatus',
                label: '塔型放样状态',
                children: <Select style={{ width: '100px' }} defaultValue={''}>
                    <Select.Option value={''} key={''}>全部</Select.Option>
                    <Select.Option value={0} key={0}>待指派</Select.Option>
                    <Select.Option value={1} key={1}>放样中</Select.Option>
                    <Select.Option value={2} key={2}>组焊中</Select.Option>
                    <Select.Option value={3} key={3}>配段中</Select.Option>
                    <Select.Option value={4} key={4}>已完成</Select.Option>
                </Select>
            },
            {
                name: 'fuzzyMsg',
                label: '模糊查询项',
                children: <Input placeholder="请输入计划号/塔型/内部合同编号/业务员进行查询" style={{ width: '300px' }} maxLength={200} />
            },
        ]}
    />
}