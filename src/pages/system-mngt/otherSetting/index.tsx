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
            key: 'stationName',
            title: '应用唯一标识',
            width: 150,
            dataIndex: 'stationName'
        },
        {
            key: 'stationName',
            title: '应用名称',
            width: 150,
            dataIndex: 'stationName'
        },
        {
            key: 'stationName',
            title: 'appId',
            width: 150,
            dataIndex: 'stationName'
        },
        {
            key: 'stationName',
            title: 'appSecret',
            width: 150,
            dataIndex: 'stationName'
        },
        {
            key: 'stationName',
            title: '服务地址',
            width: 150,
            dataIndex: 'stationName'
        },
        {
            key: 'stationName',
            title: '前端跳转地址',
            width: 150,
            dataIndex: 'stationName'
        },
        {
            key: 'stationName',
            title: '授权码',
            width: 150,
            dataIndex: 'stationName'
        },
        {
            key: 'stationName',
            title: '授权模式',
            width: 150,
            dataIndex: 'stationName'
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
                        const data: IJobs = await RequestUtil.get(`/tower-system/station/${ record.id }`);
                        setDetail(data);
                        setTitle("查看");
                        setView(true)
                        form.setFieldsValue({ ...data });
                        setVisible(true);
                    } }>查看</Button>
                    <Button type="link" onClick={ async () => {
                        const data: IJobs = await RequestUtil.get(`/tower-system/station/${ record.id }`);
                        setDetail(data);
                        setTitle("编辑");
                        form.setFieldsValue({ ...data });
                        setVisible(true);
                    } }>编辑</Button>
                    <Popconfirm
                        title="确认删除?"
                        onConfirm={ () => {
                            RequestUtil.delete(`/tower-system/station/${ record.id }`).then(res => {
                                setRefresh(!refresh);
                            });
                        } }
                        okText="确认"
                        cancelText="取消"
                    >
                        <Button type="link">删除</Button>
                    </Popconfirm>
                    <Button type="link" onClick={ async () => {
                        const data: IJobs = await RequestUtil.get(`/tower-system/station/${ record.id }`);
                        setRefresh(!refresh)
                    } }>启用</Button>
                    <Button type="link" onClick={ async () => {
                        const data: IJobs = await RequestUtil.get(`/tower-system/station/${ record.id }`);
                        setRefresh(!refresh)
                    } }>禁用</Button>
                </Space>
            )
        }
    ]

    const save = () => {
        if(form) {
            form.validateFields().then(res => {
                let value = form.getFieldsValue(true);
                if(title === '新增') {
                    RequestUtil.post(`/tower-system/station`, value).then(res => {
                        setDetail({});
                        message.success('新增成功');
                        setRefresh(!refresh);
                        form.resetFields();
                        form.setFieldsValue({ stationName: '' });
                        setVisible(false);
                    })
                } else {
                    RequestUtil.put(`/tower-system/station`,  {
                        ...value,
                        id: detail.id
                    }).then(res => {
                        setDetail({});
                        message.success('编辑成功');
                        setRefresh(!refresh);
                        form.resetFields();
                        form.setFieldsValue({ stationName: '' });
                        setVisible(false);
                    })
                }
            })
        }
    }

    return <>
        <Page
            path="/tower-system/station"
            columns={ columns }
            headTabs={ [] }
            refresh={ refresh }
            extraOperation={ <Button type="primary" onClick={ () => { setVisible(true); setTitle("新增"); } }>新增</Button> }
            searchFormItems={ [] }
        />
        <Modal 
            visible={ visible } 
            title={ title  }
            footer={<Space>
                <Button type="ghost" onClick={() => {
                    setVisible(false); 
                    setDetail({}); 
                    setView(false)
                    form.resetFields(); 
                    form.setFieldsValue({ 
                        stationName: '' 
                    }); 
                }}>取消</Button>
                {!view&&<Button type="primary" onClick={save} ghost>保存</Button>}
            </Space>}
            onCancel={ () => { 
                setVisible(false); 
                setDetail({}); 
                setView(false)
                form.resetFields(); 
                form.setFieldsValue({ 
                    stationName: '' 
                }); 
            } }
        >
            <Form form={ form }>
                <Row>
                    <Col span={12}>
                        <Form.Item label="应用名称" name="stationName" initialValue={ detail.stationName } rules={[{
                            "required": true,
                            "message": "请输入应用名称"
                        }]}>
                            <Input maxLength={ 32 }/>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label="应用标识" name="stationName" initialValue={ detail.stationName } rules={[{
                            "required": true,
                            "message": "请输入应用标识"
                        }]}>
                            <Input maxLength={ 32 }/>
                        </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={12}>
                        <Form.Item label="授权模式" name="stationName" initialValue={ detail.stationName } rules={[{
                            "required": true,
                            "message": "请选择授权模式"
                        }]}>
                            <Select placeholder="请选择授权模式" style={{ width: "100%" }} onChange={(value:number) => setSelected(value)}>
                                <Select.Option value={1} key="1">Token授权</Select.Option>
                                <Select.Option value={2} key="2">授权码授权</Select.Option>
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label="授权码" name="stationName" initialValue={ detail.stationName } rules={[{
                            "required": selected===2,
                            "message": "请输入授权码"
                        }]}>
                            <Input  placeholder={"请输入授权码"}/>
                        </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={12}>
                        <Form.Item label="appId" name="stationName" initialValue={ detail.stationName } rules={[{
                            "required": selected===1,
                            "message": "请输入appId"
                        }]}>
                            <Input maxLength={ 32 } placeholder={"请输入appId"}/>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label="appSecret" name="stationName" initialValue={ detail.stationName } rules={[{
                            "required": true,
                            "message": "请输入appSecret"
                        }]}>
                            <Input maxLength={ 32 } placeholder={"请输入appSecret"}/>
                        </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Form.Item label="服务地址" name="stationName" initialValue={ detail.stationName } rules={[{
                        "required": true,
                        "message": "请输入服务地址"
                    }]}>
                        <Input maxLength={ 200 } placeholder={"请输入服务地址"}/>
                    </Form.Item>
                </Row>
                <Row>
                    <Form.Item label="跳转地址" name="stationName" initialValue={ detail.stationName } >
                        <Input maxLength={ 200 } placeholder={"请输入前端跳转地址"}/>
                    </Form.Item>
                </Row>
                <Row>
                    <Form.Item label="备注" name="description" initialValue={ detail.description }>
                        <Input.TextArea maxLength={ 200 }/>
                    </Form.Item>
                </Row>
            </Form>
        </Modal>
    </>
}