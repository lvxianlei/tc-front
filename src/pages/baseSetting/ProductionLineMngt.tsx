/**
 * @author zyc
 * @copyright © 2021 
 * @description 产线管理
 */

import React, { useState } from 'react';
import { Space, Input, Button, Modal, Select, Form, Popconfirm, message } from 'antd';
import { Page } from '../common';
import { FixedType } from 'rc-table/lib/interface';
import RequestUtil from '../../utils/RequestUtil';
import { useForm } from 'antd/es/form/Form';

interface IDetailData {
    readonly time?: string;
    readonly name?: string;
    readonly atime?: string;
}
export default function ProductionLineMngt(): React.ReactNode {
    const columns = [
        {
            key: 'index',
            title: '序号',
            dataIndex: 'index',
            width: 100,
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (<span>{ index + 1 }</span>)
        },
        {
            key: 'taskNum',
            title: '产线名称',
            width: 150,
            dataIndex: 'taskNum'
        },
        {
            key: 'internalNumber',
            title: '所属车间',
            dataIndex: 'internalNumber',
            width: 120
        },
        {
            key: 'name',
            title: '所属工序',
            width: 200,
            dataIndex: 'name'
        },
        {
            key: 'name',
            title: '备注',
            width: 200,
            dataIndex: 'name'
        },
        {
            key: 'name',
            title: '制单人',
            width: 200,
            dataIndex: 'name'
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
                        setVisible(true);
                        setTitle("编辑");
                        setDetailData({name: 'aaaa'});
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

    const save = () => {
        form.validateFields().then(res => {
            console.log(form.getFieldsValue(true));
        })
    }

    const cancel = () => {
        setVisible(false);
        form.resetFields();
    }

    const getList = async () => {
        const data = await RequestUtil.post<IDetailData[]>(``);
    }

    const [ refresh, setRefresh ] = useState(false);
    const [ visible, setVisible ] = useState(false);
    const [ title, setTitle ] = useState('新增');
    const [ form ] = useForm();
    const [ processDisabled, setProcessDisabled ] = useState(true);
    const [ detailData, setDetailData ] = useState<IDetailData>({});
    return (
        <>
            <Page
                path="/tower-science/loftingList/loftingPage"
                columns={ columns }
                headTabs={ [] }
                extraOperation={ <Button type="primary" onClick={ () => {setVisible(true); setTitle("新增");} } ghost>新增产线</Button> }
                refresh={ refresh }
                searchFormItems={ [
                    {
                        name: 'fuzzyMsg',
                        label: '',
                        children: <Input placeholder="请输入产线名称进行查询"/>
                    }
                ] }
                onFilterSubmit = { (values: Record<string, any>) => {
                    return values;
                } }
            />
            <Modal visible={ visible } width="40%" title={ title + "产线" } okText="保存" cancelText="取消" onOk={ save } onCancel={ cancel }>
                <Form form={ form } labelCol={{ span: 4 }}>
                    <Form.Item name="name" label="产线名称" initialValue={ detailData?.name } rules={[{
                            "required": true,
                            "message": "请输入产线名称"
                        }]}>
                        <Input placeholder="请输入" maxLength={ 50 } />
                    </Form.Item>
                    <Form.Item name="dept" label="所属车间" rules={[{
                            "required": true,
                            "message": "请选择所属车间"
                        }]}>
                        <Select placeholder="请选择" onChange={ (e) => {
                            setProcessDisabled(false);
                        } }>
                            <Select.Option value={ 1 } key="4">全部</Select.Option>
                            <Select.Option value={ 2 } key="">全部222</Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item name="a" label="所属工序" rules={[{
                            "required": true,
                            "message": "请选择所属工序"
                        }]}>
                        <Select placeholder="请选择" disabled={ processDisabled }>
                            <Select.Option value={ 1 } key="4">全部</Select.Option>
                            <Select.Option value={ 2 } key="">全部222</Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item name="description" label="备注">
                        <Input placeholder="请输入" maxLength={ 300 } />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    )
}