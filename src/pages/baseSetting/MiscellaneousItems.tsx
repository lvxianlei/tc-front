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
    const [visible, setVisible] = useState<boolean>(false);
    const history = useHistory();
    const [form] = useForm()
    const [typeForm] = useForm();
    const [typeVisible, setTypeVisible] = useState<boolean>(false)

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
             key: 'typeName',
             title: '杂项类别',
             width: 200,
             dataIndex: 'typeName'
         },
         {
             key: 'fixType',
             title: '杂项类型',
             dataIndex: 'fixType',
             width: 200
         },
         {
             key: 'measuringUnit',
             title: '杂项类型条目',
             width: 200,
             dataIndex: 'measuringUnit'
         },
         {
             key: 'operation',
             title: '操作',
             dataIndex: 'operation',
             fixed: 'right' as FixedType,
             render: (_: undefined, record: Record<string, any>): React.ReactNode => (
                 <Space direction="horizontal" size="small">
                     {
                     record.isChild ? null : 
                     <Space>
                        <Button type="link" onClick={() => {
                                 Modal.confirm({
                                    title: "编辑",
                                    visible: typeVisible,
            icon: null,
            content: <Form form={typeForm}>
                <Form.Item
                    label="类别"
                    name="factoryId"
                    rules={[{ required: true, message: '请选择类别' }]}>
                    <Select>
                        <Select.Option value={0} key={0}>工时</Select.Option>
                        <Select.Option value={1} key={1}>扣款</Select.Option>
                    </Select>
                </Form.Item>
                <Form.Item
                    label="类型名称"
                    name="factoryId"
                    rules={[{ required: true, message: '请输入类型名称' }]}>
                    <Input maxLength={100}/>
                </Form.Item>
            </Form>,
            onOk: addItemOk,
            onCancel() {
                form.resetFields()
            }
                                 })
                             }}>编辑</Button>
                             <Popconfirm
                                 title="确认删除?"
                                 onConfirm={() => {
                                     RequestUtil.delete(`/tower-science/config/fixItem/${record.id}`).then(res => {
                                         message.success('删除成功');
                                         history.go(0);
                                     });
                                 }}
                                 okText="确认"
                                 cancelText="取消"
                             >
                                 <Button type="link">删除</Button>
                             </Popconfirm>
                     <Button type="link" onClick={() => {
                                 Modal.confirm({
                                    title: "新增条目",
                                    visible: visible,
            icon: null,
            content: <Form form={form}>
                <Form.Item
                    label="条目"
                    name="factoryId"
                    rules={[{ required: true, message: '请输入条目' }]}>
                    <Input/>
                </Form.Item>
            </Form>,
            onOk: addItemOk,
            onCancel() {
                form.resetFields()
            }
                                 })
                             }}>新增条目</Button>
                     </Space>
                     }
                     {
                     record.isChild ?
                         <Space>
                             <Button type="link" onClick={() => {
                                 Modal.confirm({
                                    title: "编辑",
                                    visible: visible,
            icon: null,
            content: <Form form={form}>
                <Form.Item
                    label="条目"
                    name="factoryId"
                    rules={[{ required: true, message: '请输入条目' }]}>
                    <Input/>
                </Form.Item>
            </Form>,
            onOk: addItemOk,
            onCancel() {
                form.resetFields()
            }
                                 })
                             }}>编辑</Button>
                             <Popconfirm
                                 title="确认删除?"
                                 onConfirm={() => {
                                     RequestUtil.delete(`/tower-science/config/fixItem/${record.id}`).then(res => {
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
                         : null
                     }
                 </Space>
             )
         }
     ]
 
     const { loading, data } = useRequest<any>(() => new Promise(async (resole, reject) => {
         try {
             let resData: any[] = await RequestUtil.get(`/tower-science/config/fixItem`);
             resData = resData.map((item: any) => {
                 if (item.fixItemConfigList && item.fixItemConfigList?.length > 0) {
                     return {
                         ...item,
                         isChild: false,
                         children: item?.fixItemConfigList?.map((items: any) => {
                             return {
                                 ...items,
                                 typeId: item.typeId,
                                 isChild: true,
                                 fixItemConfigList: undefined
                             }
                         })
                     }
                 } else {
                     return { ...item, isChild: false, children: undefined }
                 }
             })
             resole(resData);
         } catch (error) {
             reject(error)
         }
     }), {})

     const addItemOk = ()  => new Promise(async (resove, reject) => {
        try {
            form.validateFields().then(res => {
                const data = form.getFieldsValue(true);
                RequestUtil.post(``, data).then(res => {
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
    
    const addTypeOk = ()  => new Promise(async (resove, reject) => {
        try {
            form.validateFields().then(res => {
                const data = form.getFieldsValue(true);
                RequestUtil.post(``, data).then(res => {
                    message.success('保存成功!');
                    history.go(0);
                    setTypeVisible(false)
            resove(true)
                });
            })
        } catch (error) {
            reject(false)
        }
    })
 
     return (
         <Spin spinning={loading}>
             <Button type='primary' onClick={() => {
                                 Modal.confirm({
                                    title: "新增类型",
                                    visible: typeVisible,
            icon: null,
            content: <Form form={typeForm}>
                <Form.Item
                    label="类别"
                    name="factoryId"
                    rules={[{ required: true, message: '请选择类别' }]}>
                    <Select>
                        <Select.Option value={0} key={0}>工时</Select.Option>
                        <Select.Option value={1} key={1}>扣款</Select.Option>
                    </Select>
                </Form.Item>
                <Form.Item
                    label="类型名称"
                    name="factoryId"
                    rules={[{ required: true, message: '请输入类型名称' }]}>
                    <Input maxLength={100}/>
                </Form.Item>
            </Form>,
            onOk: addTypeOk,
            onCancel() {
                typeForm.resetFields()
            }
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