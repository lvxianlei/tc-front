import React, { useState } from 'react';
import { Space, Input, Select, Button, Popconfirm, Form, message, Modal, Descriptions } from 'antd';
import { CommonTable, DetailTitle, OperationRecord, Page } from '../../common';
import { FixedType } from 'rc-table/lib/interface';
import RequestUtil from '../../../utils/RequestUtil';
import styles from './StevedoringCompanyMngt.module.less'
import { RuleObject } from 'antd/lib/form';
import { StoreValue } from 'antd/lib/form/interface';
import { checkcustomerPhone } from '../../dept/staff/RulesUtils';
import { bankTypeOptions } from '../../../configuration/DictionaryOptions';

export interface IStevedoringCompanyMngt {
    readonly id?: string;
    readonly bankAccount?: string;
    readonly contactMan?: string;
    readonly contactManTel?: number;
    readonly description?: string;
    readonly openBank?: string;
    readonly openBankName?: string;
    readonly stevedoreCompanyName?: string;
    readonly stevedoreCompanyNumber?: string;
}

export default function StevedoringCompanyMngt(): React.ReactNode {
    const [refresh, setRefresh] = useState<boolean>(false);
    const [filterValue, setFilterValue] = useState({});
    const [title, setTitle] = useState('创建');
    const [detailId, setDetailId] = useState<string>("");
    const [visible, setVisible] = useState(false);
    const [form] = Form.useForm();
    const [detail, setDetail] = useState<any>({});

    const columns = [
        {
            key: 'index',
            title: '序号',
            dataIndex: 'index',
            width: 50,
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (<span>{index + 1}</span>)
        },
        {
            key: 'stevedoreCompanyNumber',
            title: '装卸公司编号',
            width: 150,
            dataIndex: 'stevedoreCompanyNumber'
        },
        {
            key: 'stevedoreCompanyName',
            title: '装卸公司名称',
            width: 150,
            dataIndex: 'stevedoreCompanyName'
        },
        {
            key: 'createTime',
            title: '添加时间',
            width: 150,
            dataIndex: 'createTime'
        },
        {
            key: 'contactMan',
            title: '联系人',
            dataIndex: 'contactMan',
            width: 120
        },
        {
            key: 'contactManTel',
            title: '联系电话',
            width: 200,
            dataIndex: 'contactManTel'
        },
        {
            key: 'openBankName',
            title: '开户银行',
            width: 200,
            dataIndex: 'openBankName'
        },
        {
            key: 'bankAccount',
            title: '银行账号',
            width: 200,
            dataIndex: 'bankAccount'
        },
        {
            key: 'description',
            title: '备注',
            width: 200,
            dataIndex: 'description'
        },
        {
            key: 'operation',
            title: '操作',
            dataIndex: 'operation',
            fixed: 'right' as FixedType,
            width: 130,
            render: (_: undefined, record: Record<string, any>): React.ReactNode => (
                <Space direction="horizontal" size="small">
                    <Button type="link" onClick={() => { setting(record.id); setTitle('编辑'); }}>编辑</Button>
                    <Button type="link" onClick={async () => {
                        setting(record.id);
                        setDetailId(record.id)
                        setTitle('详情');
                    }}>详情</Button>
                    <Popconfirm
                        title="确认删除?"
                        onConfirm={() => {
                            RequestUtil.delete(`/tower-supply/stevedoreCompany/${record.id}`).then(res => {
                                message.success('删除成功');
                                setRefresh(!refresh);
                            })
                        }}
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
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (<span>{index + 1}</span>)
        },
        {
            key: 'createDeptName',
            title: '操作部门',
            dataIndex: 'createDeptName'
        },
        {
            key: 'createUserName',
            title: '操作人',
            dataIndex: 'createUserName'
        },
        {
            key: 'createTime',
            title: '操作时间',
            dataIndex: 'createTime'
        },
        {
            key: 'currentStatus',
            title: '操作',
            dataIndex: 'currentStatus'
        },
    ]

    const close = () => {
        setVisible(false);
        form.resetFields();
        setDetail({});
        setDetailId("")
    }

    const setting = async (id: string) => {
        let data = await RequestUtil.get<IStevedoringCompanyMngt>(`/tower-supply/stevedoreCompany/${id}`);
        data = {
            ...data,
            // openBank: data.openBank + ',' + data.openBankName
        }
        setDetail(data);
        setVisible(true);
        form.setFieldsValue({ ...data });
    }

    const save = () => {
        if (form) {
            form.validateFields().then(res => {
                let value = form.getFieldsValue(true);
                console.log(value)
                value = {
                    ...value,
                    // openBank: value.openBank.split(',')[0],
                    // openBankName: value.openBank.split(',')[1]
                }
                if (title === '新增') {
                    RequestUtil.post<IStevedoringCompanyMngt>(`/tower-supply/stevedoreCompany`, value).then(res => {
                        close();
                        message.success('保存成功');
                        setRefresh(!refresh);
                    })
                } else {
                    RequestUtil.put<IStevedoringCompanyMngt>(`/tower-supply/stevedoreCompany`, {
                        ...detail,
                        ...value
                    }).then(res => {
                        close();
                        message.success('保存成功');
                        setRefresh(!refresh);
                    })
                }
            })
        }
    }

    return <>
        <Page
            path="/tower-supply/stevedoreCompany"
            columns={columns}
            headTabs={[]}
            extraOperation={<Button type="primary" onClick={() => { setVisible(true); setTitle('新增'); }} ghost>创建</Button>}
            refresh={refresh}
            searchFormItems={[
                {
                    name: 'fuzzyQuery',
                    children: <Input maxLength={50} placeholder="编号/名称/联系人/联系电话" />
                }
            ]}
            filterValue={filterValue}
            onFilterSubmit={(values: Record<string, any>) => {
                setFilterValue(values);
                return values;
            }}
        />
        <Modal
            title={title}
            visible={visible}
            width="50%"
            destroyOnClose
            onCancel={close}
            footer={<Space direction="horizontal" size="small">
                {title === '详情' ? null : <Button type="primary" onClick={save}>保存</Button>}
                <Button type="ghost" onClick={close}>关闭</Button>
            </Space>}>
            <Form form={form}>
                <DetailTitle title="基础信息" />
                <Descriptions title="" bordered size="small" colon={false} column={2} className={styles.description}>
                    <Descriptions.Item label="装卸公司编号">
                        <Form.Item name="stevedoreCompanyNumber">
                            <Input placeholder="自动生成" bordered={false} disabled />
                        </Form.Item>
                    </Descriptions.Item>
                    <Descriptions.Item label={<span>装卸公司名称<span style={{ color: 'red' }}>*</span></span>}>
                        <Form.Item name="stevedoreCompanyName" rules={[{
                            "required": true,
                            "message": "请输入装卸公司名称"
                        }, {
                            pattern: /^[^\s]*$/,
                            message: '禁止输入空格',
                        }]}>
                            <Input placeholder="请输入" maxLength={50} bordered={false} disabled={title === '详情'} />
                        </Form.Item>
                    </Descriptions.Item>
                    <Descriptions.Item label='联系人'>
                        <Form.Item name="contactMan" 
                        // rules={[{
                        //     "required": true,
                        //     "message": "请输入联系人"
                        // }, {
                        //     pattern: /^[^\s]*$/,
                        //     message: '禁止输入空格',
                        // }]}
                        >
                            <Input placeholder="请输入" bordered={false} maxLength={10} disabled={title === '详情'} />
                        </Form.Item>
                    </Descriptions.Item>
                    <Descriptions.Item label='联系电话'>
                        <Form.Item name="contactManTel" rules={[{
                            // required: true,
                            validator: (rule: RuleObject, value: StoreValue, callback: (error?: string) => void) => {
                                if (value) {
                                    checkcustomerPhone(value).then(res => {
                                        if (res) {
                                            callback()
                                        } else {
                                            callback('手机号格式有误')
                                        }
                                    })
                                }else{
                                    callback()
                                }
                            }
                        }]}>
                            <Input placeholder="请输入" bordered={false} disabled={title === '详情'} />
                        </Form.Item>
                    </Descriptions.Item>
                    <Descriptions.Item label="备注">
                        <Form.Item name="description">
                            <Input.TextArea placeholder="请输入" bordered={false} disabled={title === '详情'} maxLength={100} showCount />
                        </Form.Item>
                    </Descriptions.Item>
                </Descriptions>
                <DetailTitle title="账户信息" />
                <Descriptions title="" bordered size="small" colon={false} column={2} className={styles.description}>
                    <Descriptions.Item label={<span>开户银行<span style={{ color: 'red' }}>*</span></span>}>
                        <Form.Item name="openBankName" rules={[{
                            "required": true,
                            "message": "请输入开户银行"
                        }]}>
                            {/* <Select bordered={false} placeholder="请选择" disabled={title === '详情'}>
                                {bankTypeOptions && bankTypeOptions.map(({ id, name }, index) => {
                                    return <Select.Option key={index} value={id + ',' + name}>
                                        {name}
                                    </Select.Option>
                                })}
                            </Select> */}
                            <Input bordered={false} placeholder="请输入" disabled={title === '详情'} maxLength={50}/>
                        </Form.Item>
                    </Descriptions.Item>
                    <Descriptions.Item label={<span>银行账号<span style={{ color: 'red' }}>*</span></span>}>
                        <Form.Item name="bankAccount" rules={[{
                            "required": true,
                            "message": "请输入银行账号"
                        }, 
                        // {
                        //     pattern: /^([1-9]{1})(\d{14}|\d{18})$/,
                        //     message: "请输入正确格式的银行账号"
                        // }
                        ]}>
                            <Input placeholder="请输入" maxLength={50} bordered={false} disabled={title === '详情'} />
                        </Form.Item>
                    </Descriptions.Item>
                </Descriptions>
            </Form>
            {title === '详情' && <OperationRecord title="操作信息" serviceId={detailId} serviceName="" />}
        </Modal>
    </>
}