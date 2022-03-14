import React, { useState } from 'react';
import { Space, Input, DatePicker, Button, Form, Select, Popconfirm, message, Modal, Row, Col, Spin, InputNumber } from 'antd';
import { useHistory, useLocation } from 'react-router-dom';
import { FixedType } from 'rc-table/lib/interface';
import { CommonTable, DetailContent, DetailTitle, Page } from '../../common';
import RequestUtil from '../../../utils/RequestUtil';
import AuthUtil from '../../../utils/AuthUtil';
import useRequest from '@ahooksjs/use-request';
import Checkbox from 'antd/lib/checkbox/Checkbox';
// import styles from './sample.module.less';

export default function Release(): React.ReactNode {
    const history = useHistory();
    const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([]);
    const location = useLocation<{ state?: number, userId?: string }>();
    const [ form ] = Form.useForm();
    const { loading, data } = useRequest(() => new Promise(async (resole, reject) => {
        const data:any = await RequestUtil.get(`/tower-system/employee?size=1000`);
        resole(data?.records);
    }), {})
    const SelectChange = (selectedRowKeys: React.Key[]): void => {
        setSelectedKeys(selectedRowKeys);
    }
    

    return (
        <Spin spinning={loading}>
            <DetailContent operation={[
                <Button key="goback" onClick={() => history.goBack()}>返回</Button>
            ]}>
                    <DetailTitle title='基础信息'/>
                    <CommonTable columns={[
                            {
                                title: "塔形",
                                dataIndex: "index",
                                width: 50,
                            },
                            {
                                title: "钢印号",
                                dataIndex: "name",
                                width: 150
                            },
                            {
                                title: "计划号",
                                dataIndex: "planNumber",
                                width: 150
                            },
                            {
                                title: "试装",
                                dataIndex: "planNumber",
                                width: 150
                            },
                            {
                                title: "电压等级",
                                dataIndex: "planNumber",
                                width: 150
                            },
                            {
                                title: "材料标准",
                                dataIndex: "planNumber",
                                width: 150
                            },
                            {
                                title: "产品类型",
                                dataIndex: "planNumber",
                                width: 150
                            }
                        ]}
                        dataSource={[
                    ]} pagination={false}/>
                    <DetailTitle title='批次信息'/>
                    <CommonTable
                        columns={[
                            {
                                title: "批次号",
                                dataIndex: "index",
                            },
                            {
                                title: "基数",
                                dataIndex: "name",
                            },
                            {
                                title: "杆塔号",
                                dataIndex: "planNumber",
                            }
                        ]}
                         pagination={false}  dataSource={[
                    ]}/>
                   
                   <Form form={ form } labelCol={{span:4}}>
                        <DetailTitle title='下达信息'/>
                            <Row >
                                <Col span={12}>
                                    <Form.Item name="name" label="加工要求">
                                        <Input.TextArea placeholder="请输入" maxLength={ 200 } showCount rows={1}/>
                                    </Form.Item>
                                </Col>
                            
                                <Col span={12}>
                                    <Form.Item name="name" label="电焊说明">
                                        <Input.TextArea placeholder="请输入" maxLength={ 200 } showCount rows={1}/>
                                    </Form.Item>
                                </Col>
                            
                            </Row>
                            <Row>
                                <Col span={12}>
                                    <Form.Item name="name" label="镀锌要求">
                                        <Input.TextArea placeholder="请输入" maxLength={ 200 } showCount rows={1}/>
                                    </Form.Item>
                                </Col>
                            
                                <Col span={12}>
                                    <Form.Item name="name" label="包装说明">
                                        <Input.TextArea placeholder="请输入" maxLength={ 200 } showCount rows={1}/>
                                    </Form.Item>
                                </Col>
                            </Row>
                        <DetailTitle title='试装信息'/>
                            <Row>
                                <Col span={12}>
                                <Form.Item name="name" label="试装类型"  rules={[{
                                        "required": true,
                                        "message": "请选择试装类型"
                                    },
                                    {
                                        pattern: /^[^\s]*$/,
                                        message: '禁止输入空格',
                                    }]}>
                                    <Input placeholder="请输入" maxLength={ 50 } />
                                </Form.Item>
                                </Col>
                                <Col span={12}>
                                <Form.Item name="name" label="试装段"  rules={[{
                                        "required": true,
                                        "message": "请选择试装段"
                                    },
                                    {
                                        pattern: /^[^\s]*$/,
                                        message: '禁止输入空格',
                                    }]}>
                                    <Input placeholder="请输入" maxLength={ 50 } />
                                </Form.Item>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={12}>
                                    <Form.Item name="name" label="试装说明">
                                        <Input.TextArea placeholder="请输入"  maxLength={ 200 } showCount rows={1} />
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Form>
                <DetailTitle title='批次信息' operation={[ <Checkbox>显示已全部下达</Checkbox>,<Button type="primary" onClick={ ()=>{

                }} disabled={!(selectedKeys.length>0)}>输入全部</Button>]}/>
                    <Form>
                    <CommonTable  columns={[
                            {
                                title: "序号",
                                dataIndex: "index",
                                width: 50,
                                render: (_a: any, _b: any, index: number) => <>{index + 1}</>
                            },
                            {
                                title: "段号",
                                dataIndex: "index",
                                width: 50,
                            },
                            {
                                title: "批次号",
                                dataIndex: "name",
                                width: 150
                            },
                            {
                                title: "段数",
                                dataIndex: "planNumber",
                                width: 150
                            },
                            {
                                title: "已下达数量",
                                dataIndex: "planNumber",
                                width: 150
                            },
                            {
                                title: "下达数量",
                                dataIndex: "planNumber",
                                width: 150,
                                render:()=>{
                                    return  <Form.Item >
                                        <InputNumber precision={0} min={0} style={{width:'100%'}}/>
                                    </Form.Item>
                                }
                            }
                        ]}
                        dataSource={[
                    ]} pagination={false} rowSelection={{
                        selectedRowKeys: selectedKeys,
                        onChange: SelectChange,
                    }}/>
                    </Form>
        </DetailContent>
    </Spin>
    )
}