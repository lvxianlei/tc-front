import React, { useState } from 'react';
import { Input, Select } from 'antd';
import { Page } from '../common';
import moment from 'moment';
import { patternTypeOptions } from '../../configuration/DictionaryOptions';
import { FixedType } from 'rc-table/lib/interface';

export default function PlanSetOut(): React.ReactNode {  //张韵泽 28号：负责人直接返回名称，无需增加-Name字段   30号：加Name
    const [filterValue, setFilterValue] = useState({});
    const columns = [
        {
            key: 'index',
            title: '序号',
            dataIndex: 'index',
            width: 50,
            fixed: "left" as FixedType,
            render: (_a: any, _b: any, index: number) => {return index + 1}
        },
        // {
        //     key: 'taskNum',
        //     title: '放样任务编号',
        //     width: 100,
        //     dataIndex: 'taskNum'
        // },
        {
            key: 'planNumber',
            title: '计划号',
            width: 100,
            dataIndex: 'planNumber'
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
            key: 'weight',
            title: '重量',
            width: 100,
            dataIndex: 'weight'
        },
        {
            key: 'patternName',
            title: '模式',
            width: 100,
            dataIndex: 'patternName',
        },
        {
            key: 'materialStatusName',
            title: '塔型提料状态',
            width: 100,
            dataIndex: 'materialStatusName',
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
            key: 'loftingStatusName',
            title: '塔型放样状态',
            width: 200,
            dataIndex: 'loftingStatusName'
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
            key: 'weldingLeaderName', 
            title: '放样配段负责人',
            width: 100,
            dataIndex: 'weldingLeaderName'
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
            key: 'drawLeaderName',
            title: '样板组负责人',
            width: 200,
            dataIndex: 'drawLeaderName'
        },
        {
            key: 'weldingDrawDeliverTime',
            title: '组装图纸计划交付时间',
            width: 200,
            dataIndex: 'weldingDrawDeliverTime'
        },
        {
            key: 'weldingDrawDeliverRealTime',
            title: '组装图纸实际交付时间',
            width: 200,
            dataIndex: 'weldingDrawDeliverRealTime'
        },
        {
            key: 'boltDrawDeliverTime',
            title: '发货图纸计划交付时间',
            width: 200,
            dataIndex: 'boltDrawDeliverTime'
        },
        {
            key: 'boltDrawDeliverRealTime',
            title: '发货图纸实际交付时间',
            width: 200,
            dataIndex: 'boltDrawDeliverRealTime'
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
                : col.dataIndex === 'boltDrawDeliverRealTime'&& moment(record.boltDrawDeliverTime)<moment(record.boltDrawDeliverRealTime?record.boltDrawDeliverRealTime:undefined)?<div style={{ backgroundColor:'#F9A1A1',color: '#FFF'}}>{ _?_:'-' }</div>
                : col.dataIndex === 'weldingDrawDeliverRealTime'&& moment(record.weldingDrawDeliverTime)<moment(record.weldingDrawDeliverRealTime?record.weldingDrawDeliverRealTime:undefined)?<div style={{ backgroundColor:'#F9A1A1',color: '#FFF'}}>{ _?_:'-' }</div>
                : <div>{ _?_:'-' }</div>
            )  
        }     
    })
    return <Page
        path="/tower-science/loftingTask/planLofting"
        columns={columnsSetting}
        onFilterSubmit={onFilterSubmit}
        filterValue={filterValue}
        exportPath="/tower-science/loftingTask/planLofting"
        searchFormItems={[
            {
                name: 'priority',
                label: '优先级',
                children:  <Select style={{width:'100px'}}>
                                <Select.Option value={''} key ={''}>全部</Select.Option>
                                <Select.Option value={0} key={0}>紧急</Select.Option>
                                <Select.Option value={1} key={1}>高</Select.Option>
                                <Select.Option value={2} key={2}>中</Select.Option>
                                <Select.Option value={3} key={3}>低</Select.Option>
                            </Select>
            },
            {
                name: 'pattern',
                label: '模式',
                children:  <Select style={{ width: '150px' }} getPopupContainer={triggerNode => triggerNode.parentNode}>
                        { patternTypeOptions && patternTypeOptions.map(({ id, name }, index) => {
                            return <Select.Option key={ index } value={ id  }>
                                { name }
                            </Select.Option>
                        }) }
                    </Select>
            },
            {
                name: 'fuzzyMsg',
                label: '模糊查询项',
                children: <Input placeholder="请输入计划号/订单编号/内部合同编号进行查询" maxLength={200} />
            },
        ]}
    />
}