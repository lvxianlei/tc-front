/**
 * @author zyc
 * @copyright © 2022 
 * @description 计划交货期
 */

import React, { useState } from 'react';
import { Button, Modal, DatePicker, Form, Spin, message, Space, Input, Table } from 'antd';
import { CommonTable, DetailContent } from '../../common';
import { FixedType } from 'rc-table/lib/interface';
import { IPlanSchedule } from './IPlanSchedule';
import { useHistory, useParams } from 'react-router-dom';
import useRequest from '@ahooksjs/use-request';
import RequestUtil from '../../../utils/RequestUtil';
import moment from 'moment';

export default function DistributedTech(): React.ReactNode {
    const [visible, setVisible] = useState(false);
    const [visibleChange, setVisibleChange] = useState(false);
    const [dataSource, setDataSorce] = useState<IPlanSchedule[]>([]);
    const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([]);
    const [selectedRows, setSelectedRows] = useState<IPlanSchedule[]>([]);
    const [tableChangeRows, setTableChangeRows] = useState<IPlanSchedule[]>([]);
    const [form] = Form.useForm();
    const [formRef] = Form.useForm();
    const params = useParams<{ ids: string }>();
    const history = useHistory();

    const { loading, data } = useRequest<IPlanSchedule[]>(() => new Promise(async (resole, reject) => {
        try {
            const data: IPlanSchedule[] = await RequestUtil.post(`/tower-aps/productionPlan/issue/detail/plan`, [...params.ids.split(',')]);
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
            key: 'productNumber',
            title: '杆塔号',
            dataIndex: 'productNumber',
            width: 120
        },
        {
            key: 'customerDeliveryTime',
            title: '客户交货日期',
            dataIndex: 'customerDeliveryTime',
            width: 120
        },
        {
            key: 'planDeliveryTime',
            title: '计划交货日期',
            dataIndex: 'planDeliveryTime',
            width: 120,
            format: 'YYYY-MM-DD'
        },
        {
            key: 'reason',
            title: '交货期变更原因',
            dataIndex: 'reason',
            width: 150,
        },
        {
            key: 'operation',
            title: '操作',
            dataIndex: 'operation',
            width: 80,
            fixed: 'right' as FixedType,
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Button type='link' onClick={()=>{history.push(`/planSchedule/planScheduleMngt/planDeliveryTime/${params.ids}/${record.id}`)}}>查看变更记录</Button>
            )
            
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
            const data: IPlanSchedule[] = await RequestUtil.post(`/tower-aps/productionPlan/issue/detail/plan`, [...params.ids.split(',')]);
            setDataSorce(data);
            form.resetFields();
        })
    }
    const modalChangeOk = async () => {
        const data = await formRef.validateFields();
        const value = formRef.getFieldsValue().list;
        RequestUtil.put(`/tower-aps/productionPlan/batch/deliveryTime`, value.map((res:any,index:number) => {
            return {
                id: selectedKeys[index],
                ...res
            }
        })).then(async res => {
            message.success('变更成功！');
            setVisibleChange(false);
            setTableChangeRows([])
            setSelectedKeys([]);
            setSelectedRows([]);
            const data: IPlanSchedule[] = await RequestUtil.post(`/tower-aps/productionPlan/issue/detail/plan`, [...params.ids.split(',')]);
            setDataSorce(data);
            formRef.resetFields();
        })
    }

    return (
        <Spin spinning={loading}>
            <DetailContent operation={[<Button type="ghost" onClick={() => history.goBack()}>返回</Button>]}>
                <Modal
                    title="批量设置计划交货期"
                    visible={visible}
                    onOk={modalOk}
                    onCancel={() => {
                        setVisible(false);
                        form.resetFields();
                    }}
                >
                    <Form form={form}>
                        <Form.Item label="计划交货日期" name="planDeliveryTime" rules={[{
                            required: true,
                            message: '请选择计划交货日期'
                        }]}>
                            <DatePicker disabledDate={(current) => {
                                return current && current < moment(new Date(new Date().getTime() - 1000 * 60 * 60 * 24));
                            }} style={{ width: '100%' }} />
                        </Form.Item>
                    </Form>
                </Modal>
                <Modal
                    title="变更计划交货期"
                    visible={visibleChange}
                    onOk={modalChangeOk}
                    onCancel={() => {
                        setVisibleChange(false);
                        formRef.resetFields();
                    }}
                    width={'80%'}
                >
                    <Form form={formRef} >
                        <Table columns={[
                            {
                                key: 'productCategoryName',
                                title: '塔型',
                                dataIndex: 'productCategoryName',
                                width: 120,
                                render:  (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                                    <Form.Item name={ ["list", index, "productCategoryName"] } key={ index } initialValue={ _ }>
                                        <span>{_}</span>
                                    </Form.Item>
                                ) 
                            },
                            {
                                key: 'productNumber',
                                title: '杆塔号',
                                dataIndex: 'productNumber',
                                width: 120,
                                render:  (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                                    <Form.Item name={ ["list", index, "productNumber"] } key={ index }>
                                        <span>{_}</span>
                                    </Form.Item>
                                ) 
                            },
                            {
                                key: 'planDeliveryTime',
                                title: '* 计划交货日期',
                                dataIndex: 'planDeliveryTime',
                                width: 120,
                                render:  (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                                    <Form.Item name={ ["list", index, "newPlanDeliveryTime"] } key={ index } rules={[{
                                        required:true,
                                        message:'请选择计划交货日期'
                                    }]}>
                                        <DatePicker format='YYYY-MM-DD' style={{ width: '100%' }}/>
                                    </Form.Item>
                                ) 
                            },
                            {
                                key: 'reason',
                                title: '* 交货期变更原因',
                                dataIndex: 'reason',
                                width: 150,
                                render:  (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                                    <Form.Item name={ ["list", index, "reason"] } key={ index } rules={[{
                                        required:true,
                                        message:'请填写交货期变更原因'
                                    }]}>
                                        <Input maxLength={ 50 }/>
                                    </Form.Item>
                                ) 
                            },
                        ]} dataSource={[...tableChangeRows]} pagination={false} size='small'/>
                    </Form>
                </Modal>
                <Space>
                    <Button type="primary" disabled={selectedKeys.length <= 0 || selectedRows.some((res)=>{
                        if(res.planDeliveryTime) return true;
                    })} onClick={() => setVisible(true)} style={{ marginBottom: '6px' }}>批量设置交货期</Button>
                    <Button type="primary" disabled={selectedKeys.length <= 0 || selectedRows.some((res)=>{
                        if(!res.planDeliveryTime) return true;
                    })} onClick={
                        () => {
                            console.log(selectedRows)
                            const value:any = selectedRows.map((res)=>{
                                return {
                                    ...res,
                                    newPlanDeliveryTime: res.planDeliveryTime && moment(res.planDeliveryTime)
                                }
                            })
                            formRef.setFieldsValue({
                                list: value
                            })
                            setTableChangeRows(value)
                            setVisibleChange(true);
                            
                        }
                    } style={{ marginBottom: '6px' }}>变更计划交货期</Button>
                </Space>
                <CommonTable
                    scroll={{ x: '700' }}
                    rowKey="productId"
                    dataSource={dataSource}
                    pagination={false}
                    columns={columns}
                    rowSelection={{
                        selectedRowKeys: selectedKeys,
                        onChange: SelectChange,
                        // getCheckboxProps: (record: Record<string, any>) => ({
                        //     disabled: record.planDeliveryTime
                        // })
                    }}
                />
            </DetailContent>
        </Spin>
    )
}