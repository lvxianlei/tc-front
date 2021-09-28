import React, { useState } from 'react'
import { Button, Spin, Form, Row, Col, Select, InputNumber } from 'antd';
import { useHistory, useParams } from 'react-router-dom';
import { DetailContent, DetailTitle } from '../common';
import useRequest from '@ahooksjs/use-request';
import RequestUtil from '../../utils/RequestUtil';

export default function TowerDetail(): React.ReactNode {
    const history = useHistory()
    const { loading, data } = useRequest(() => new Promise(async (resole, reject) => {
        // const data: any = await RequestUtil.get(`/tower-science/config`)
        resole(data)
    }), {})
    const detailData: any = data||[{name:"确认明细完成时间 接收任务后",code:1,type:'1',value:1},{name:"确认明细提交时间 确认明细完成后",code:2,type:'2',value:3}];
    const [form] = Form.useForm();

    return <>
        <Spin spinning={loading}>
            <DetailContent operation={[
                <Button onClick={()=>{
                    console.log(form.getFieldsValue(true))
                }}>保存</Button>,
                <Button key="goback" onClick={() => history.goBack()}>返回</Button>
            ]}>
                <DetailTitle title="技术部时间节点配置" />
                {/* <Form form={form} {...formItemLayout}>
                    <Row>
                        <Col span={6}>
                            <Form.Item name="aaaa" label="确认明细完成时间 接收任务后">
                                <InputNumber style={{width:'100%'}}/>
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item name="reason" label="">
                                <Select style={{width:'100%'}} defaultValue='1'>
                                    <Select.Option key='1' value='1'>天</Select.Option>
                                    <Select.Option key='2' value='2'>小时</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item name="aaaa" label="确认明细提交时间 确认明细完成后">
                                <InputNumber style={{width:'100%'}}/>
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item name="reason" label="">
                                <Select style={{width:'100%'}} defaultValue='1'>
                                    <Select.Option key='1' value='1'>天</Select.Option>
                                    <Select.Option key='2' value='2'>小时</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item name="aaaa" label="提料完成时间 接收任务后">
                                <InputNumber style={{width:'100%'}}/>
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item name="reason" label="">
                                <Select style={{width:'100%'}} defaultValue='1'>
                                    <Select.Option key='1' value='1'>天</Select.Option>
                                    <Select.Option key='2' value='2'>小时</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item name="aaaa" label="提料配段完成时间 提料完成后">
                                <InputNumber style={{width:'100%'}}/>
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item name="reason" label="">
                                <Select style={{width:'100%'}} defaultValue='1'>
                                    <Select.Option key='1' value='1'>天</Select.Option>
                                    <Select.Option key='2' value='2'>小时</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item name="aaaa" label="放样完成时间 接收任务后">
                                <InputNumber style={{width:'100%'}}/>
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item name="reason" label="">
                                <Select style={{width:'100%'}} defaultValue='1'>
                                    <Select.Option key='1' value='1'>天</Select.Option>
                                    <Select.Option key='2' value='2'>小时</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item name="aaaa" label="组焊清单完成时间  放样任务完成后">
                                <InputNumber style={{width:'100%'}}/>
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item name="reason" label="">
                                <Select style={{width:'100%'}} defaultValue='1'>
                                    <Select.Option key='1' value='1'>天</Select.Option>
                                    <Select.Option key='2' value='2'>小时</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item name="aaaa" label="放样配段完成时间 放样任务完成后">
                                <InputNumber style={{width:'100%'}}/>
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item name="reason" label="">
                                <Select style={{width:'100%'}} defaultValue='1'>
                                    <Select.Option key='1' value='1'>天</Select.Option>
                                    <Select.Option key='2' value='2'>小时</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item name="aaaa" label="小样图完成时间 放样任务完成后">
                                <InputNumber style={{width:'100%'}}/>
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item name="reason" label="">
                                <Select style={{width:'100%'}} defaultValue='1'>
                                    <Select.Option key='1' value='1'>天</Select.Option>
                                    <Select.Option key='2' value='2'>小时</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item name="aaaa" label="螺栓清单完成时间 杆塔配段完成后">
                                <InputNumber min={1} style={{width:'100%'}} decimalSeparator=''/>
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item name="reason" label="">
                                <Select style={{width:'100%'}} defaultValue='1'>
                                    <Select.Option key='1' value='1'>天</Select.Option>
                                    <Select.Option key='2' value='2'>小时</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                </Form> */}
                <Form initialValues={{ detailData : detailData }} autoComplete="off" form={form}>  
                    <Row>
                        <Form.List name="detailData">
                            {
                                ( fields , { add, remove }) => fields.map(
                                    field => (
                                    <>
                                        <Col span={ 1 }></Col>
                                        <Col span={ 3 }>
                                        <Form.Item name={[ field.name , 'name']}>
                                            <span><span style={{color:'red'}}>* </span> {detailData[field.name].name}</span>
                                        </Form.Item>
                                        </Col>
                                        <Col span={ 3 }>
                                        <Form.Item name={[ field.name , 'value']} rules={[{required:true,message:`请输入${detailData[field.name].name}`}]}>
                                            <InputNumber style={{width:'100%'}}/>
                                        </Form.Item>
                                        </Col>
                                        <Col span={ 1 }>
                                        <Form.Item  name={[ field.name , 'type']}>
                                            <Select defaultValue='1'>
                                                <Select.Option value='1' key='1'>天</Select.Option>
                                                <Select.Option value='2' key='2'>小时</Select.Option>
                                            </Select>
                                        </Form.Item>
                                        </Col>
                                        <Col span={ 1 }></Col>
                                    </>
                                    )
                                )
                            }
                        </Form.List> 
                    </Row>
                </Form>
            </DetailContent>
        </Spin>
    </>
}






