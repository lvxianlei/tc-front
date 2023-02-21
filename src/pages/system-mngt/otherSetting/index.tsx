import React, { useState } from 'react';
import { Space, Input, Button, Popconfirm, Modal, Form, message, Col, Row, Select } from 'antd';
import { Page } from '../../common';
import { FixedType } from 'rc-table/lib/interface';
import RequestUtil from '../../../utils/RequestUtil';

export interface IJobs {
    readonly id?: string;
    readonly stationName?: string;
}

export default function JobsMngt(): React.ReactNode {
    const [ refresh, setRefresh ] = useState<boolean>(false);
    const [ form ] = Form.useForm();
    const [ visible, setVisible ] = useState<boolean>(false);
    const [ title, setTitle ] = useState('新增');
    const [ selected, setSelected ] = useState(0);
    const [ view, setView ] = useState<boolean>(false);
    const [ detail, setDetail ] = useState<any>({});
    
    const columns = [
        {
            key: 'appCharacteristic',
            title: '应用唯一标识',
            width: 150,
            dataIndex: 'appCharacteristic'
        },
        {
            key: 'appName',
            title: '应用名称',
            width: 150,
            dataIndex: 'appName'
        },
        {
            key: 'appId',
            title: 'appId',
            width: 150,
            dataIndex: 'appId'
        },
        {
            key: 'appSecret',
            title: 'appSecret',
            width: 150,
            dataIndex: 'appSecret'
        },
        {
            key: 'serviceUrl',
            title: '服务地址',
            width: 150,
            dataIndex: 'serviceUrl'
        },
        {
            key: 'skipUrl',
            title: '前端跳转地址',
            width: 150,
            dataIndex: 'skipUrl'
        },
        {
            key: 'impowerCode',
            title: '授权码',
            width: 150,
            dataIndex: 'impowerCode'
        },
        {
            key: 'impowerPatterm',
            title: '授权模式',
            width: 150,
            dataIndex: 'impowerPatterm',
            render: (_: any, _b: any, index: number): React.ReactNode => (<span>{_===0?'Token授权':_===1?'授权码授权':'-'}</span>)
        },
        {
            key: 'operation',
            title: '操作',
            dataIndex: 'operation',
            fixed: 'right' as FixedType,
            width: 200,
            render: (_: undefined, record: Record<string, any>): React.ReactNode => (
                <Space direction="horizontal" size="small">
                    <Button type="link" onClick={ async () => {
                        const data: any = await RequestUtil.get(`/tower-system/appDeploy/${ record.id }`);
                        setDetail(data);
                        setTitle("查看");
                        setView(true)
                        form.setFieldsValue({ ...data });
                        setSelected(data?.impowerPatterm)
                        setVisible(true);
                    } }>查看</Button>
                    <Button type="link" onClick={ async () => {
                        const data: any = await RequestUtil.get(`/tower-system/appDeploy/${ record.id }`);
                        setDetail(data);
                        setTitle("编辑");
                        form.setFieldsValue({ ...data });
                        setSelected(data?.impowerPatterm)
                        setVisible(true);
                    } }>编辑</Button>
                    <Popconfirm
                        title="确认删除?"
                        onConfirm={ () => {
                            RequestUtil.delete(`/tower-system/appDeploy/${ record.id }`).then(res => {
                                message.success('删除成功！')
                                setRefresh(!refresh);
                            });
                        } }
                        okText="确认"
                        cancelText="取消"
                    >
                        <Button type="link">删除</Button>
                    </Popconfirm>
                    {record?.switchButton===1 && <Button type="link" onClick={ async () => {
                        await RequestUtil.put(`/tower-system/appDeploy`,  {
                            ...record,
                            switchButton: 0
                        })
                        message.success('启用成功！')
                        setRefresh(!refresh)
                    } } >启用</Button>}
                    {record?.switchButton===0 && <Button type="link" onClick={ async () => {
                        await RequestUtil.put(`/tower-system/appDeploy`,  {
                            ...record,
                            switchButton: 1
                        })
                        message.success('禁用成功！')
                        setRefresh(!refresh)
                    } } >禁用</Button>}
                </Space>
            )
        }
    ]

    const save = async () => {
        await form.validateFields();
        let value = form.getFieldsValue(true);
        if(title === '新增') {
            RequestUtil.post(`/tower-system/appDeploy`, value).then(res => {
                setDetail({});
                message.success('新增成功');
                setRefresh(!refresh);
                form.setFieldsValue({ 
                    appCharacteristic: '',
                    appId: '',
                    appName: '',
                    appSecret: '',
                    description: '',
                    impowerCode: '',
                    impowerPatterm: 0,
                    serviceUrl: '',
                    skipUrl: '',
                }); 
                setVisible(false);
            })
        } else {
            RequestUtil.put(`/tower-system/appDeploy`,  {
                ...value,
                id: detail.id
            }).then(res => {
                setDetail({});
                message.success('编辑成功');
                setRefresh(!refresh);
                form.setFieldsValue({ 
                    appCharacteristic: '',
                    appId: '',
                    appName: '',
                    appSecret: '',
                    description: '',
                    impowerCode: '',
                    impowerPatterm: 0,
                    serviceUrl: '',
                    skipUrl: '',
                }); 
                setVisible(false);
                setTitle('新增')
            })
        }
            
    }
    const formItemLayout = {
        labelCol: { span: 6 },
        wrapperCol: { span: 16 }
    };
    return <>
        <Page
            path="/tower-system/appDeploy"
            columns={ columns }
            headTabs={ [] }
            refresh={ refresh }
            extraOperation={ <Button type="primary" onClick={ () => { 
                setTitle("新增"); 
                setSelected(0); 
                setVisible(true);  
                form.setFieldsValue({
                    impowerPatterm: 0
                })
            } }>新增</Button> }
            searchFormItems={ [] }
        />
        <Modal 
            visible={ visible } 
            title={ title  }
            width={'60%'}
            footer={<Space>
                <Button type="ghost" onClick={() => {
                    setVisible(false); 
                    setDetail({}); 
                    setView(false)
                    form.resetFields(); 
                    form.setFieldsValue({ 
                        appCharacteristic: '',
                        appId: '',
                        appName: '',
                        appSecret: '',
                        description: '',
                        impowerCode: '',
                        impowerPatterm: 0,
                        serviceUrl: '',
                        skipUrl: '',
                    }); 
                    setTitle('新增')
                }}>取消</Button>
                {!view&&<Button type="primary" onClick={save} ghost>保存</Button>}
            </Space>}
            onCancel={ () => { 
                setVisible(false); 
                setDetail({}); 
                setView(false)
                form.resetFields(); 
                form.setFieldsValue({ 
                    appCharacteristic: '',
                    appId: '',
                    appName: '',
                    appSecret: '',
                    description: '',
                    impowerCode: '',
                    impowerPatterm: 0,
                    serviceUrl: '',
                    skipUrl: '',
                }); 
            } }
        >
            <Form form={ form } {...formItemLayout}>
                <Row>
                    <Col span={12}>
                        <Form.Item label="应用名称" name="appName"  rules={[{
                            "required": true,
                            "message": "请输入应用名称"
                        }]}>
                            <Input maxLength={ 32 } placeholder="请输入应用名称" disabled={title==='查看'}/>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label="应用标识" name="appCharacteristic"  rules={[{
                            "required": true,
                            "message": "请输入应用标识"
                        }]}>
                            <Input maxLength={ 32 } placeholder="请输入应用标识" disabled={title==='查看'}/>
                        </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={12}>
                        <Form.Item label="授权模式" name="impowerPatterm" rules={[{
                            "required": true,
                            "message": "请选择授权模式"
                        }]}>
                            <Select placeholder="请选择授权模式" style={{ width: "100%" }} disabled={title==='查看'} onChange={(value:number) => {
                                setSelected(value)
                                value===0&&form.setFieldsValue({
                                    impowerCode:'',
                                })
                                value===1&&form.setFieldsValue({
                                    appId:'',
                                    appSecret:''
                                })
                            }}>
                                <Select.Option value={0} key="0">Token授权</Select.Option>
                                <Select.Option value={1} key="1">授权码授权</Select.Option>
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label="授权码" name="impowerCode"  rules={[{
                            "required": selected===1,
                            "message": "请输入授权码"
                        }]}>
                            <Input  placeholder={"请输入授权码"} disabled={title==='查看'}/>
                        </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={12}>
                        <Form.Item label="appId" name="appId"  rules={[{
                            "required": selected===0,
                            "message": "请输入appId"
                        }]}>
                            <Input maxLength={ 128 } placeholder={"请输入appId"} disabled={title==='查看'}/>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label="appSecret" name="appSecret" rules={[{
                            "required": selected===0,
                            "message": "请输入appSecret"
                        }]}>
                            <Input maxLength={ 128 } placeholder={"请输入appSecret"} disabled={title==='查看'}/>
                        </Form.Item>
                    </Col>
                </Row>
                <Form.Item label="服务地址" name="serviceUrl"  rules={[{
                    "required": true,
                    "message": "请输入服务地址"
                }]} labelCol={{span:3}} wrapperCol={{span:20}}>
                    <Input maxLength={ 200 } placeholder={"请输入服务地址"} disabled={title==='查看'}/>
                </Form.Item>
                <Form.Item label="跳转地址" name="skipUrl"  labelCol={{span:3}} wrapperCol={{span:20}}>
                    <Input maxLength={ 200 } placeholder={"请输入前端跳转地址"} disabled={title==='查看'}/>
                </Form.Item>
                <Form.Item label="备注" name="description" labelCol={{span:3}} wrapperCol={{span:20}}>
                    <Input.TextArea maxLength={ 200 } showCount disabled={title==='查看'}/>
                </Form.Item>
            </Form>
        </Modal>
    </>
}