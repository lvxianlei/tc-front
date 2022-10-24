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
            key: 'workOrderNumber',
            title: '工单编号',
            dataIndex: 'workOrderNumber',
            width: 100
        },
        {
            key: 'buildChannel',
            title: '产生途径',
            dataIndex: 'buildChannel',
            width: 100
        },
        {
            key: 'workOrderTitle',
            title: '工单标题',
            dataIndex: 'workOrderTitle',
            width: 100
        },
        {
            key: 'workOrderType',
            title: '工单类型',
            dataIndex: 'workOrderType',
            width: 100
        },
        {
            key: 'statusName',
            title: '工单状态',
            dataIndex: 'statusName',
            width: 100
        },
        {
            key: 'createTime',
            title: '产生时间',
            dataIndex: 'createTime',
            width: 100
        },
        {
            key: 'planEndTime',
            title: '预计完成时间',
            dataIndex: 'planEndTime',
            width: 100
        },
        {
            key: 'actualEndTime',
            title: '实际完成时间 ',
            dataIndex: 'actualEndTime',
            width: 100
        }
    ]

    const columns = [
        {
            key: 'node',
            title: '处理环节',
            dataIndex: 'node',
            width: 100
        },
        {
            key: 'processingName',
            title: '处理标题',
            dataIndex: 'processingName',
            width: 100
        },
        {
            key: 'pattern',
            title: '处理模式',
            dataIndex: 'pattern',
            width: 100
        },
        {
            key: 'recipientUserName',
            title: '处理人',
            dataIndex: 'recipientUserName',
            width: 100
        },
        {
            key: 'statusName',
            title: '处理状态',
            dataIndex: 'statusName',
            width: 100
        },
        {
            key: 'actualStartTime',
            title: '接收时间',
            dataIndex: 'actualStartTime',
            width: 100
        },
        {
            key: 'planEndTime',
            title: '预计完成时间',
            dataIndex: 'planEndTime',
            width: 100
        },
        {
            key: 'actualEndTime',
            title: '实际完成时间',
            dataIndex: 'actualEndTime',
            width: 100
        }
    ]

    const { data } = useRequest<any>((filterValue: Record<string, any>) => new Promise(async (resole, reject) => {
        const result: any = await RequestUtil.get<any>(`/tower-work/workOrder/${rowId}`);
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
        resole(result);
    }), { refreshDeps: [rowId] })

    return <DetailContent key='WorkOrderDetail' className={styles.WorkOrderDetail}>
        <Row gutter={12}>
            <Col span={19}>
                <DetailTitle title="工单基本信息" key={0} />
                <BaseInfo layout="vertical" col={8} columns={baseColumns} dataSource={{}} />
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
                    data?.workOrderNodeVOList?.map((res: any, index: number) => {
                        return <Card title={res?.node} key={index}>
                            {
                                res?.workOrderNodeUserVOList?.map((item: any, ind: number) => {
                                    return <Card title={item?.recipientUserName} key={ind}>
                                        {
                                            item?.workOrderCustomDetailsVOList?.map((field: any, i: number) => {
                                                return <Row gutter={12} key={i} justify="space-around">
                                                    <Col span={8}>
                                                        {field?.fieldKey}
                                                    </Col>
                                                    <Col span={16}>
                                                        {field?.fieldValue}
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

