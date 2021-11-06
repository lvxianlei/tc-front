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
    readonly createTime?: string;
    readonly createUserName?: string;
    readonly deptProcessesId?: string;
    readonly deptProcessesName	?: string;
    readonly description?: string;
    readonly id?: string;
    readonly name?: string;
    readonly workshopDeptId?: string;
    readonly workshopDeptName?: string;
}

interface IProcess {
    readonly createTime?: string;
    readonly createUserName?: string;
    readonly deptId?: string;
    readonly deptName?: string;
    readonly id?: string;
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
            key: 'name',
            title: '产线名称',
            width: 150,
            dataIndex: 'name'
        },
        {
            key: 'workshopDeptName',
            title: '所属车间',
            dataIndex: 'workshopDeptName',
            width: 120
        },
        {
            key: 'deptProcessesName',
            title: '所属工序',
            width: 200,
            dataIndex: 'deptProcessesName'
        },
        {
            key: 'description',
            title: '备注',
            width: 200,
            dataIndex: 'description'
        },
        {
            key: 'createUserName',
            title: '制单人',
            width: 200,
            dataIndex: 'createUserName'
        },
        {
            key: 'createTime',
            title: '制单时间',
            width: 200,
            dataIndex: 'createTime'
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
                        getList(record.id);
                        getProcess();
                    } }>编辑</Button>
                    <Popconfirm
                        title="确认删除?"
                        onConfirm={ () => {
                            RequestUtil.delete(`/tower-production/productionLines/remove`).then(res => {
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

    const getList = async (id: string) => {
        const data = await RequestUtil.get<IDetailData>(`/tower-production/productionLines/detail?id=${ id }`);
        setDetailData(data);
    }

    const getProcess = async () => {
        const data = await RequestUtil.get<IProcess[]>(`/tower-production/workshopDept/list`);
        setProcess(data);
    }

    const [ refresh, setRefresh ] = useState(false);
    const [ visible, setVisible ] = useState(false);
    const [ title, setTitle ] = useState('新增');
    const [ form ] = useForm();
    const [ processDisabled, setProcessDisabled ] = useState(true);
    const [ detailData, setDetailData ] = useState<IDetailData>({});
    const [ process, setProcess ] = useState<IProcess[]>([]);
    return (
        <>
            <Page
                path="/tower-production/productionLines/page"
                columns={ columns }
                headTabs={ [] }
                extraOperation={ <Button type="primary" onClick={ () => {setVisible(true); setTitle("新增"); getProcess();} } ghost>新增产线</Button> }
                refresh={ refresh }
                searchFormItems={ [
                    {
                        name: 'productionLinesName',
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
                    <Form.Item name="workshopDeptId" label="所属车间" initialValue={ detailData.workshopDeptId } rules={[{
                            "required": true,
                            "message": "请选择所属车间"
                        }]}>
                        <Select placeholder="请选择" onChange={ (e) => {
                            setProcessDisabled(false);
                            form.setFieldsValue({ deptProcessesId: '' });
                        } }>
                            <Select.Option value={ 1 } key="4">全部</Select.Option>
                            <Select.Option value={ 2 } key="">全部222</Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item name="deptProcessesId" label="所属工序" initialValue={ detailData.deptProcessesId } rules={[{
                            "required": true,
                            "message": "请选择所属工序"
                        }]}>
                        <Select placeholder="请选择" disabled={ processDisabled }>
                            { process.map((item: any) => {
                                return <Select.Option key={ item.id } value={ item.id }>{ item.deptName }</Select.Option>
                            }) }
                        </Select>
                    </Form.Item>
                    <Form.Item name="description" label="备注" initialValue={ detailData.description }>
                        <Input placeholder="请输入" maxLength={ 300 } />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    )
}