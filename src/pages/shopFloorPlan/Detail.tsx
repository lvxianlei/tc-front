import React, { useState } from 'react';
import { Input, DatePicker, Button, Form, Row, Col, message, Select, Spin, Space } from 'antd';
import { CommonTable, DetailContent } from '../common';
import styles from './ShopFloorPlan.module.less';
import RequestUtil from '../../utils/RequestUtil';
import { ISchedulingList } from './IShopFloorPlan';
import { detailColumns } from "./shopFloorPlan.json";
import { useHistory, useParams } from 'react-router-dom';
import useRequest from '@ahooksjs/use-request';
import moment from 'moment';

export default function Detail(): React.ReactNode {
    const [ form ] = Form.useForm();
    const params = useParams<{ id: string }>();
    const history = useHistory();

    const { loading, data: detailList, run } = useRequest<ISchedulingList[]>((filterValue) => new Promise(async (resole, reject) => {
        try {
            const result: ISchedulingList[] = await RequestUtil.get(`/tower-aps/workPlan/productionSchedule`,{
                ...filterValue,
                workPlanId: params.id
            });
            resole(result)
        } catch (error) {
            reject(error)
        }
    }))

    const { data: productUnitData } = useRequest<{ [key: string]: any }>(() => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(`/tower-aps/productionUnit?size=1000`);
            resole(result?.records)
        } catch (error) {
            reject(error)
        }
    }))

    const { data: workCenterData } = useRequest<{ [key: string]: any }>(() => new Promise(async (resole, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.get(`/tower-aps/work/center/info?size=1000`);
            resole(result?.records)
        } catch (error) {
            reject(error)
        }
    }))

    return <DetailContent>
        <Form form={form} onFinish={async (values) => await run({
            ...values,
            startTime: values.time && moment(values?.time[0]),
            endTime: values.time && moment(values?.time[1])
        })}>
            <Row>
                <Col className={ styles.right }>
                    <Form.Item label="" name="fuzzy" >
                        <Input style={{ width: '300px' }} placeholder="请输入加工计划编号/计划号/塔型进行查询" />
                    </Form.Item>
                </Col>
                <Col>
                    <Form.Item label="生产单元" name="unitId">
                        <Select placeholder="请选择" style={{ width: '150px' }}>
                            { productUnitData?.map((item: any) => {
                                return <Select.Option key={ item.id } value={ item.id }>{ item.name }</Select.Option>
                            }) }
                        </Select>
                    </Form.Item>
                </Col>
                <Col>
                    <Form.Item label="工作中心" name="workCenterId">
                        <Select placeholder="请选择" style={{ width: '150px' }}>
                            { workCenterData?.map((item: any) => {
                                return <Select.Option key={ item.id } value={ item.id }>{ item.workCenterName }</Select.Option>
                            }) }
                        </Select>
                    </Form.Item>
                </Col>
                <Col>   
                    <Form.Item label="完成时间" name="time">
                        <DatePicker.RangePicker />
                    </Form.Item>
                </Col>
                <Col>
                    <Button type='primary' htmlType="submit">查询</Button>
                    <Button type='ghost' htmlType="reset">重置</Button>
                </Col>
            </Row>
        </Form>
        <Spin spinning={loading}>
            <Space className={ styles.bottom } direction="horizontal">
                <Button type="ghost" onClick={() => history.goBack()}>返回</Button>
                <Button type="primary" onClick={() => {
                    RequestUtil.post(`/tower-aps/aps/issue?ids=${ params.id }`).then(res => {
                        message.success('加工任务下发成功');
                        history.goBack();
                    })
                }}>加工任务下发</Button>
            </Space>
            <CommonTable 
                dataSource={detailList || []} 
                columns={[...detailColumns, 
                    // {
                    //     "key": "operation",
                    //     "title": "操作",
                    //     "dataIndex": "operation",
                    //     "fixed": "right" as FixedType,
                    //     "width": 150,
                    //     render: (_: undefined, record: Record<string, any>): React.ReactNode => (
                    //         <Button type='link'>调整</Button>
                    //     )
                    // }
                ]}/>
        </Spin>
    </DetailContent>
}