import React, { useEffect, useState } from 'react';
import { Input, DatePicker, Button, Form, Row, Col, message, Select, Spin, Space } from 'antd';
import { CommonTable, DetailContent } from '../common';
import styles from './ShopFloorPlan.module.less';
import RequestUtil from '../../utils/RequestUtil';
import { ISchedulingList } from './IShopFloorPlan';
import { detailColumns } from "./shopFloorPlan.json";
import { useHistory, useLocation, useParams, useRouteMatch } from 'react-router-dom';
import useRequest from '@ahooksjs/use-request';
import ExportList from '../../components/export/list';

let prompt: any = false

export default function AutomaticScheduling(): React.ReactNode {
    const [form] = Form.useForm();
    const params = useParams<{ id: string }>();
    const history = useHistory();
    const [loading, setLoading] = useState(true);
    const [isExport, setIsExport] = useState(false);
    const match = useRouteMatch();
    const location = useLocation();

    const { run: checkRun, data: result, cancel } = useRequest<boolean>(() => new Promise(async (resole, reject) => {
        try {
            const result: boolean = await RequestUtil.get(`/tower-aps/aps/check?ids=${params.id}`);
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true, pollingInterval: 4000 })

    const { data } = useRequest(() => new Promise(async (resole, reject) => {
        try {
            const data = await RequestUtil.post(`/tower-aps/aps?ids=${params.id}`);
            prompt = setTimeout(() => {
                setLoading(false);
                cancel();
                message.error("当前没有适用的工作中心");
            }, 10000)
            checkRun();
            resole(data)
        } catch (error) {
            reject(error)
        }
    }))

    const { data: schedulingList, run } = useRequest<ISchedulingList[]>((filterValue) => new Promise(async (resole, reject) => {
        try {
            const result: ISchedulingList[] = await RequestUtil.get(`/tower-aps/aps`, {
                ...filterValue,
                workPlanIds: params.id
            })
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    useEffect(() => {
        result && cancel();
        result && run();
        result && clearTimeout(prompt);
        result && setLoading(false);
        !loading && cancel();
    }, [result, loading])

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

    return <div id="plan"><DetailContent key="scheduling">
        <Form form={form} onFinish={async (values) => await run({
            ...values,
            startTime: values.time && values?.time[0].format('YYYY-MM-DD') + ' 00:00:00',
            endTime: values.time && values?.time[1].format('YYYY-MM-DD') + ' 23:59:59'
        })}>
            <Row>
                <Col className={styles.right}>
                    <Form.Item label="" name="fuzzy" >
                        <Input style={{ width: '300px' }} placeholder="请输入加工计划编号/计划号/塔型进行查询" />
                    </Form.Item>
                </Col>
                <Col className={styles.right}>
                    <Form.Item label="生产单元" name="unitId">
                        <Select placeholder="请选择" style={{ width: '150px' }}>
                            {productUnitData?.map((item: any) => {
                                return <Select.Option key={item.id} value={item.id}>{item.name}</Select.Option>
                            })}
                        </Select>
                    </Form.Item>
                </Col>
                <Col className={styles.right}>
                    <Form.Item label="工作中心" name="workCenterId">
                        <Select placeholder="请选择" style={{ width: '150px' }}>
                            {workCenterData?.map((item: any) => {
                                return <Select.Option key={item.id} value={item.id}>{item.workCenterName}</Select.Option>
                            })}
                        </Select>
                    </Form.Item>
                </Col>
                <Col className={styles.right}>
                    <Form.Item label="完成时间" name="time">
                        <DatePicker.RangePicker />
                    </Form.Item>
                </Col>
                <Col className={styles.right}>
                    <Button type='primary' htmlType="submit" className={styles.right}>查询</Button>
                    <Button type='ghost' htmlType="reset">重置</Button>
                </Col>
            </Row>
        </Form>
        <Spin spinning={loading}>
            <Space className={styles.bottom} direction="horizontal">
                <Button type="ghost" onClick={() => history.goBack()}>返回</Button>
                <Button type="primary" disabled={(schedulingList || []).length <= 0} onClick={() => {
                    RequestUtil.post(`/tower-aps/aps/issue?ids=${params.id}`).then(res => {
                        message.success('加工任务下发成功');
                        history.goBack();
                    })
                }}>加工任务下发</Button>
                <Button type="primary" onClick={() => setIsExport(true)} ghost>导出</Button>
            </Space>
            <CommonTable
                dataSource={schedulingList || []}
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
                ]} />
        </Spin>
        {isExport ? <ExportList
            history={history}
            location={location}
            match={match}
            columnsKey={() => {
                let keys = [...detailColumns]
                keys.pop()
                return keys
            }}
            current={1}
            size={10}
            total={0}
            url={`/tower-aps/aps`}
            serchObj={{
                workPlanIds: params.id
            }}
            closeExportList={() => setIsExport(false)}
        /> : null}
    </DetailContent></div>
}