import React, { useState } from 'react';
import { Button, Input, Select } from 'antd';
import { Link } from 'react-router-dom';
import { Page } from '../common';
import moment from 'moment';

export default function PlanTrack(): React.ReactNode {
    const [filterValue, setFilterValue] = useState({});
    const columns = [
        {
            key: 'index',
            title: '序号',
            width: 50,
            dataIndex: 'index',
            render: (_a: any, _b: any, index: number): React.ReactNode => (<span>{index + 1}</span>)
        },
        {
            key: 'businessUserName',
            title: '业务员',
            dataIndex: 'businessUserName',
            width: 100,
        },
        {
            key: 'taskNum',
            title: '放样任务编号',
            width: 100,
            dataIndex: 'taskNum'
        },
        {
            key: 'internalNumber',
            title: '内部合同号',
            width: 100,
            dataIndex: 'internalNumber'
        },
        {
            key: 'externalTaskNum',
            title: '任务单编号',
            width: 100,
            dataIndex: 'externalTaskNum'
        },
        {
            key: 'productCategoryName',
            title: '塔型',
            width: 100,
            dataIndex: 'productCategoryName'
        },
        {
            key: 'priority',
            title: '优先级',
            width: 100,
            dataIndex: 'priority',
            render: (value: number, record: object): React.ReactNode => {
                const renderEnum: any = [
                  {
                    value: 1,
                    label: "高"
                  },
                  {
                    value: 2,
                    label: "中"
                  },
                  {
                    value: 3,
                    label: "低"
                  },
                ]
                return <>{renderEnum.find((item: any) => item.value === value).label}</>
            }
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
            key: 'materialStatus',
            title: '塔型提料状态',
            width: 100,
            dataIndex: 'materialStatus',
            render: (value: number, record: object): React.ReactNode => {
                const renderEnum: any = [
                    {
                        value: -1,
                        label: "-"
                    },
                    {
                        value: 1,
                        label: "待指派"
                    },
                    {
                        value: 2,
                        label: "提料中"
                    },
                    {
                        value: 3,
                        label: "配段中"
                    },
                    {
                        value: 4,
                        label: "已完成"
                    },
                    {
                        value: 5,
                        label: "已提交"
                    },
                ]
                return <>{renderEnum.find((item: any) => item.value === value).label}</>
            }
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
            key: 'loftingStatus',
            title: '塔型放样状态',
            width: 100,
            dataIndex: 'loftingStatus',
            render: (value: number, record: object): React.ReactNode => {
                const renderEnum: any = [
                    {
                        value: -1,
                        label: "-"
                    },
                    {
                        value: 1,
                        label: "待指派"
                    },
                    {
                        value: 2,
                        label: "放样中"
                    },
                    {
                        value: 3,
                        label: "组焊中"
                    },
                    {
                        value: 4,
                        label: "配段中"
                    },
                    {
                        value: 5,
                        label: "已完成"
                    },
                    {
                        value: 6,
                        label: "已提交"
                    },
                ]
                return <>{renderEnum.find((item: any) => item.value === value).label}</>
            }
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
    const onFilterSubmit=(value: any)=>{
        setFilterValue(value)
        return value;
    }

    const columnsSetting = columns.map(col => {

        return {
            ...col,
            render:  (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                col.dataIndex === 'index' ? index + 1 
                : col.dataIndex === 'loftingDeliverRealTime'&&moment(record.loftingDeliverTime)<moment(record.loftingDeliverRealTime?record.loftingDeliverRealTime:undefined)?<div style={{ backgroundColor:'#F9A1A1',color: '#FFF'}}>{ _?_:'-' }</div>
                : col.dataIndex === 'materialDeliverRealTime'&& record.materialDeliverTime && moment(record.materialDeliverTime)<moment(record.materialDeliverRealTime?record.materialDeliverRealTime:undefined)?<div style={{backgroundColor:'#F9A1A1', color: '#fff'}}>{ _?_:'-' }</div>
                : <span>{ _?_:'-' }</span>
            )  
        }     
    })
    return <Page
        path="/tower-science/loftingTask/planTrack"
        columns={columnsSetting}
        filterValue={filterValue}
        onFilterSubmit={onFilterSubmit}
        // extraOperation={<Button type="primary">导出</Button>}
        searchFormItems={[
            {
                name: 'priority',
                label: '优先级',
                children:   <Select style={{width:'100px'}}>
                                <Select.Option value={''} key ={''}>全部</Select.Option>
                                <Select.Option value={1} key={1}>高</Select.Option>
                                <Select.Option value={2} key={2}>中</Select.Option>
                                <Select.Option value={3} key={3}>低</Select.Option>
                            </Select>
            },
            {
                name: 'materialStatus',
                label: '塔型提料状态',
                children:   <Select style={{width:'100px'}}>
                                <Select.Option value={''} key ={''}>全部</Select.Option>
                                <Select.Option value={1} key={1}>待指派</Select.Option>
                                <Select.Option value={2} key={2}>提料中</Select.Option>
                                <Select.Option value={3} key={3}>配段中</Select.Option>
                                <Select.Option value={4} key={4}>已完成</Select.Option>
                                <Select.Option value={5} key={5}>已提交</Select.Option>
                            </Select>
            },
            {
                name: 'loftingStatus',
                label: '塔型放样状态',
                children:   <Select style={{width:'100px'}}>
                                <Select.Option value={''} key ={''}>全部</Select.Option>
                                <Select.Option value={1} key={1}>待指派</Select.Option>
                                <Select.Option value={2} key={2}>放样中</Select.Option>
                                <Select.Option value={3} key={3}>组焊中</Select.Option>
                                <Select.Option value={4} key={4}>配段中</Select.Option>
                                <Select.Option value={5} key={5}>已完成</Select.Option>
                                <Select.Option value={6} key={6}>已提交</Select.Option>
                            </Select>
            },
            {
                name: 'fuzzyMsg',
                label: '模糊查询项',
                children: <Input placeholder="请输入放样任务编号/任务单编号/订单编号/内部合同编号进行查询" maxLength={200} />
            },
        ]}
    />
}