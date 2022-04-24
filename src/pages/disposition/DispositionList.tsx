/**
 * @author zyc
 * @copyright © 2022 
 * @description 质检-处置单
 */

 import React, { useState } from 'react';
 import { Input, DatePicker, Select, Form, Spin } from 'antd';
 import { Page } from '../common';
 import { FixedType } from 'rc-table/lib/interface';
 import { Link, useLocation } from 'react-router-dom';
 import useRequest from '@ahooksjs/use-request';
 import RequestUtil from '../../utils/RequestUtil';
 
 export default function SetOutList(): React.ReactNode {
     const columns = [
         {
             key: 'index',
             title: '序号',
             dataIndex: 'index',
             width: 50,
             fixed: "left" as FixedType,
             render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (<span>{index + 1}</span>)
         },
         {
             key: 'taskNum',
             title: '编号',
             width: 150,
             dataIndex: 'taskNum'
         },
         {
             key: 'planNumber',
             title: '开单日期',
             width: 150,
             dataIndex: 'planNumber'
         },
         {
             key: 'internalNumber',
             title: '生产环节',
             dataIndex: 'internalNumber',
             width: 120
         },
         {
             key: 'name',
             title: '计划号',
             width: 200,
             dataIndex: 'name'
         },
         {
             key: 'num',
             title: '生产下达单号',
             width: 150,
             dataIndex: 'num',
         },
         {
             key: 'voltageGradeName',
             title: '产品类型',
             width: 150,
             dataIndex: 'voltageGradeName',
         },
         {
             key: 'plannedDeliveryTime',
             title: '工程名称',
             dataIndex: 'plannedDeliveryTime',
             width: 200,
         },
         {
             key: 'patternName',
             title: '塔型',
             width: 200,
             dataIndex: 'patternName'
         },
         {
             key: 'loftingLeaderName',
             title: '责任工序',
             width: 200,
             dataIndex: 'loftingLeaderName'
         },
         {
             key: 'statusName',
             title: '生产单元',
             width: 200,
             dataIndex: 'statusName'
         },
         {
             key: 'updateStatusTime',
             title: '责任班组',
             width: 200,
             dataIndex: 'updateStatusTime'
         },
         {
             key: 'updateStatusTime',
             title: '责任人',
             width: 200,
             dataIndex: 'updateStatusTime'
         },
         {
             key: 'updateStatusTime',
             title: '处理类型',
             width: 200,
             dataIndex: 'updateStatusTime'
         },
         {
             key: 'updateStatusTime',
             title: '质检员',
             width: 200,
             dataIndex: 'updateStatusTime'
         },
         {
             key: 'operation',
             title: '操作',
             dataIndex: 'operation',
             fixed: 'right' as FixedType,
             width: 200,
             render: (_: undefined, record: Record<string, any>): React.ReactNode => (
                     <Link to={`/workMngt/setOutList/setOutInformation/${record.id}`}>放样信息</Link>
             )
         }
     ]

 
     return <Page
             path=""
             columns={columns}
             headTabs={[]}
             searchFormItems={[
                {
                    name: 'fuzzyMsg',
                    label: '编号',
                    children: <Input placeholder="请输入" />
                },
                 {
                     name: 'updateStatusTime',
                     label: '开单日期',
                     children: <DatePicker.RangePicker /> 
                 },
                 {
                     name: 'fuzzyMsg',
                     label: '质检员',
                     children: <Input placeholder="请输入" />
                 },

                 {
                     name: 'status',
                     label: '处理类型',
                     children: <Form.Item name="status" initialValue={''}>
                         <Select style={{ width: '120px' }} placeholder="请选择">
                             <Select.Option value="" key="6">全部</Select.Option>
                             <Select.Option value={1} key="1">返工</Select.Option>
                             <Select.Option value={2} key="2">返修</Select.Option>
                             <Select.Option value={3} key="3">报废</Select.Option>
                         </Select>
                     </Form.Item>
                 },
                 {
                     name: 'fuzzyMsg',
                     label: '计划号',
                     children: <Input placeholder="请输入" />
                 },
                 {
                     name: 'fuzzyMsg',
                     label: '工程名称',
                     children: <Input placeholder="请输入" />
                 },
                 {
                     name: 'fuzzyMsg',
                     label: '塔型',
                     children: <Input placeholder="请输入" />
                 },
                 {
                     name: 'fuzzyMsg',
                     label: '责任单位',
                     children: <Input placeholder="请输入" />
                 },
                 {
                     name: 'fuzzyMsg',
                     label: '责任人',
                     children: <Input placeholder="请输入" />
                 }
             ]}
             onFilterSubmit={(values: Record<string, any>) => {
                 if (values.updateStatusTime) {
                     const formatDate = values.updateStatusTime.map((item: any) => item.format("YYYY-MM-DD"));
                     values.updateStatusTimeStart = formatDate[0] + ' 00:00:00';
                     values.updateStatusTimeEnd = formatDate[1] + ' 23:59:59';
                 }
                 return values;
             }}
         />
 }