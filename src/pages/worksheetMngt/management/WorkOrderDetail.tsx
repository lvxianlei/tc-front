/**
 * @author zyc
 * @copyright © 2022 
 * @description WO-工单管理-工单管理-详情
 */

 import React, { forwardRef } from "react";
 import { Card, Col, Form, Row } from 'antd';
 import { BaseInfo, CommonTable, DetailContent, DetailTitle, OperationRecord } from '../../common';
 import RequestUtil from '../../../utils/RequestUtil';
 import useRequest from '@ahooksjs/use-request';
 import styles from './Management.module.less'
 
 interface modalProps {
     rowId: string;
 }
 
 export default forwardRef(function WorkOrderDetail({ rowId }: modalProps, ref) {
     const [form] = Form.useForm();

     const baseColumns = [
        {
            key: 'hierarchy',
            title: '工单编号',
            dataIndex: 'hierarchy',
            width: 100
        },
        {
            key: 'hierarchy',
            title: '产生途径',
            dataIndex: 'hierarchy',
            width: 100
        },
        {
            key: 'hierarchy',
            title: '工单标题',
            dataIndex: 'hierarchy',
            width: 100
        },
        {
            key: 'hierarchy',
            title: '工单类型',
            dataIndex: 'hierarchy',
            width: 100
        },
        {
            key: 'hierarchy',
            title: '工单状态',
            dataIndex: 'hierarchy',
            width: 100
        },
        {
            key: 'hierarchy',
            title: '产生时间',
            dataIndex: 'hierarchy',
            width: 100
        },
        {
            key: 'hierarchy',
            title: '预计完成时间',
            dataIndex: 'hierarchy',
            width: 100
        },
        {
            key: 'hierarchy',
            title: '实际完成时间 ',
            dataIndex: 'hierarchy',
            width: 100
        },

     ]
 
     const columns = [
         {
             key: 'hierarchy',
             title: '处理环节',
             dataIndex: 'hierarchy',
             width: 100
         },
         {
             key: 'hierarchy',
             title: '处理标题',
             dataIndex: 'hierarchy',
             width: 100
         },
         {
             key: 'model',
             title: '处理模式',
             dataIndex: 'model',
             width: 100
         },
         {
             key: 'upstreamNode',
             title: '处理人',
             dataIndex: 'upstreamNode',
             width: 100
         },
         {
             key: 'agingType',
             title: '部门',
             dataIndex: 'agingType',
             width: 100
         },
         {
             key: 'aging',
             title: '处理状态',
             dataIndex: 'aging',
             width: 100
         },
         {
             key: 'handleName',
             title: '接收时间',
             dataIndex: 'handleName',
             width: 100
         },
         {
             key: 'jobs',
             title: '预计完成时间',
             dataIndex: 'jobs',
             width: 100
         },
         {
             key: 'color',
             title: '实际完成时间',
             dataIndex: 'color',
             width: 100
         }
     ]
 
     const { data } = useRequest<any>((filterValue: Record<string, any>) => new Promise(async (resole, reject) => {
         const result: any = await RequestUtil.get<any>(`/tower-science/performance/config`);
        const list = {
            vo: [
                {
                    name: '一级处理',
                    userList: [
                        {
                            name: '张三',
                            fields: [
                                {
                                    key: '创建时间',
                                    value: '2022'
                                }
                            ]
                        }
                    ]
                },
                {
                    name: '二级处理',

                }
            ]
        }
         resole(list);
     }), { refreshDeps: [rowId] })
 
     return <DetailContent key='WorkOrderDetail' className={styles.WorkOrderDetail}>
        <Row gutter={12}>
            <Col span={19}>
         <DetailTitle title="工单基本信息" key={0} />
         <BaseInfo layout="vertical" col={8} columns={baseColumns} dataSource={{}}/>
         <DetailTitle title="工单处理环节信息" key={0} />
             <CommonTable
                 className={styles.table}
                 bordered={false}
                 columns={columns}
                 dataSource={data || []}
                 scroll={{ x: 800 }}
                 pagination={false}
             />
             <OperationRecord title="操作信息" serviceId={rowId} serviceName="tower-wo" />
            </Col>
            <Col span={5}>
         <DetailTitle title="工单信息" key={0} />
         {
            data?.vo?.map((res: any, index: number) => {
return <Card title={res?.name} key={index}>
    {
        res?.userList?.map((item: any, ind: number) => {
            return <Card title={item?.name} key={ind}>
                {
                    item?.fields?.map((field: any, i: number) => {
                        return <Row gutter={12} key={i} justify="space-around">
        <Col span={8}>
     {field?.key}
        </Col>
        <Col span={16}>
     {field?.value}
        </Col>
      </Row>
                    })
                }
      
    </Card>
        })
    }
    
  </Card>
            })
         }
         
            </Col>
        </Row>
     </DetailContent>
 })
 
 