import React, { useState } from 'react';
import { Input, Button, Select, DatePicker, Space, message, Form } from 'antd';
import { SearchTable as Page } from '../../common';
import { planSchedule } from "./data.json"
import { productTypeOptions } from '../../../configuration/DictionaryOptions';
import { Link, useHistory } from 'react-router-dom';
import moment from 'moment';
import useRequest from '@ahooksjs/use-request';
import RequestUtil from '../../../utils/RequestUtil';
export interface TechnicalIssuePropsRefProps {
    onSubmit: () => void
    resetFields: () => void
}

export default function PlanScheduleMngt(): React.ReactNode {
    const SelectChange = (selectedRowKeys: React.Key[], selectedRows: any[]): void => {
        setSelectedKeys(selectedRowKeys);
        setSelectedRows(selectedRows);
        console.log(selectedRows)
        const totalHoles = selectedRows.reduce((pre: any,cur: { totalHoles: any;totalNumber: number })=>{
            return parseFloat(pre!==null?pre:0) + parseFloat(cur.totalHoles!==null?cur.totalHoles:0) 
        },0)
        const totalNumber = selectedRows.reduce((pre: any,cur: { totalNumber: any; })=>{
            return parseFloat(pre!==null?pre:0 )+ parseFloat(cur.totalNumber!==null?cur.totalNumber:0 )
        },0)
        const totalWeight = selectedRows.reduce((pre: any,cur: { totalWeight: any; })=>{
            return parseFloat(pre!==null?pre:0) + parseFloat(cur.totalWeight!==null?cur.totalWeight:0)
        },0)
        setSum({
            ...sum,
            totalHoles,
            totalNumber,
            totalWeight
        })
    }
    const [sum, setSum] = useState<any>({})
    const [filterValue, setFilterValue] = useState({status:1});
    const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([]);
    const [selectedRows, setSelectedRows] = useState<any[]>([]);
    const history = useHistory();
    const { data: productUnitData } = useRequest<{ [key: string]: any }>(() => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(`/tower-aps/productionUnit?size=10000`);
            resole(result?.records)
        } catch (error) {
            reject(error)
        }
    }))
    return (<Page
        path="/tower-aps/productionPlan"
        columns={(planSchedule as any).map((item: any) => {
            if (item.dataIndex === "loftingFeedBackTime") {
                return ({
                    ...item,
                    getCellProps(value: any, record: any) {
                        if (moment(record.loftingCompleteTime).isBefore(moment(value), "day")) {
                            return { style: { background: "#F9A1A1", color: 'white', fontWeight: 'bold' } }
                        }
                    }
                })
            }
            return item
        })}
        headTabs={[]}
        extraOperation={<Space>
            <Space>
                <span>合计：</span>
                <span>角钢重量（t）：{sum?.totalNumber}</span>
                <span>钢板重量（t）：{sum?.totalHoles}</span>
                <span>角钢总件数：{sum?.totalWeight}</span>
                <span>钢板总件数：{sum?.totalWeight}</span>
            </Space>
            <Link to={`/planProd/planGalvanizedPack/${selectedKeys.join(',')}`}><Button type="primary" disabled={selectedKeys.length <= 0}>镀锌包装下发</Button></Link>
        </Space>}
        tableProps={{
            rowSelection: {
                type: "checkbox",
                selectedRowKeys: selectedKeys,
                onChange: SelectChange
            }
        }}
        searchFormItems={[
            {
                name: 'fuzzyMsg',
                label: '模糊查询项',
                children: <Input style={{ width: "200px" }} placeholder="计划号/塔型/业务经理/客户" />
            },
            {
                name: 'productType',
                label: '产品类型',
                children: <Select placeholder="请选择" getPopupContainer={triggerNode => triggerNode.parentNode} style={{ width: "150px" }}>
                    {productTypeOptions && productTypeOptions.map(({ id, name }, index) => {
                        return <Select.Option key={index} value={id}>
                            {name}
                        </Select.Option>
                    })}
                </Select>
            },
            {
                name: 'productUnit',
                label: '镀锌生产单元',
                children: <Select placeholder="请选择" getPopupContainer={triggerNode => triggerNode.parentNode} style={{ width: "150px" }}>
                    { productUnitData?.map((item: any) => {
                        return <Select.Option key={ item.id } value={ item.id }>{ item.name }</Select.Option>
                    }) }
                </Select>
            },
            {
                name: 'productUnit',
                label: '包装生产单元',
                children: <Select placeholder="请选择" getPopupContainer={triggerNode => triggerNode.parentNode} style={{ width: "150px" }}>
                    { productUnitData?.map((item: any) => {
                        return <Select.Option key={ item.id } value={ item.id }>{ item.name }</Select.Option>
                    }) }
                </Select>
            },
            {
                name: 'status',
                label: '状态',
                children: <Form.Item name='status' initialValue={1}>
                    <Select placeholder="请选择" style={{ width: "150px" }}>
                        <Select.Option value={1} key="1">未下发</Select.Option>
                        <Select.Option value={2} key="2">已下发</Select.Option>
                        <Select.Option value={3} key="3">镀锌已完成</Select.Option>
                        <Select.Option value={4} key="4">包装已完成</Select.Option>
                    </Select>
                </Form.Item>
            },
            {
                name: 'time',
                label: '计划交货日期',
                children: <DatePicker.RangePicker />
            },
            
        ]}
        filterValue={filterValue}
        onFilterSubmit={(values: any) => {
            if (values.time) {
                const formatDate = values.time.map((item: any) => item.format("YYYY-MM-DD"))
                values.startTime = formatDate[0] + ' 00:00:00';
                values.endTime = formatDate[1] + ' 23:59:59';
            }
            setFilterValue(values);
            return values;
        }}
    />)
}