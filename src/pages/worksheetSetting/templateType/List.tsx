/**
 * @author zyc
 * @copyright © 2022
 * @description 工单设置-模板类型
 */

import React, { useEffect, useRef, useState } from 'react';
import { Space, Button, Popconfirm, message, Spin, Modal, Form, Input } from 'antd';
import { CommonTable } from '../../common';
import { FixedType } from 'rc-table/lib/interface';
import useRequest from '@ahooksjs/use-request';
import { useHistory } from 'react-router-dom';
import RequestUtil from '@utils/RequestUtil';
import { useForm } from 'antd/lib/form/Form';

export interface EditRefProps {
    onSubmit: () => void
    resetFields: () => void
}

export default function ItemRepair(): React.ReactNode {
    const [visible, setVisible] = useState<boolean>(false);
    const [type, setType] = useState<'edit' | 'new'>('new');
    const [form] = useForm();
    const history = useHistory();
    const [confirmLoading, setConfirmLoading] = useState<boolean>(false);
    
    useEffect(() => {
        setConfirmLoading(confirmLoading);
    }, [confirmLoading])

    const { loading, data } = useRequest<any>(() => new Promise(async (resole, reject) => {
        try {
            let resData: any = await RequestUtil.get(`/tower-work/template/type`);
            const newData = await traversalTree(resData, [])
            console.log(newData)
            resole(newData);
        } catch (error) {
            reject(error)
        }
    }), {})

    const traversalTree = (arrs: any, that: any) => {
        arrs.map((item: any, index: number) => {
            that && that.push({
                [item.level]: item.name,
                code: item.code,
                id: item.id,
                level: item.level,
                description: item.description,
                children: [],
            })
            if (item?.children && item?.children.length > 0) {
                traversalTree(item.children, that[index].children)
            } else {
                that[index].children = undefined;
            }
        })
        return that;
    }


    const { data: columns } = useRequest<any>(() => new Promise(async (resole, reject) => {
        try {
            const resData: any[] = await RequestUtil.get(`/tower-work/template/type/level`);
            const newResData = [
                {
                    key: 'code',
                    title: '模板编号',
                    width: 200,
                    dataIndex: 'code'
                },
                ...resData.map(res => {
                    return {
                        key: res?.level,
                        title: res?.name,
                        width: 200,
                        dataIndex: res?.level
                    }
                }),
                {
                    key: 'description',
                    title: '备注',
                    width: 200,
                    dataIndex: 'description'
                }
            ]
            resole(newResData);
        } catch (error) {
            reject(error)
        }
    }), {})

    const handleOk = () => new Promise(async (resove, reject) => {
        try {
            form.validateFields().then(res => {
                setConfirmLoading(true)
                const data = form.getFieldsValue(true);
                RequestUtil.post(`/tower-work/template/type`, data).then(res => {
                    setVisible(false);
                    message.success('保存成功！')
                    history.go(0)
                    setConfirmLoading(false)
                    resove(true)
                }).catch(e => {
                    setConfirmLoading(false)
                    reject(false)
                })
            })
        } catch (error) {
            reject(false)
        }
    })

    return (
        <Spin spinning={loading}>
            <Modal
                destroyOnClose
                key='add'
                visible={visible}
                title={type === 'new' ? '新增' : '编辑'}
                onOk={handleOk}
                confirmLoading={confirmLoading}
                onCancel={() => {
                    setVisible(false);
                    form.resetFields();
                }}>
                <Form form={form}>
                    <Form.Item name="name" label="名称" rules={[{
                        required: true,
                        message: '请输入名称'
                    }]}>
                        <Input maxLength={50} />
                    </Form.Item>
                    <Form.Item name="description" label="备注">
                        <Input.TextArea maxLength={300} />
                    </Form.Item>
                </Form>
            </Modal>
            <Button type='primary' style={{ marginBottom: '16px' }} onClick={() => {
                setVisible(true);
                setType('new');
            }} ghost>添加一级分类</Button>
            <CommonTable
                columns={[...(columns || []),
                {
                    key: 'operation',
                    title: '操作',
                    dataIndex: 'operation',
                    fixed: 'right' as FixedType,
                    render: (_: undefined, record: Record<string, any>): React.ReactNode => (
                        <Space direction="horizontal" size="small">
                            <Button type="link" onClick={() => {
                                setType('edit');
                                setVisible(true);
                                console.log(record?.level, record[record?.level])
                                form.setFieldsValue({
                                    ...record,
                                    name: record[record?.level]
                                })
                            }}>编辑</Button>
                            <Button type="link" onClick={() => {
                                setType('new');
                                setVisible(true);
                                form.setFieldsValue({
                                    parentId: record?.id
                                })
                            }}>添加子分类</Button>
                            <Popconfirm
                                title="确认删除?"
                                onConfirm={() => {
                                    RequestUtil.delete(`/tower-work/template/type/${record.id}`).then(res => {
                                        message.success('删除成功');
                                        history.go(0);
                                    });
                                }}
                                okText="确认"
                                cancelText="取消"
                            >
                                <Button type="link">删除</Button>
                            </Popconfirm>
                        </Space>
                    )
                }]}
                dataSource={data || []}
                pagination={false}
            />
        </Spin>
    )
}