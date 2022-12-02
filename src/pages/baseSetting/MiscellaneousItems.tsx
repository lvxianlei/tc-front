/**
 * @author zyc
 * @copyright © 2022
 * @description 系统设置-杂项条目配置
 */

import React, { useState } from 'react';
import { Space, Button, Popconfirm, message, Spin, Modal, Form, Input, Select } from 'antd';
import { CommonTable } from '../common';
import { FixedType } from 'rc-table/lib/interface';
import RequestUtil from '../../utils/RequestUtil';
import useRequest from '@ahooksjs/use-request';
import { useHistory } from 'react-router-dom';
import { useForm } from 'antd/es/form/Form';

export interface EditRefProps {
    onSubmit: () => void
    resetFields: () => void
}

export default function List(): React.ReactNode {
    const [typeForm] = useForm();
    const [visible, setVisible] = useState<boolean>(false);
    const [type, setType] = useState<'new' | 'edit'>('new');
    const history = useHistory();
    const [form] = useForm()
    const [itemVisible, setItemVisible] = useState<boolean>(false)
    const [itemType, setItemType] = useState<'new' | 'edit'>('new');

    const columns = [
        {
            key: 'index',
            title: '序号',
            dataIndex: 'index',
            width: 50,
            fixed: "left" as FixedType,
            render: (_a: any, _b: any, index: number): React.ReactNode => (<span>{index + 1}</span>)
        },
        {
            key: 'name',
            title: '杂项类别',
            width: 200,
            dataIndex: 'name'
        },
        {
            key: 'miscellaneousTypes',
            title: '杂项类型',
            dataIndex: 'miscellaneousTypes',
            width: 200
        },
        {
            key: 'miscellaneousTypeEntries',
            title: '杂项类型条目',
            width: 200,
            dataIndex: 'miscellaneousTypeEntries'
        },
        {
            key: 'operation',
            title: '操作',
            dataIndex: 'operation',
            fixed: 'right' as FixedType,
            render: (_: undefined, record: Record<string, any>): React.ReactNode => (
                <Space direction="horizontal" size="small">
                    {
                        record?.childLevel === 0 ?
                            <Button type='link' onClick={() => {
                                setVisible(true);
                                setType('new');
                                typeForm.setFieldsValue({
                                    level: 1,
                                    parentId: record?.name
                                })
                            }}>新增类型</Button>
                            :
                            record?.childLevel === 1 ?
                                <Space >
                                    <Button type="link" onClick={() => {
                                        typeForm.setFieldsValue({
                                            level: 1,
                                            parentId: record?.name,
                                            name: record?.miscellaneousTypes,
                                            id: record?.id
                                        })
                                        setVisible(true);
                                        setType('edit')
                                    }}>编辑</Button>
                                    <Popconfirm
                                        title="确认删除?"
                                        onConfirm={() => {
                                            RequestUtil.delete(`/tower-science/sundryConfig?id=${record?.id}`).then(res => {
                                                message.success('删除成功');
                                                history.go(0);
                                            });
                                        }}
                                        okText="确认"
                                        cancelText="取消"
                                    >
                                        <Button type="link">删除</Button>
                                    </Popconfirm>
                                    <Button type='link' onClick={() => {
                                        setItemVisible(true)
                                        setItemType('new')
                                        form.setFieldsValue({
                                            level: 2,
                                            parentId: record?.id
                                        })
                                    }}>新增条目</Button>
                                </Space>
                                :
                                <Space >
                                    <Button type="link" onClick={() => {
                                        setItemType('edit')
                                        setItemVisible(true)
                                        form.setFieldsValue({
                                            level: 2,
                                            parentId: record?.parentId,
                                            name: record?.miscellaneousTypeEntries,
                                            id: record?.id
                                        })
                                    }}>编辑</Button>
                                    <Popconfirm
                                        title="确认删除?"
                                        onConfirm={() => {
                                            RequestUtil.delete(`/tower-science/sundryConfig?id=${record?.id}`).then(res => {
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
                    }
                </Space>
            )
        }
    ]

    const { loading, data } = useRequest<any>(() => new Promise(async (resole, reject) => {
        try {
            let resData: any[] = await RequestUtil.get(`/tower-science/sundryConfig`);
            resData = resData.map((item: any) => {
                if (item.sundryConfigVOList && item.sundryConfigVOList?.length > 0) {
                    return {
                        ...item,
                        childLevel: 1,
                        children: item?.sundryConfigVOList?.map((items: any) => {
                            return {
                                ...items,
                                miscellaneousTypes: item.name,
                                sundryConfigVOS: item?.sundryConfigVOS ? item?.sundryConfigVOS?.map(((res: any) => {
                                    return {
                                        ...res,
                                        childLevel: 2,
                                        miscellaneousTypeEntries: res?.name,
                                        children: undefined
                                    }
                                })) : undefined
                            }
                        })
                    }
                } else {
                    return { ...item, childLevel: 0, children: undefined }
                }
            })
            resole(resData);
        } catch (error) {
            reject(error)
        }
    }), {})

    const addItemOk = () => new Promise(async (resove, reject) => {
        try {
            form.validateFields().then(res => {
                const data = form.getFieldsValue(true);
                RequestUtil.post(``, data).then(res => {
                    message.success('保存成功!');
                    history.go(0);
                    setItemVisible(false)
                    resove(true)
                });
            })
        } catch (error) {
            reject(false)
        }
    })

    const addTypeOk = () => new Promise(async (resove, reject) => {
        try {
            typeForm.validateFields().then(res => {
                const data = typeForm.getFieldsValue(true);
                // level = 1
                RequestUtil.post(`/tower-science/sundryConfig`, data).then(res => {
                    message.success('保存成功!');
                    history.go(0);
                    setVisible(false)
                    resove(true)
                });
            })
        } catch (error) {
            reject(false)
        }
    })

    return (
        <Spin spinning={loading}>
            <Modal
                visible={visible}
                title={type === 'new'? "新增类型": "编辑类型"}
                okText="保存"
                onOk={addTypeOk}
                onCancel={() => {
                    setVisible(false);
                    typeForm.resetFields();
                }}
            >
                <Form form={typeForm}>
                    <Form.Item
                        label="类别"
                        name="parentId"
                        rules={[{ required: true, message: '请选择类别' }]}>
                        <Select>
                            <Select.Option value={'工时'} key={0}>工时</Select.Option>
                            <Select.Option value={'扣款'} key={1}>扣款</Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item
                        label="类型名称"
                        name="name"
                        rules={[{ required: true, message: '请输入类型名称' }]}>
                        <Input maxLength={100} />
                    </Form.Item>
                </Form>
            </Modal>
            <Modal
                visible={itemVisible}
                title={itemType === 'new' ? '新增条目' : '编辑条目'}
                okText="保存"
                onOk={addItemOk}
                onCancel={() => {
                    setItemVisible(false)
                    form?.resetFields();
                }}
            >
                <Form form={form}>
                    <Form.Item
                        label="条目"
                        name="name"
                        rules={[{ required: true, message: '请输入条目' }]}>
                        <Input maxLength={100} />
                    </Form.Item>
                </Form>
            </Modal>
            <Button type='primary' onClick={() => {
                setType('new');
                setVisible(true);
                typeForm.setFieldsValue({
                    level: 1
                })
            }} ghost>新增类型</Button>
            <CommonTable
                columns={columns}
                dataSource={data}
                pagination={false}
            />
        </Spin>
    )
}