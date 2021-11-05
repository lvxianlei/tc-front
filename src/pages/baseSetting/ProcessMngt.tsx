
/**
 * @author zyc
 * @copyright © 2021 
 * @description 工序管理
 */

import React, { useState } from 'react';
import { Space, Input, Button, Modal, Select, Form, Table, Popconfirm, message } from 'antd';
import { Page } from '../common';
import { FixedType } from 'rc-table/lib/interface';
import RequestUtil from '../../utils/RequestUtil';
import { useForm } from 'antd/es/form/Form';
import styles from './ProcessMngt.module.less';

interface IProcessList {
    readonly time?: string;
    readonly atime?: string;
}
export default function ProcessMngt(): React.ReactNode {
    const columns = [
        {
            key: 'taskNum',
            title: '所属部门',
            width: 150,
            dataIndex: 'taskNum'
        },
        {
            key: 'internalNumber',
            title: '制单人',
            dataIndex: 'internalNumber',
            width: 120
        },
        {
            key: 'name',
            title: '制单时间',
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

    const tableColumns = [
        {
            key: 'index',
            title: '序号',
            dataIndex: 'index',
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (<span>{ index + 1 }</span>)
        },
        {
            key: 'time',
            title: '工序',
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
            title: '顺序',
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
        },
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
        let processListValues = form.getFieldsValue(true).data || [];
        let newData = {
            time: '',
            atime: ''
        }
        setProcessList([...processListValues, newData]);
        form.setFieldsValue({ data: [...processListValues, newData] })
    }

    const delRow = (index: number) => {
        let processListValues = form.getFieldsValue(true).data || []; 
        processListValues.splice(index, 1);
        setProcessList([...processListValues]);
        form.setFieldsValue({ data: [...processListValues] })
    }

    const getList = async () => {
        const data = await RequestUtil.post<IProcessList[]>(``);
        setProcessList(data);
    }

    const [ refresh, setRefresh ] = useState(false);
    const [ visible, setVisible ] = useState(false);
    const [ form ] = useForm();
    const [ processList, setProcessList ] = useState<IProcessList[]>([]);
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
                        children: <Input placeholder="请输入部门名称进行查询"/>
                    }
                ] }
                onFilterSubmit = { (values: Record<string, any>) => {
                    return values;
                } }
            />
            <Modal visible={ visible } width="40%" title="按车间设置工序顺序" okText="保存" cancelText="取消" onOk={ save } onCancel={ cancel }>
                <Form form={ form }>
                <Form.Item name="dept" label="所属车间" rules={[{
                        "required": true,
                        "message": "请选择所属车间"
                    }]}>
                        <Select placeholder="请选择" onChange={ (e) => {
                            console.log(e)
                        } }>
                            <Select.Option value={ 1 } key="4">全部</Select.Option>
                            <Select.Option value={ 2 } key="">全部222</Select.Option>
                        </Select>
                </Form.Item>
                <Button type="primary" onClick={ addRow }>新增一行</Button>
                <Table rowKey="index" dataSource={[...processList]} pagination={false} columns={tableColumns} className={styles.addModal}/>
                </Form>
            </Modal>
        </>
    )
}