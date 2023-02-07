import React, { useState } from 'react';
import { Space, Input, Button, Popconfirm, Modal, Form, Select } from 'antd';
import { Page } from '../../common';
import { FixedType } from 'rc-table/lib/interface';
import RequestUtil from '../../../utils/RequestUtil';
import { deptTypeOptions } from '../../../configuration/DictionaryOptions';
import { useHistory } from 'react-router-dom';

export interface IDept extends IMetaDept {
    readonly children: IDept[];
}

export interface IDeptDetail {
    readonly parentName?: string | number;
    readonly name?: string;
    readonly id?: string;
    readonly description?: string;
    readonly parentId?: string | number;
    readonly sort?: string;
    readonly classification?: string;
}

export interface IMetaDept {
    readonly id: number;
    readonly name: string;
    readonly clientId: string;
    readonly code: string;
    readonly description: string;
    readonly hasChildren: boolean;
    readonly isDeleted: number;
    readonly parentId: number;
    readonly parentName: string;
    readonly sort: number;
    readonly tenantId: string;
    readonly key: string;
}

export interface IDeptTree {
    id?: string;
    title?: string;
    children?: [];
}

export default function DepartmentMngt(): React.ReactNode {
    const [refresh, setRefresh] = useState<boolean>(false);
    const history = useHistory()
    const [companyVisible, setCompanyVisible] = useState<boolean>(false);
    const [deptVisible, setDeptVisible] = useState<boolean>(false);
    const [form] = Form.useForm();
    const [companyForm] = Form.useForm();
    const [deptDeatil, setDeptDeatil] = useState<IDeptDetail>();
    const [deptTip, setDeptTip] = useState('');
    const [companyTip, setCompanyTip] = useState('');

    const columns = [
        {
            key: 'name',
            title: '机构名称',
            width: 150,
            dataIndex: 'name',
            render: (_: undefined, record: Record<string, any>): React.ReactNode => (
                record.type === 2 && record.parentId !== 0 ? <span>{_}（子公司）</span> : <span>{_}</span>
            )
        },
        {
            key: 'classification',
            title: '类型',
            dataIndex: 'classification',
            width: 120
        },
        {
            key: 'description',
            title: '简介',
            width: 200,
            dataIndex: 'description'
        },
        {
            key: 'operation',
            title: '操作',
            dataIndex: 'operation',
            fixed: 'right' as FixedType,
            width: 200,
            render: (_: undefined, record: Record<string, any>): React.ReactNode => (
                <Space direction="horizontal" size="small">
                    <Button type="link" onClick={() => {
                        setDeptTip('新增');
                        setDeptVisible(true);
                        setDeptDeatil({ parentName: record.name, parentId: record.id });
                    }} disabled={record.type === 2}>添加子部门</Button>
                    <Button type="link" onClick={() => {
                        setCompanyTip('新增');
                        setCompanyVisible(true);
                        setDeptDeatil({ parentId: record.id })
                    }} disabled={record.parentId !== '0'}>添加子公司</Button>
                    <Button type="link" disabled={record.parentId === '0'} onClick={async () => {
                        const data: IDeptDetail = await RequestUtil.get<IDeptDetail>(`/tower-system/department/${record.id}`);
                        setDeptDeatil(data);
                        if (record.type === 2) {
                            setCompanyTip('编辑');
                            setCompanyVisible(true);
                            companyForm.setFieldsValue({ ...data });
                        } else {
                            setDeptTip('编辑');
                            setDeptVisible(true);
                            form.setFieldsValue({ ...data });
                        }
                    }}>编辑</Button>
                    <Button
                        type="link" size="small"
                        onClick={() => history.push(`/dept/deptMngt/setting/${record?.id}`)}>配置</Button>
                    <Popconfirm
                        title="确认删除?"
                        onConfirm={() => {
                            RequestUtil.delete(`/tower-system/department?ids=${record.id}`)
                                .then(res => setRefresh(!refresh));
                        }}
                        okText="确认"
                        cancelText="取消"
                        disabled={record.parentId === '0'}
                    >
                        <Button type="link" disabled={record.parentId === '0'}>删除</Button>
                    </Popconfirm>
                </Space>
            )
        }
    ]

    return <>
        <Page
            path="/tower-system/department"
            columns={columns}
            headTabs={[]}
            refresh={refresh}
            searchFormItems={[]}
            tableProps={{
                pagination: false
            }}
        />
        <Modal
            visible={companyVisible}
            title={companyTip === "新增" ? "新增子公司" : "编辑子公司"}
            onCancel={() => {
                setCompanyVisible(false);
                companyForm.resetFields();
                companyForm.setFieldsValue({ name: '' });
            }}
            onOk={() => {
                if (companyForm) {
                    companyForm.validateFields().then(res => {
                        let values = companyForm.getFieldsValue(true);
                        if (companyTip === '新增') {
                            RequestUtil.post('/tower-system/department', { ...values, type: 2, parentId: deptDeatil?.parentId }).then(res => {
                                setCompanyVisible(false);
                                companyForm.resetFields();
                                companyForm.setFieldsValue({ name: '' });
                                setRefresh(!refresh);
                            })
                        } else {
                            RequestUtil.put('/tower-system/department', { ...values, id: deptDeatil?.id, type: 2, parentId: deptDeatil?.parentId }).then(res => {
                                setCompanyVisible(false);
                                companyForm.resetFields();
                                companyForm.setFieldsValue({ name: '' });
                                setRefresh(!refresh);
                            });
                        }
                    })
                }
            }}
        >
            <Form form={companyForm} labelCol={{ span: 4 }}>
                <Form.Item label="公司名称" name="name" initialValue={deptDeatil?.name} rules={[{
                    required: true,
                    message: '请输入公司名称'
                },
                {
                    pattern: /^[^\s]*$/,
                    message: '禁止输入空格',
                }]}>
                    <Input maxLength={50} />
                </Form.Item>
            </Form>
        </Modal>
        <Modal
            visible={deptVisible}
            title={deptTip === "新增" ? "新增子部门" : "编辑子部门"}
            onCancel={() => {
                setDeptVisible(false);
                form.resetFields();
                form.setFieldsValue({ parentName: '', classification: '', name: '', description: '' });
            }}
            onOk={() => {
                if (form) {
                    form.validateFields().then(res => {
                        let values = form.getFieldsValue(true);
                        if (deptTip === '新增') {
                            RequestUtil.post('/tower-system/department', { ...values, type: 1, parentId: deptDeatil?.parentId }).then(res => {
                                setDeptVisible(false);
                                form.resetFields();
                                form.setFieldsValue({ parentName: '', classification: '', name: '', description: '' });
                                setRefresh(!refresh);
                            })
                        } else {
                            RequestUtil.put('/tower-system/department', { ...values, type: 1, id: deptDeatil?.id, parentId: deptDeatil?.parentId }).then(res => {
                                setDeptVisible(false);
                                form.resetFields();
                                form.setFieldsValue({ parentName: '', classification: '', name: '', description: '' });
                                setRefresh(!refresh);
                            });
                        }
                    })
                }
            }}
        >
            <Form form={form} labelCol={{ span: 4 }}>
                <Form.Item label="上级部门" name="parentName" initialValue={deptDeatil?.parentName}>
                    <Input maxLength={50} disabled />
                </Form.Item>
                <Form.Item label="部门类型" name="classification" initialValue={deptDeatil?.classification} rules={[{
                    required: true,
                    message: '请选择部门类型'
                }]}>
                    <Select getPopupContainer={triggerNode => triggerNode.parentNode}>
                        {deptTypeOptions && deptTypeOptions.map(({ id, name }, index) => {
                            return <Select.Option key={index} value={name}>
                                {name}
                            </Select.Option>
                        })}
                    </Select>
                </Form.Item>
                <Form.Item label="部门名称" name="name" initialValue={deptDeatil?.name} rules={[{
                    required: true,
                    message: '请输入部门名称'
                },
                {
                    pattern: /^[^\s]*$/,
                    message: '禁止输入空格',
                }]}>
                    <Input maxLength={50} />
                </Form.Item>
                <Form.Item label="简介" name="description" initialValue={deptDeatil?.description}>
                    <Input maxLength={50} />
                </Form.Item>
            </Form>
        </Modal>
    </>
}