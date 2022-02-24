/**
 * @author zyc
 * @copyright © 2022 
 * @description 计划交货期
 */

import React, { useState } from 'react';
import { Button, Modal, DatePicker, Form, Spin, message } from 'antd';
import { CommonTable, DetailContent } from '../../common';
import { FixedType } from 'rc-table/lib/interface';
import { IPlanSchedule } from './IPlanSchedule';
import { useParams } from 'react-router-dom';
import useRequest from '@ahooksjs/use-request';
import RequestUtil from '../../../utils/RequestUtil';

export default function DistributedTech(): React.ReactNode {
    const [visible, setVisible] = useState(false);
    const [dataSource, setDataSorce] = useState<IPlanSchedule[]>([]);
    const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([]);
    const [selectedRows, setSelectedRows] = useState<IPlanSchedule[]>([]);
    const [form] = Form.useForm();
    const params = useParams<{ ids: string }>()

    const { loading, data } = useRequest<IPlanSchedule[]>(() => new Promise(async (resole, reject) => {
        try {
            const data: IPlanSchedule[] = await RequestUtil.post(`/tower-aps/productionPlan/issue/detail`, [...params.ids.split(',')]);
            setDataSorce(data)
            resole(data)
        } catch (error) {
            reject(error)
        }
    }), { refreshDeps: [] })

    const columns = [
        {
            key: 'planNumber',
            title: '计划号',
            width: 150,
            dataIndex: 'planNumber',
            fixed: 'left' as FixedType
        },
        {
            key: 'productCategoryName',
            title: '塔型',
            dataIndex: 'productCategoryName',
            width: 120,
            fixed: 'left' as FixedType
        },
        {
            key: 'productTypeName',
            title: '杆塔号',
            dataIndex: 'productTypeName',
            width: 120
        },
        {
            key: 'deliveryTime',
            title: '客户交货日期',
            dataIndex: 'deliveryTime',
            width: 120
        },
        {
            key: 'planDeliveryTime',
            title: '计划交货日期',
            dataIndex: 'planDeliveryTime',
            width: 120,
            format: 'YYYY-MM-DD'
        }
    ]

    const SelectChange = (selectedRowKeys: React.Key[], selectedRows: IPlanSchedule[]): void => {
        setSelectedKeys(selectedRowKeys);
        setSelectedRows(selectedRows);
    }

    const modalOk = async () => {
        const data = await form.validateFields();
        RequestUtil.post(`/tower-aps/productionPlan/batch/delivery/time`, selectedKeys.map(res => {
            return {
                id: res,
                planDeliveryTime: data.planDeliveryTime.format('YYYY-MM-DD')
            }
        })).then(async res => {
            message.success('批量设置计划交货期成功');
            setVisible(false);
            setSelectedKeys([]);
            setSelectedRows([]);
            const data: IPlanSchedule[] = await RequestUtil.post(`/tower-aps/productionPlan/issue/detail`, [...params.ids.split(',')]);
            setDataSorce(data);
        })
    }

    return (
        <Spin spinning={loading}>
            <DetailContent>
                <Modal
                    title="批量设置计划交货期"
                    visible={visible}
                    onOk={modalOk}
                    onCancel={() => {
                        setVisible(false)
                    }}
                >
                    <Form form={form}>
                        <Form.Item label="计划交货日期" name="planDeliveryTime" rules={[{
                            required: true,
                            message: '请选择计划交货日期'
                        }]}>
                            <DatePicker style={{ width: '100%' }} />
                        </Form.Item>
                    </Form>
                </Modal>
                <Button type="primary" disabled={selectedKeys.length <= 0} onClick={() => setVisible(true)} style={{ marginBottom: '6px' }}>批量设置交货期</Button>
                <CommonTable
                    scroll={{ x: '700' }}
                    rowKey="productId"
                    dataSource={dataSource}
                    pagination={false}
                    columns={columns}
                    rowSelection={{
                        selectedRowKeys: selectedKeys,
                        onChange: SelectChange,
                        getCheckboxProps: (record: Record<string, any>) => ({
                            disabled: record.planDeliveryTime
                        })
                    }}
                />
            </DetailContent>
        </Spin>
    )
}