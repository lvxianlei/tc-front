/**
 * @author lxy
 * @copyright © 2022 
 * @description 包装计划-改包捆
 */

 import React, { useRef, useState } from 'react';
 import { Input, DatePicker, Button, Modal, Radio, message, Space, Select, Spin, Form, Row, Col } from 'antd';
 import { DetailContent, Page } from '../common';
 import { FixedType } from 'rc-table/lib/interface';
 import RequestUtil from '../../utils/RequestUtil';
 import { EditRefProps } from './Edit';
 import Edit from "./Edit";
 import useRequest from '@ahooksjs/use-request';
 export interface IPackingPlan {
     readonly id?: string;
     readonly angleTeamId?: string;
     readonly boardTeamId?: string;
     readonly pipeTeamId?: string;
     readonly angleTeamName?: string;
     readonly boardTeamName?: string;
     readonly pipeTeamName?: string;
 }
 
 export interface IResponseData {
     readonly total: number | undefined;
     readonly size: number | undefined;
     readonly current: number | undefined;
     readonly records: any[];
 }
 
 export default function DailySchedule(): React.ReactNode {
     const [form] = Form.useForm();
 
    //  const { loading, data: galvanizedTeamList } = useRequest<{ [key: string]: any }>(() => new Promise(async (resole, reject) => {
    //      try {
    //          const result: { [key: string]: any } = await RequestUtil.get(`/tower-production/workshopTeam?size=1000`);
    //          resole(result?.records)
    //      } catch (error) {
    //          reject(error)
    //      }
    //  }))
 
     const { loading, data: pageList, run } = useRequest<any[]>((filterValue) => new Promise(async (resole, reject) => {
        try {
            if (filterValue.type) {
                const result: any[] = await RequestUtil.get(`/tower-aps/workPlan`, {
                    ...filterValue
                })
                resole(result)
            } else {
                message.warning('请选择类型')
                resole([])
            }
        } catch (error) {
            reject(error)
        }
    }), { manual: true })
 
    //  const columns = [
    //      {
    //          "key": "planNumber",
    //          "title": "计划号",
    //          "width": 150,
    //          "dataIndex": "planNumber"
    //      },
    //      {
    //          "key": "orderProjectName",
    //          "title": "工程名称",
    //          "width": 150,
    //          "dataIndex": "orderProjectName"
    //      },
    //      {
    //          "key": "voltageGradeName",
    //          "title": "电压等级",
    //          "width": 150,
    //          "dataIndex": "voltageGradeName"
    //      },
    //      {
    //          "key": "productCategoryName",
    //          "title": "塔型",
    //          "width": 150,
    //          "dataIndex": "productCategoryName"
    //      },
    //      {
    //          "key": "number",
    //          "title": "基数",
    //          "width": 150,
    //          "dataIndex": "number"
    //      },
    //      {
    //          "key": "angleWeight",
    //          "title": "角钢重量（KG）",
    //          "width": 150,
    //          "dataIndex": "angleWeight"
    //      },
    //      {
    //          "key": "boardWeight",
    //          "title": "连板重量（KG）",
    //          "width": 150,
    //          "dataIndex": "boardWeight"
    //      },
    //      {
    //          "key": "pipeWeight",
    //          "title": "钢管重量（KG）",
    //          "width": 150,
    //          "dataIndex": "pipeWeight"
    //      },
    //      {
    //          "key": "weight",
    //          "title": "总重量（KG）",
    //          "width": 150,
    //          "dataIndex": "weight"
    //      },
    //      {
    //          "key": "galvanizedTeamName",
    //          "title": "镀锌班组",
    //          "width": 150,
    //          "dataIndex": "galvanizedTeamName"
    //      },
    //      {
    //          "key": "angleTeamName",
    //          "title": "角钢包装班组",
    //          "width": 150,
    //          "dataIndex": "angleTeamName",
    //          render: (_: string, record: Record<string, any>) => (
    //              record.status === 1
    //                  ? '派工'
    //                  : record.status === 4
    //                      ? <>{_ || '/'}</>
    //                      : <Button type="link" onClick={() => {
    //                          setTitle('角钢包装班组');
    //                          setVisible(true);
    //                          setDetailData(record);
    //                          setTeamId(record.angleTeamId);
    //                      }}>{record.angleTeamId === '0' ? '/': _ || '派工'}</Button>
    //          )
    //      },
    //      {
    //          "key": "boardTeamName",
    //          "title": "连板包装班组",
    //          "width": 150,
    //          "dataIndex": "boardTeamName",
    //          render: (_: string, record: Record<string, any>) => (
    //              record.status === 1
    //                  ? '派工'
    //                  : record.status === 4
    //                      ? <>{_ || '/'}</>
    //                      : <Button type="link" onClick={() => {
    //                          setTitle('连板包装班组');
    //                          setVisible(true);
    //                          setDetailData(record);
    //                          setTeamId(record.boardTeamId);
    //                      }}>{record.boardTeamId === '0' ? '/': _ || '派工'}</Button>
    //          )
    //      },
    //      {
    //          "key": "pipeTeamName",
    //          "title": "钢管包装班组",
    //          "width": 150,
    //          "dataIndex": "pipeTeamName",
    //          render: (_: string, record: Record<string, any>) => (
    //              record.status === 1
    //                  ? '派工'
    //                  : record.status === 4
    //                      ? <>{_ || '/'}</>
    //                      : <Button type="link" onClick={() => {
    //                          setTitle('钢管包装班组');
    //                          setVisible(true);
    //                          setDetailData(record);
    //                          setTeamId(record.pipeTeamId);
    //                      }}>{_ || '派工'}</Button>
    //          )
    //      },
    //      {
    //          "key": "statusName",
    //          "title": "状态",
    //          "width": 150,
    //          "dataIndex": "statusName"
    //      },
    //      {
    //          "key": "startTime",
    //          "title": "开始包装日期",
    //          "width": 150,
    //          "dataIndex": "startTime",
    //          "type": "date",
    //          "format": 'YYYY-MM-DD'
    //      },
    //      {
    //          "key": "endTime",
    //          "title": "要求完成日期",
    //          "width": 150,
    //          "dataIndex": "endTime",
    //          "type": "date",
    //          "format": 'YYYY-MM-DD'
    //      },
    //      {
    //          "key": "description",
    //          "title": "备注",
    //          "width": 150,
    //          "dataIndex": "description"
    //      }
    //  ]
    const finish = async (values: any) => {
        await run({
            ...values,
            // status: confirmStatus,
            startTime: values.time && values?.time[0].format('YYYY-MM-DD') + ' 00:00:00',
            endTime: values.time && values?.time[1].format('YYYY-MM-DD') + ' 23:59:59'
        })
    }
     return <>
         <Spin spinning={loading}>
            <DetailContent>
                <Form form={form} onFinish={(values) => finish(values)}>
                    <Row>
                        <Col>
                            <Form.Item label="模糊查询项" name="fuzzyMsg" style={{marginRight:'20px'}}>
                                <Input style={{ width: '300px' }} placeholder="请输入订单工程名称/计划号/塔型进行查询" />
                            </Form.Item>
                        </Col>
                        <Col>
                            <Space direction="horizontal">
                                <Button type='primary' htmlType="submit" >查询</Button>
                                <Button type='ghost' htmlType="reset">重置</Button>
                            </Space>
                        </Col>
                    </Row>
                </Form>
            </DetailContent>
        </Spin>
     </>
 }