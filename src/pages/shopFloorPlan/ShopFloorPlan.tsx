import React, { useState } from 'react';
import { Input, DatePicker, Button, Radio, Table, Select, Form, Row, Col, Spin, message } from 'antd';
import { CommonTable, DetailContent } from '../common';
import { FixedType } from 'rc-table/lib/interface';
import RequestUtil from '../../utils/RequestUtil';
import { columns } from "./shopFloorPlan.json";
import { Link } from 'react-router-dom';
import useRequest from '@ahooksjs/use-request';
import { IShopFloorPlan } from './IShopFloorPlan';
import styles from './ShopFloorPlan.module.less';

export default function ShopFloorPlan(): React.ReactNode {
    const [confirmStatus, setConfirmStatus] = useState<number>(1);
    const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([]);
    const [form] = Form.useForm();
    const [type, setType] = useState<number>(1);

    const { data } = useRequest(() => new Promise(async (resole, reject) => {
        const data: any = await RequestUtil.get(`/tower-aps/productionUnit?size=1000`);
        resole(data?.records);
    }), {})
    const productUnitData: any = data || [];

    const operationChange = (event: any) => {
        run({ status: event.target.value, type: type })
        setConfirmStatus(parseFloat(`${event.target.value}`));
    }

    const SelectChange = (selectedRowKeys: React.Key[]): void => {
        setSelectedKeys(selectedRowKeys);
    }

    const { loading, data: pageList, run } = useRequest<IShopFloorPlan[]>((filterValue) => new Promise(async (resole, reject) => {
        try {
            if (filterValue.type) {
                const result: IShopFloorPlan[] = await RequestUtil.get(`/tower-aps/workPlan`, {
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

    const finish = async (values: any) => {
        await run({
            ...values,
            status: confirmStatus,
            startTime: values.time && values?.time[0].format('YYYY-MM-DD') + ' 00:00:00',
            endTime: values.time && values?.time[1].format('YYYY-MM-DD') + ' 23:59:59'
        })
    }

    return <Spin spinning={loading}>
        <DetailContent>
            <Form form={form} onFinish={(values) => finish(values)}>
                <Row>
                    <Col className={styles.right}>
                        <Form.Item label="统计类型" name="type" initialValue={1} rules={[{
                            "required": true,
                            "message": "请选择统计类型"
                        }]}>
                            <Select placeholder="请选择" style={{ width: '150px' }} onChange={(e: number) => setType(e)}>
                                <Select.Option key={1} value={1}>按件数</Select.Option>
                                <Select.Option key={2} value={2}>按孔数</Select.Option>
                                <Select.Option key={3} value={3}>按重量</Select.Option>
                            </Select>
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
                        <Form.Item label="计划完成日期" name="time">
                            <DatePicker.RangePicker />
                        </Form.Item>
                    </Col>
                    <Col className={styles.right}>
                        <Form.Item label="模糊查询项" name="fuzzyMsg" >
                            <Input style={{ width: '300px' }} placeholder="请输入订单工程名称/计划号/塔型进行查询" />
                        </Form.Item>
                    </Col>
                    <Col className={styles.right}>
                        <Button type='primary' htmlType="submit" className={styles.right}>查询</Button>
                        <Button type='ghost' htmlType="reset">重置</Button>
                    </Col>
                </Row>
            </Form>
            <Radio.Group defaultValue={confirmStatus} onChange={operationChange} className={styles.right}>
                <Radio.Button value={1}>未确认</Radio.Button>
                <Radio.Button value={2}>加工中</Radio.Button>
                <Radio.Button value={3}>已完成</Radio.Button>
            </Radio.Group>
            {confirmStatus === 1 ? <Link to={`/shopFloorPlan/shopFloorPlanList/automaticScheduling/${selectedKeys.join(',')}`}><Button disabled={selectedKeys.length <= 0} type="primary">确认并预排产</Button></Link> : null}
            <CommonTable
                dataSource={[...pageList || []]}
                columns={
                    [...columns, {
                        "key": "operation",
                        "title": "排产计划",
                        "dataIndex": "operation",
                        fixed: "right" as FixedType,
                        "width": 150,
                        render: (_: undefined, record: Record<string, any>): React.ReactNode => (
                            confirmStatus === 1 ? '-' :
                                <Link to={`/shopFloorPlan/shopFloorPlanList/shopFloorDetail/${record.id}`}>详情</Link>
                        )
                    }]
                }
                rowSelection={{
                    selectedRowKeys: selectedKeys,
                    onChange: SelectChange
                }}
                pagination={false}
                summary={(pageData: IShopFloorPlan[]) => {
                    let totalProductNum = 0;
                    let totalWeight = 0;
                    let allAngle40a = 0;
                    let allAngle40b = 0;
                    let allAngle40c = 0;
                    let allAngle40d = 0;
                    let allAngle50a = 0;
                    let allAngle50b = 0;
                    let allAngle50c = 0;
                    let allAngle50d = 0;
                    let allAngle63a = 0;
                    let allAngle63b = 0;
                    let allAngle63c = 0;
                    let allAngle63d = 0;
                    let allAngle70a = 0;
                    let allAngle70b = 0;
                    let allAngle70c = 0;
                    let allAngle70d = 0;
                    let allAngle75a = 0;
                    let allAngle75b = 0;
                    let allAngle75c = 0;
                    let allAngle75d = 0;
                    let allAngle90a = 0;
                    let allAngle90b = 0;
                    let allAngle90c = 0;
                    let allAngle90d = 0;
                    let allAngle110a = 0;
                    let allAngle110b = 0;
                    let allAngle110c = 0;
                    let allAngle110d = 0;
                    let allAngle160a = 0;
                    let allAngle160b = 0;
                    let allAngle160c = 0;
                    let allAngle160d = 0;
                    let allAngle161a = 0;
                    let allAngle161b = 0;
                    let allAngle161c = 0;
                    let allAngle161d = 0;
                    pageData?.forEach(({ productNum, weight, angle40, angle50, angle63, angle70, angle75, angle90, angle110, angle160, angle161 }) => {
                        totalProductNum += productNum || 0;
                        totalWeight += Number(weight) || 0;
                        angle40?.split('/').forEach((element: string, index: number) => {
                            if (index === 0) {
                                allAngle40a += Number(element);
                            }
                            if (index === 1) {
                                allAngle40b += Number(element);
                            }
                            if (index === 2) {
                                allAngle40c += Number(element);
                            }
                            if (index === 3) {
                                allAngle40d += Number(element);
                            }
                        });
                        angle50?.split('/').forEach((element: string, index: number) => {
                            if (index === 0) {
                                allAngle50a += Number(element);
                            }
                            if (index === 1) {
                                allAngle50b += Number(element);
                            }
                            if (index === 2) {
                                allAngle50c += Number(element);
                            }
                            if (index === 3) {
                                allAngle50d += Number(element);
                            }
                        });
                        angle63?.split('/').forEach((element: string, index: number) => {
                            if (index === 0) {
                                allAngle63a += Number(element);
                            }
                            if (index === 1) {
                                allAngle63b += Number(element);
                            }
                            if (index === 2) {
                                allAngle63c += Number(element);
                            }
                            if (index === 3) {
                                allAngle63d += Number(element);
                            }
                        });
                        angle70?.split('/').forEach((element: string, index: number) => {
                            if (index === 0) {
                                allAngle70a += Number(element);
                            }
                            if (index === 1) {
                                allAngle70b += Number(element);
                            }
                            if (index === 2) {
                                allAngle70c += Number(element);
                            }
                            if (index === 3) {
                                allAngle70d += Number(element);
                            }
                        });
                        angle75?.split('/').forEach((element: string, index: number) => {
                            if (index === 0) {
                                allAngle75a += Number(element);
                            }
                            if (index === 1) {
                                allAngle75b += Number(element);
                            }
                            if (index === 2) {
                                allAngle75c += Number(element);
                            }
                            if (index === 3) {
                                allAngle75d += Number(element);
                            }
                        });
                        angle90?.split('/').forEach((element: string, index: number) => {
                            if (index === 0) {
                                allAngle90a += Number(element);
                            }
                            if (index === 1) {
                                allAngle90b += Number(element);
                            }
                            if (index === 2) {
                                allAngle90c += Number(element);
                            }
                            if (index === 3) {
                                allAngle90d += Number(element);
                            }
                        });
                        angle110?.split('/').forEach((element: string, index: number) => {
                            if (index === 0) {
                                allAngle110a += Number(element);
                            }
                            if (index === 1) {
                                allAngle110b += Number(element);
                            }
                            if (index === 2) {
                                allAngle110c += Number(element);
                            }
                            if (index === 3) {
                                allAngle110d += Number(element);
                            }
                        });
                        angle160?.split('/').forEach((element: string, index: number) => {
                            if (index === 0) {
                                allAngle160a += Number(element);
                            }
                            if (index === 1) {
                                allAngle160b += Number(element);
                            }
                            if (index === 2) {
                                allAngle160c += Number(element);
                            }
                            if (index === 3) {
                                allAngle160d += Number(element);
                            }
                        });
                        angle161?.split('/').forEach((element: string, index: number) => {
                            if (index === 0) {
                                allAngle161a += Number(element);
                            }
                            if (index === 1) {
                                allAngle161b += Number(element);
                            }
                            if (index === 2) {
                                allAngle161c += Number(element);
                            }
                            if (index === 3) {
                                allAngle161d += Number(element);
                            }
                        });
                    });

                    return (
                        <Table.Summary.Row>
                            <Table.Summary.Cell colSpan={6} index={1}>合计</Table.Summary.Cell>
                            <Table.Summary.Cell index={2}>
                                <span>{totalProductNum}</span>
                            </Table.Summary.Cell>
                            <Table.Summary.Cell colSpan={2} index={3}>
                                <span>{totalWeight}</span>
                            </Table.Summary.Cell>
                            <Table.Summary.Cell index={4}>
                                <span>{allAngle40a}/{allAngle40b}/{allAngle40c}/{allAngle40d}</span>
                            </Table.Summary.Cell>
                            <Table.Summary.Cell index={5}>
                                <span>{allAngle50a}/{allAngle50b}/{allAngle50c}/{allAngle50d}</span>
                            </Table.Summary.Cell>
                            <Table.Summary.Cell index={6}>
                                <span>{allAngle63a}/{allAngle63b}/{allAngle63c}/{allAngle63d}</span>
                            </Table.Summary.Cell>
                            <Table.Summary.Cell index={6}>
                                <span>{allAngle70a}/{allAngle70b}/{allAngle70c}/{allAngle70d}</span>
                            </Table.Summary.Cell>
                            <Table.Summary.Cell index={6}>
                                <span>{allAngle75a}/{allAngle75b}/{allAngle75c}/{allAngle75d}</span>
                            </Table.Summary.Cell>
                            <Table.Summary.Cell index={6}>
                                <span>{allAngle90a}/{allAngle90b}/{allAngle90c}/{allAngle90d}</span>
                            </Table.Summary.Cell>
                            <Table.Summary.Cell index={6}>
                                <span>{allAngle110a}/{allAngle110b}/{allAngle110c}/{allAngle110d}</span>
                            </Table.Summary.Cell>
                            <Table.Summary.Cell index={6}>
                                <span>{allAngle160a}/{allAngle160b}/{allAngle160c}/{allAngle160d}</span>
                            </Table.Summary.Cell>
                            <Table.Summary.Cell index={6}>
                                <span>{allAngle161a}/{allAngle161b}/{allAngle161c}/{allAngle161d}</span>
                            </Table.Summary.Cell>
                        </Table.Summary.Row>
                    );
                }}
            />
        </DetailContent>
    </Spin>
}