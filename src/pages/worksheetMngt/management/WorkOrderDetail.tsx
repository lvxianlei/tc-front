/**
 * @author zyc
 * @copyright © 2022 
 * @description WO-工单管理-工单管理-详情
 */

import React, { forwardRef } from "react";
import { Card, Col, Form, Row, Spin } from 'antd';
import { BaseInfo, CommonTable, DetailContent, DetailTitle, OperationRecord } from '../../common';
import RequestUtil from '../../../utils/RequestUtil';
import useRequest from '@ahooksjs/use-request';
import styles from './Management.module.less'

interface modalProps {
    rowId: string;
    rowData: Record<string, any>
}

export default forwardRef(function WorkOrderDetail({ rowId, rowData }: modalProps, ref) {

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
            key: 'workTemplateName',
            title: '工单标题',
            dataIndex: 'workTemplateName',
            width: 100
        },
        {
            key: 'workTemplateType',
            title: '工单类型',
            dataIndex: 'workTemplateType',
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

    const { loading, data } = useRequest<any>(() => new Promise(async (resole, reject) => {
        const result: any = await RequestUtil.get<any>(`/tower-work/workOrder/getDetails/${rowId}`);
        resole(result);
    }), { refreshDeps: [rowId, rowData] })

    return <Spin spinning={loading}>
        <DetailContent key='WorkOrderDetail' className={styles.WorkOrderDetail}>
            <Row gutter={12}>
                <Col span={19}>
                    <DetailTitle title="工单基本信息" key={0} />
                    <BaseInfo layout="vertical" col={8} columns={baseColumns} dataSource={data || {}} />
                    <DetailTitle title="工单处理环节信息" key={1} />
                    <CommonTable
                        className={styles.table}
                        bordered={false}
                        columns={columns}
                        dataSource={data?.workOrderNodeVOList || []}
                        scroll={{ x: 800 }}
                        pagination={false}
                    />
                    <OperationRecord title="操作信息" serviceId={rowId} serviceName="tower-work" />
                </Col>
                <Col span={5}>
                    <DetailTitle title="工单信息" key={2} />
                    <div className={styles.scroll}>
                        <Row gutter={12} key={0} style={{ marginBottom: '6px' }} justify="space-around">
                            <Col span={8}>
                                {rowData?.fieldKey}
                            </Col>
                            <Col span={16}>
                                {rowData?.fieldValue}
                            </Col>
                        </Row>
                        {
                            data?.workOrderNodeVOList?.map((res: any, index: number) => {
                                return <Card title={res?.node} extra={<span>处理标题：{res?.processingName}</span>} style={{ marginBottom: '6px' }} key={index}>
                                    {
                                        res?.workOrderNodeUserVOList?.map((item: any, ind: number) => {
                                            return <Card title={item?.recipientUserName} style={{ marginBottom: '6px' }} key={ind}>
                                                {
                                                    item?.workOrderCustomDetailsVOList?.map((field: any, i: number) => {
                                                        return <Row gutter={12} key={i} style={{ marginBottom: '6px' }} justify="space-around">
                                                            <Col span={8}>
                                                                {field?.fieldKey}
                                                            </Col>
                                                            <Col span={16}>
                                                                {field?.fieldValue || '-'}
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
                    </div>
                </Col>
            </Row>
        </DetailContent>
    </Spin>
})

