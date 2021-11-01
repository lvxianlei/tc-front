import React, { useState } from 'react';
import { Button, Input, Select } from 'antd';
import { Page } from '../common';
import moment from 'moment';

export default function PlanSetOut(): React.ReactNode {  //张韵泽 28号：负责人直接返回名称，无需增加-Name字段   30号：加Name
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
            key: 'taskNum',
            title: '放样任务编号',
            width: 100,
            dataIndex: 'taskNum'
        },
        {
            key: 'externalTaskNum',
            title: '任务单编号',
            width: 100,
            dataIndex: 'externalTaskNum'
        },
        {
            key: 'saleOrderNumber',
            title: '订单编号',
            width: 100,
            dataIndex: 'saleOrderNumber'
        },
        {
            key: 'internalNumber',
            title: '内部合同编号',
            width: 100,
            dataIndex: 'internalNumber'
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
            key: 'weight',
            title: '重量',
            width: 100,
            dataIndex: 'weight'
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
                return <>{renderEnum.find((item: any) => item.value === value).label}</>
            }
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
            key: 'materialLeaderName',
            title: '提料负责人',
            width: 100,
            dataIndex: 'materialLeaderName'
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
            key: 'materialPartLeaderName',
            title: '提料配段负责人',
            width: 100,
            dataIndex: 'materialPartLeaderName'
        },
        {
            key: 'materialPartDeliverTime',
            title: '提料配段计划交付时间',
            width: 200,
            dataIndex: 'materialPartDeliverTime'
        },
        {
            key: 'materialPartDeliverRealTime',
            title: '提料配段实际交付时间',
            width: 200,
            dataIndex: 'materialPartDeliverRealTime'
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
            key: 'loftingLeaderName',
            title: '放样负责人',
            width: 100,
            dataIndex: 'loftingLeaderName'
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
            key: 'loftingPartLeaderName',
            title: '放样配段负责人',
            width: 100,
            dataIndex: 'loftingPartLeaderName'
        },
        {
            key: 'loftingPartDeliverTime',
            title: '放样配段计划交付时间',
            width: 200,
            dataIndex: 'loftingPartDeliverTime'
        },
        {
            key: 'loftingPartDeliverRealTime',
            title: '放样配段实际交付时间',
            width: 200,
            dataIndex: 'loftingPartDeliverRealTime'
        },
        {
            key: 'weldingLeaderName',
            title: '组焊清单',
            width: 100,
            dataIndex: 'weldingLeaderName'
        },
        {
            key: 'weldingDeliverTime',
            title: '组焊计划交付时间',
            width: 200,
            dataIndex: 'weldingDeliverTime'
        },
        {
            key: 'weldingDeliverRealTime',
            title: '组焊实际交付时间',
            width: 200,
            dataIndex: 'weldingDeliverRealTime'
        },
        {
            key: 'smallSampleLeaderName',
            title: '小样图负责人',
            width: 100,
            dataIndex: 'smallSampleLeaderName'
        },
        {
            key: 'smallSampleDeliverTime',
            title: '小样图计划交付时间',
            width: 200,
            dataIndex: 'smallSampleDeliverTime'
        },
        {
            key: 'smallSampleDeliverRealTime',
            title: '小样图实际交付时间',
            width: 200,
            dataIndex: 'smallSampleDeliverRealTime'
        },
        {
            key: 'boltLeaderName',
            title: '螺栓清单',
            width: 100,
            dataIndex: 'boltLeaderName'
        },
        {
            key: 'boltDeliverTime',
            title: '螺栓计划交付时间',
            width: 200,
            dataIndex: 'boltDeliverTime'
        },
        {
            key: 'boltDeliverRealTime',
            title: '螺栓实际交付时间',
            width: 200,
            dataIndex: 'boltDeliverRealTime'
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
            render:  col.render?col.render:(_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                col.dataIndex === 'index' ? index + 1 
                : col.dataIndex === 'boltDeliverRealTime'&& moment(record.boltDeliverTime)<moment(record.boltDeliverRealTime?record.boltDeliverRealTime:undefined)?<div style={{ backgroundColor:'#F9A1A1',color: '#FFF'}}>{ _?_:'-' }</div>
                : col.dataIndex === 'smallSampleDeliverRealTime'&& moment(record.smallSampleDeliverTime)<moment(record.smallSampleDeliverRealTime?record.smallSampleDeliverRealTime:undefined)?<div style={{ backgroundColor:'#F9A1A1',color: '#FFF'}}>{ _?_:'-' }</div>
                : col.dataIndex === 'weldingDeliverRealTime'&& moment(record.weldingDeliverTime)<moment(record.weldingDeliverRealTime?record.weldingDeliverRealTime:undefined)?<div style={{ backgroundColor:'#F9A1A1',color: '#FFF'}}>{ _?_:'-' }</div>
                : col.dataIndex === 'loftingPartDeliverRealTime'&& moment(record.loftingPartDeliverTime)<moment(record.loftingPartDeliverRealTime?record.loftingPartDeliverRealTime:undefined)?<div style={{ backgroundColor:'#F9A1A1',color: '#FFF'}}>{ _?_:'-' }</div>
                : col.dataIndex === 'loftingDeliverRealTime'&& moment(record.loftingDeliverTime)<moment(record.loftingDeliverRealTime?record.loftingDeliverRealTime:undefined)?<div style={{ backgroundColor:'#F9A1A1',color: '#FFF'}}>{ _?_:'-' }</div>
                : col.dataIndex === 'materialPartDeliverRealTime'&& moment(record.materialPartDeliverTime)<moment(record.materialPartDeliverRealTime?record.materialPartDeliverRealTime:undefined)?<div style={{ backgroundColor:'#F9A1A1',color: '#FFF'}}>{ _?_:'-' }</div>
                : col.dataIndex === 'materialDeliverRealTime'&& moment(record.materialDeliverTime)<moment(record.materialDeliverRealTime?record.materialDeliverRealTime:undefined)?<div style={{ backgroundColor:'#F9A1A1',color: '#FFF'}}>{ _?_:'-' }</div>
                : <div>{ _?_:'-' }</div>
            )  
        }     
    })
    return <Page
        path="/tower-science/loftingTask/planLofting"
        columns={columnsSetting}
        onFilterSubmit={onFilterSubmit}
        filterValue={filterValue}
        // extraOperation={<Button type="primary">导出</Button>}
        searchFormItems={[
            {
                name: 'priority',
                label: '优先级',
                children:  <Select style={{width:'100px'}}>
                                <Select.Option value={''} key ={''}>全部</Select.Option>
                                <Select.Option value={1} key={1}>高</Select.Option>
                                <Select.Option value={2} key={2}>中</Select.Option>
                                <Select.Option value={3} key={3}>低</Select.Option>
                            </Select>
            },
            {
                name: 'pattern',
                label: '模式',
                children:  <Select style={{width:'100px'}}>
                                <Select.Option value={''} key ={''}>全部</Select.Option>
                                <Select.Option value={1} key={1}>新放</Select.Option>
                                <Select.Option value={2} key={2}>重新出卡</Select.Option>
                                <Select.Option value={3} key={3}>套用</Select.Option>
                            </Select>
            },
            {
                name: '3fuzzyMsg',
                label: '模糊查询项',
                children: <Input placeholder="请输入放样任务编号/任务单号/订单编号/内部合同编号进行查询" maxLength={200} />
            },
        ]}
    />
}