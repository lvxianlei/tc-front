import React, { useState } from 'react';
import { Input, Button, Select, DatePicker, Space, message, Form } from 'antd';
import { Page } from '../../common';
import { planGalvanizedPack } from "./data.json"
import { productTypeOptions } from '../../../configuration/DictionaryOptions';
import { Link, useHistory } from 'react-router-dom';
import moment from 'moment';
import useRequest from '@ahooksjs/use-request';
import RequestUtil from '../../../utils/RequestUtil';
export interface TechnicalIssuePropsRefProps {
    onSubmit: () => void
    resetFields: () => void
}

export default function PlanGalvanizedPackMngt(): React.ReactNode {
    const SelectChange = (selectedRowKeys: React.Key[], selectedRows: any[]): void => {
        setSelectedKeys(selectedRowKeys);
        setSelectedRows(selectedRows);
        console.log(selectedRows)
        const totalWeight = selectedRows.reduce((pre: any,cur: { totalWeight: any; })=>{
            return (parseFloat(pre!==null?pre:0) + parseFloat(cur.totalWeight!==null?cur.totalWeight:0)).toFixed(3) 
        },0)
        const totalAngleWeight = selectedRows.reduce((pre: any,cur: { angleWeight: any; })=>{
            return (parseFloat(pre!==null?pre:0) + parseFloat(cur.angleWeight!==null?cur.angleWeight:0)).toFixed(3) 
        },0)
        const totalPlateWeight = selectedRows.reduce((pre: any,cur: { plateWeight: any; })=>{
            return (parseFloat(pre!==null?pre:0 )+ parseFloat(cur.plateWeight!==null?cur.plateWeight:0 )).toFixed(3)
        },0)
        const totalAngleNumber = selectedRows.reduce((pre: any,cur: { angleNumber: any; })=>{
            return (parseFloat(pre!==null?pre:0) + parseFloat(cur.angleNumber!==null?cur.angleNumber:0)).toFixed(3)
        },0)
        const totalPlateNumber = selectedRows.reduce((pre: any,cur: { plateNumber: any; })=>{
            return (parseFloat(pre!==null?pre:0) + parseFloat(cur.plateNumber!==null?cur.plateNumber:0)).toFixed(3)
        },0)
        setSum({
            ...sum,
            totalWeight,
            totalAngleWeight,
            totalPlateWeight,
            totalAngleNumber,
            totalPlateNumber
        })
    }
    const [sum, setSum] = useState<any>({
        totalWeight:0.000,
        totalAngleWeight:0.000,
        totalPlateWeight:0.000,
        totalAngleNumber:0,
        totalPlateNumber:0,
    })
    const [filterValue, setFilterValue] = useState({
        status:1
    });
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
        path="/tower-aps/galvanizedPackage"
        columns={(planGalvanizedPack as any).map((item: any) => {
            if (item.dataIndex === "packageCompleteRealTime") {
                return ({
                    ...item,
                    getCellProps(value: any, record: any) {
                        if (moment(record.packageCompleteRealTime).isBefore(moment(record.packageCompleteTime), "day")) {
                            return { style: { background: "#F9A1A1", color: 'white', fontWeight: 'bold' } }
                        }
                    }
                })
            }
            if (item.dataIndex === "galvanizedCompleteRealTime") {
                return ({
                    ...item,
                    getCellProps(value: any, record: any) {
                        if (moment(record.packageCompleteRealTime).isBefore(moment(record.galvanizedCompleteTime), "day")) {
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
                <span>总重量（t）：{sum?.totalWeight}</span>
                <span>角钢重量（t）：{sum?.totalAngleWeight}</span>
                <span>钢板重量（t）：{sum?.totalPlateWeight}</span>
                <span>角钢总件数：{sum?.totalAngleNumber}</span>
                <span>钢板总件数：{sum?.totalPlateNumber}</span>
            </Space>
            <Button type="primary" disabled={selectedKeys.length <= 0|| selectedRows.findIndex((item:any)=>item.status!==1)!==-1} onClick={()=>{
                // let error:boolean = false;
                // selectedRows.map((item:any)=>{
                //     if(item.status !==1 ){
                //         error = true
                //     }
                // })
                // if(error){
                //     return message.error('已下发、已完成，不可再次镀锌包装下发！')
                // }
                history.push(`/planProd/planGalvanizedPack/${selectedKeys.join(',')}`)
            }}>镀锌包装下发</Button>
        </Space>}
        tableProps={{
            rowSelection: {
                type: "checkbox",
                selectedRowKeys: selectedKeys,
                onChange: SelectChange,
                // getCheckboxProps: (record: any) => ({
                //     disabled: record?.status == 2, //已下发不可再次下发
                // }),
            }
        }}
        searchFormItems={[
            {
                name: 'fuzzyMsg',
                label: '模糊查询项',
                children: <Input style={{ width: "200px" }} placeholder="计划号/塔型/业务经理/客户/批次号" />
            },
            {
                name: 'productTypeId',
                label: '产品类型',
                children: <Select placeholder="请选择" style={{ width: "150px" }}>
                    {/* <Select.Option value='' key="">全部</Select.Option> */}
                    {productTypeOptions && productTypeOptions.map(({ id, name }, index) => {
                        return <Select.Option key={index} value={id}>
                            {name}
                        </Select.Option>
                    })}
                </Select>
            },
            {
                name: 'galvanizedUnitName',
                label: '镀锌生产单元',
                children: <Input style={{ width: "200px" }} placeholder="请输入" />
                // children: <Select placeholder="请选择"  style={{ width: "150px" }}>
                //     { productUnitData?.map((item: any) => {
                //         return <Select.Option key={ item.id } value={ item.name }>{ item.name }</Select.Option>
                //     }) }
                // </Select>
            },
            {
                name: 'packageUnitName',
                label: '包装生产单元',
                children: <Input style={{ width: "200px" }} placeholder="请输入" />
                // children: <Select placeholder="请选择"  style={{ width: "150px" }}>
                //     { productUnitData?.map((item: any) => {
                //         return <Select.Option key={ item.id } value={ item.name }>{ item.name }</Select.Option>
                //     }) }
                // </Select>
            },
            {
                name: 'status',
                label: '状态',
                children: <Form.Item name='status' initialValue={1}>
                    <Select placeholder="请选择" style={{ width: "150px" }}>
                        {/* <Select.Option value='' key="">全部</Select.Option> */}
                        <Select.Option value={1} key="1">未下发</Select.Option>
                        <Select.Option value={2} key="2">已下发</Select.Option>
                        <Select.Option value={3} key="3">镀锌已完成</Select.Option>
                        <Select.Option value={4} key="4">包装已完成</Select.Option>
                    </Select>
                </Form.Item>
            },
            {
                name: 'transTime',
                label: '开始转运日期',
                children: <DatePicker.RangePicker />
            },
            {
                name: 'completeTime',
                label: '镀锌计划完成日期',
                children: <DatePicker.RangePicker />
            },
            {
                name: 'packTime',
                label: '入库日期',
                children: <DatePicker.RangePicker />
            },
            // {
            //     name: 'executeStatus',
            //     label: '执行状态',
            //     children: <Form.Item name='status' initialValue={1}>
            //         <Select placeholder="请选择" style={{ width: "150px" }}>
            //             <Select.Option value={1} key="1">正常</Select.Option>
            //             {/* <Select.Option value={2} key="2">暂停</Select.Option> */}
            //             <Select.Option value={2} key="2">取消</Select.Option>
            //         </Select>
            //     </Form.Item>
            // },
            
        ]}
        filterValue={filterValue}
        onFilterSubmit={(values: any) => {
            if (values.transTime) {
                const formatDate = values.transTime.map((item: any) => item.format("YYYY-MM-DD"))
                values.transferStartTime = formatDate[0] + ' 00:00:00';
                values.transferEndTime = formatDate[1] + ' 23:59:59';
            }
            if (values.completeTime) {
                const formatDate = values.completeTime.map((item: any) => item.format("YYYY-MM-DD"))
                values.galvanizedCompleteStartTime = formatDate[0] + ' 00:00:00';
                values.galvanizedCompleteEndTime = formatDate[1] + ' 23:59:59';
            }
            if (values.packTime) {
                const formatDate = values.packTime.map((item: any) => item.format("YYYY-MM-DD"))
                values.storageStartTime = formatDate[0] + ' 00:00:00';
                values.storageEndTime = formatDate[1] + ' 23:59:59';
            }
            setFilterValue(values);
            return values;
        }}
    />)
}