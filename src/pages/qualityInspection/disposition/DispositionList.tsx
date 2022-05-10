/**
 * @author zyc
 * @copyright © 2022 
 * @description 质检-处置单
 */

 import React, { useState } from 'react';
 import { Input, DatePicker, Select, Form, Spin } from 'antd';
 import { Page } from '../../common';
 import { FixedType } from 'rc-table/lib/interface';
 import { Link } from 'react-router-dom';
 import useRequest from '@ahooksjs/use-request';
 import RequestUtil from '../../../utils/RequestUtil';
 
 export default function SetOutList(): React.ReactNode {
    const [productUnitData, setProductUnitData] = useState<any[]>([])
    const { loading, data } = useRequest<any>(() => new Promise(async (resole, reject) => {
        const data: any = await RequestUtil.get<any[]>(`/tower-aps/productionUnit?size=10000`);
        setProductUnitData(data?.records)
        resole(data)
    }), {})
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
             title: '处置单单号',
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
                     <Link to={`/qualityInspection/disposition/detail/${record.id}`}>查看详情</Link>
             )
         }
     ]

 
     return <Page
             path="/tower-quality/rework"
             columns={columns}
             headTabs={[]}
             searchFormItems={[
                {
                    name: 'reworkNum',
                    label: '处置单单号',
                    children: <Input placeholder="请输入" />
                },
                 {
                     name: 'updateStatusTime',
                     label: '开单日期',
                     children: <DatePicker.RangePicker /> 
                 },
                 {
                     name: 'createUserName',
                     label: '质检员',
                     children: <Input placeholder="请输入" />
                 },

                 {
                     name: 'processType',
                     label: '处理类型',
                     children: <Form.Item name="processType" initialValue={''}>
                         <Select style={{ width: '120px' }} placeholder="请选择">
                                <Select.Option value="" key="6">全部</Select.Option>
                                <Select.Option value={1} key={1}>返修</Select.Option>
                                <Select.Option value={2} key={2}>返镀</Select.Option>
                                <Select.Option value={3} key={3}>报废</Select.Option>
                                <Select.Option value={4} key={4}>退货</Select.Option>
                         </Select>
                     </Form.Item>
                 },
                 {
                     name: 'planNumber',
                     label: '计划号',
                     children: <Input placeholder="请输入" />
                 },
                 {
                     name: 'projectName',
                     label: '工程名称',
                     children: <Input placeholder="请输入" />
                 },
                 {
                     name: 'productCategory',
                     label: '塔型',
                     children: <Input placeholder="请输入" />
                 },
                 {
                     name: 'workUnit',
                     label: '生产单元',
                     children: <Select style={{ width: "100px" }}>
                        {productUnitData?.map((item: any) => {
                            return <Select.Option key={item.name} value={item.name}>{item.name}</Select.Option>
                        })}
                    </Select>
                 },
                 {
                     name: 'createUserName',
                     label: '责任人',
                     children: <Input placeholder="请输入" />
                 }
             ]}
             onFilterSubmit={(values: Record<string, any>) => {
                 if (values.updateStatusTime) {
                     const formatDate = values.updateStatusTime.map((item: any) => item.format("YYYY-MM-DD"));
                     values.startCreateTime = formatDate[0] + ' 00:00:00';
                     values.endCreateTime = formatDate[1] + ' 23:59:59';
                 }
                 return values;
             }}
         />
 }