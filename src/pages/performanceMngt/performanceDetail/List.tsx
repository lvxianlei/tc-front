/**
 * @author zyc
 * @copyright © 2022 
 * @description 绩效管理-绩效奖励明细
 */

import React, { useState } from 'react';
import { Space, Input, DatePicker, Button, Form, Modal, message, Row, Col } from 'antd';
import styles from './PerformanceDetail.module.less';
import RequestUtil from '../../../utils/RequestUtil';
import { CommonTable } from '../../common';
import useRequest from '@ahooksjs/use-request';
import RewardDetailsConfiguration from './RewardDetailsConfiguration';
import { FixedType } from 'rc-table/lib/interface';
import { useHistory } from 'react-router-dom';
import { columns, detailColumns } from './performanceDetail.json'
import moment from 'moment';

export default function List(): React.ReactNode {
    const [detailData, setDetailData] = useState<any>();
    const [form] = Form.useForm();
    const [filterValues, setFilterValues] = useState<Record<string, any>>();
    const [visible, setVisible] = useState<boolean>(false);
    const [description, setDescription] = useState<string>('');
    const history = useHistory();

    const { loading, data, run } = useRequest<any[]>((filterValue: Record<string, any>) => new Promise(async (resole, reject) => {
        const lastMonth = new Date().getMonth() > 0 ? new Date().getFullYear() + '-' + new Date().getMonth() : (new Date().getFullYear() - 1) + '-12'
        const data: any = await RequestUtil.get<any>(`/tower-science/performance/reward`, { monthDate: lastMonth, ...filterValue });
        if (data.length > 0 && data[0]?.id) {
            detailRun(data[0]?.id)
        } else {
            setDetailData([]);
        }
        setFilterValues({
            monthDate: filterValue?.monthDate ? filterValue?.monthDate : lastMonth
        })
        form.setFieldsValue({
            monthDate: moment(filterValue?.monthDate ? filterValue?.monthDate : lastMonth)
        })
        resole(data);
    }), {})

    const { run: detailRun } = useRequest<any>((id: string) => new Promise(async (resole, reject) => {
        try {
            const result = await RequestUtil.get<any>(`/tower-science/performance/reward/${id}`);
            setDetailData(result);
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    const onRowChange = async (record: Record<string, any>) => {
        detailRun(record.id)
    }

    const onSearch = (values: Record<string, any>) => {
        if (values.monthDate) {
            values.monthDate = values.monthDate.format("YYYY-MM");
        }
        setFilterValues(values);
        run({ ...values });
    }

    return <>
        <Modal
            destroyOnClose
            key='ApplyTrial'
            visible={visible}
            title={'奖励明细配置'}
            footer={
                <Button onClick={() => {
                    setVisible(false);
                }}>关闭</Button>}
            width="95%"
            onCancel={() => {
                setVisible(false);
            }}>
            <RewardDetailsConfiguration />
        </Modal>
        <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
            <Form form={form} layout="inline" onFinish={onSearch} onReset={() => {
                setFilterValues({})
            }}>
                <Form.Item label='日期' name="monthDate">
                    <DatePicker picker="month" />
                </Form.Item>
                <Form.Item>
                    <Space direction="horizontal">
                        <Button type="primary" htmlType="submit">搜索</Button>
                        <Button htmlType="reset">重置</Button>
                    </Space>
                </Form.Item>
            </Form>
            <Button type='primary' onClick={() => setVisible(true)} ghost>奖励条目配置</Button>
            <Space><span>{filterValues?.monthDate?.split('-')[0] || '**'}年{filterValues?.monthDate?.split('-')[1] || '**'}月</span>奖励明细</Space>
            <CommonTable
                haveIndex
                columns={[
                    ...columns,
                    {
                        key: 'operation',
                        title: '操作',
                        dataIndex: 'operation',
                        fixed: 'right' as FixedType,
                        width: 80,
                        render: (_: undefined, record: Record<string, any>): React.ReactNode => (
                            <Button type="link" onClick={() => {
                                Modal.confirm({
                                    title: "编辑",
                                    icon: null,
                                    okText: '保存',
                                    content: <Row>
                                        <Col span={4}>备注</Col>
                                        <Col span={20}>
                                            <Input.TextArea defaultValue={record?.description} onChange={(e) => {
                                                console.log(e)
                                                setDescription(e?.target.value)
                                            }} maxLength={300} />
                                        </Col>
                                    </Row>,
                                    onOk: () => new Promise(async (resolve, reject) => {
                                        try {
                                            console.log(description)
                                            RequestUtil.post<any>(`/tower-science/performance/reward`, {
                                                description: description,
                                                id: record?.id
                                            }).then(res => {
                                                message.success('编辑成功');
                                                history.go(0)
                                                resolve(true)
                                            })
                                        } catch (error) {
                                            reject(false)
                                        }
                                    }),
                                    onCancel() {
                                        setDescription('')
                                    }
                                })
                            }}>编辑</Button>
                        )
                    }
                ]}
                dataSource={data}
                pagination={false}
                onRow={(record: Record<string, any>) => ({
                    onClick: () => onRowChange(record),
                    className: styles.tableRow
                })}
            />
            <Space><span>奖励条目</span><span>奖励明细</span></Space>
            <CommonTable
                haveIndex
                columns={detailColumns}
                dataSource={detailData || []}
                pagination={false} />
        </Space>
    </>
}