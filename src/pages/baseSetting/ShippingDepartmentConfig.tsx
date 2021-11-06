
/**
 * @author zyc
 * @copyright © 2021 
 * @description 成品库配置
 */

import React, { useState } from 'react';
import { Space, Input, Button, Modal, Form, Table, Popconfirm, message, Row, Col } from 'antd';
import { CommonTable, DetailTitle, Page } from '../common';
import { FixedType } from 'rc-table/lib/interface';
import RequestUtil from '../../utils/RequestUtil';
import { useForm } from 'antd/es/form/Form';
import styles from './ProcessMngt.module.less';

interface IProcessList {
    readonly time?: string;
    readonly atime?: string;
}
export default function ShippingDepartmentConfig(): React.ReactNode {
    const columns = [
        {
            key: 'index',
            title: '序号',
            dataIndex: 'index',
            width: 80,
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (<span>{ index + 1 }</span>)
        },
        {
            key: 'taskNum',
            title: '仓库编号',
            width: 150,
            dataIndex: 'taskNum'
        },
        {
            key: 'internalNumber',
            title: '仓库名称',
            dataIndex: 'internalNumber',
            width: 120
        },
        {
            key: 'name',
            title: '仓库类型',
            width: 200,
            dataIndex: 'name'
        },
        {
            key: 'name',
            title: '负责人',
            width: 200,
            dataIndex: 'name'
        },
        {
            key: 'name',
            title: '保管员',
            width: 200,
            dataIndex: 'name'
        },
        {
            key: 'operation',
            title: '操作',
            dataIndex: 'operation',
            fixed: 'right' as FixedType,
            width: 300,
            render: (_: undefined, record: Record<string, any>): React.ReactNode => (
                <Space direction="horizontal" size="small">
                    <Button type="link" onClick={ () => {
                        getList();
                        setVisible(true);
                        setTitle('编辑');
                    } }>编辑</Button>
                    <Popconfirm
                        title="确认删除?"
                        onConfirm={ () => {
                            RequestUtil.post(``).then(res => {
                                message.success('删除成功');
                                setRefresh(!refresh);
                            });
                        } }
                        okText="确认"
                        cancelText="取消"
                    >
                        <Button type="link">删除</Button>
                    </Popconfirm>
                </Space>
            )
        }
    ]

    const userColumns = [
        {
            key: 'time',
            title: '职位',
            dataIndex: 'time'
        },
        {
            key: 'time',
            title: '姓名',
            dataIndex: 'time'
        },
        {
            key: 'operation',
            title: '操作',
            dataIndex: 'operation',
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Space direction="horizontal" size="small">
                    <Popconfirm
                        title="确认删除?"
                        onConfirm={ () => delUserRow(index) }
                        okText="确认"
                        cancelText="取消"
                    >
                        <Button type="link">删除</Button>
                    </Popconfirm>
                </Space>
            )
        }
    ]

    const tableColumns = [
        {
            key: 'index',
            title: '序号',
            dataIndex: 'index',
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (<span>{ index + 1 }</span>)
        },
        {
            key: 'time',
            title: '库区',
            dataIndex: 'time',
            render:  (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Form.Item name={ ["data", index, "time"] } initialValue={ _ } rules={[{ 
                    "required": true,
                    "message": "请输入工序" }]}>
                    <Input maxLength={ 50 } key={ index } bordered={false} />
                </Form.Item>
            )  
        },
        {
            key: 'time',
            title: '库位',
            dataIndex: 'time',
            render:  (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Form.Item name={ ["data", index, "time"] } initialValue={ _ } rules={[{ 
                    "required": true,
                    "message": "请输入顺序" }]}>
                    <Input type="number" min={ 1 } key={ index } bordered={false} />
                </Form.Item>
            )  
        },
        {
            key: 'operation',
            title: '操作',
            dataIndex: 'operation',
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Space direction="horizontal" size="small">
                    <Popconfirm
                        title="确认删除?"
                        onConfirm={ () => delRow(index) }
                        okText="确认"
                        cancelText="取消"
                    >
                        <Button type="link">删除</Button>
                    </Popconfirm>
                </Space>
            )
        }
    ]

    const save = () => {
        form.validateFields().then(res => {
            console.log(form.getFieldsValue(true));
        })
    }

    const cancel = () => {
        setVisible(false);
        form.resetFields();
    }

    const addRow = () => {
        let reservoirListValues = form.getFieldsValue(true).data || [];
        let newData = {
            time: '',
            atime: ''
        }
        setReservoirList([...reservoirListValues, newData]);
        form.setFieldsValue({ data: [...reservoirListValues, newData] })
    }

    const delRow = (index: number) => {
        let reservoirListValues = form.getFieldsValue(true).data || []; 
        reservoirListValues.splice(index, 1);
        setReservoirList([...reservoirListValues]);
        form.setFieldsValue({ data: [...reservoirListValues] })
    }

    const getList = async () => {
        const data = await RequestUtil.post<IProcessList[]>(``);
        setReservoirList(data);
    }

    const delUserRow = (index: number) => {
        userList.splice(index, 1);
        setUserList([...userList]);
    }

    const [ refresh, setRefresh ] = useState(false);
    const [ visible, setVisible ] = useState(false);
    const [ form ] = useForm();
    const [ reservoirList, setReservoirList ] = useState<IProcessList[]>([]);
    const [ title, setTitle ] = useState('新增');
    const [ userList, setUserList ] = useState([]);
    return (
        <>
            <Page
                path="/tower-science/loftingList/loftingPage"
                columns={ columns }
                headTabs={ [] }
                extraOperation={ <Button type="primary" onClick={ () => setVisible(true) } ghost>新增</Button> }
                refresh={ refresh }
                searchFormItems={ [
                    {
                        name: 'fuzzyMsg',
                        label: '',
                        children: <Input placeholder="输入仓库名称/仓库类型进行查询"/>
                    }
                ] }
                onFilterSubmit = { (values: Record<string, any>) => {
                    return values;
                } }
            />
            <Modal visible={ visible } width="40%" title={ title } okText="保存" cancelText="取消" onOk={ save } onCancel={ cancel }>
                <Form form={ form } labelCol={{ span: 6 }}>
                    <DetailTitle title="基础信息"/>
                    <Row>
                        <Col span={ 12 }>
                            <Form.Item name="dept" label="仓库编号" rules={[{
                                    "required": true,
                                    "message": "请输入仓库编号"
                                }]}>
                                <Input maxLength={ 50 }/>
                            </Form.Item>
                        </Col>
                        <Col span={ 12 }>
                            <Form.Item name="dept" label="仓库名称" rules={[{
                                    "required": true,
                                    "message": "请输入仓库名称"
                                }]}>
                                <Input maxLength={ 50 }/>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={ 12 }>
                            <Form.Item name="dept" label="仓库类型" rules={[{
                                    "required": true,
                                    "message": "请输入仓库类型"
                                }]}>
                                <Input maxLength={ 50 }/>
                            </Form.Item>
                        </Col>
                        <Col span={ 12 }>
                            <Form.Item name="dept" label="负责人" rules={[{
                                    "required": true,
                                    "message": "请选择负责人"
                                }]}>
                                
                            </Form.Item>
                        </Col>
                    </Row>
                    <DetailTitle title="保管员" operation={[<Button type="primary" onClick={ () => {} }>选择保育员</Button>]}/>
                    <CommonTable columns={userColumns} dataSource={userList} showHeader={false} pagination={false} />
                    <DetailTitle title="库区库位信息"/>
                    <Button type="primary" onClick={ addRow }>添加行</Button>
                    <Table rowKey="index" dataSource={[...reservoirList]} pagination={false} columns={tableColumns} className={styles.addModal}/>
                </Form>
            </Modal>
        </>
    )
}