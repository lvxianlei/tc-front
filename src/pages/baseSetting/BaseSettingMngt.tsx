import React, { useState } from 'react'
import { Button, Spin, Space, Form, Row, Col, Input, Select } from 'antd';
import { useHistory, useParams } from 'react-router-dom';
import { BaseInfo, DetailContent, CommonTable, DetailTitle } from '../common';
import useRequest from '@ahooksjs/use-request';
import RequestUtil from '../../utils/RequestUtil';
import Modal from 'antd/lib/modal/Modal';

export default function TowerDetail(): React.ReactNode {
    const history = useHistory()
    const params = useParams<{ id: string }>()
    const { loading, data } = useRequest(() => new Promise(async (resole, reject) => {
        // const data: any = await RequestUtil.get(`/tower-market/bidInfo/${params.id}`)
        resole(data)
    }), {})
    const detailData: any = data;
    const [form] = Form.useForm();
    const formItemLayout = {
        labelCol: { span: 4 },
        wrapperCol: { span: 17 }
    };
    const handleModalOk = async () => {
        try {
            const submitData = await form.validateFields()
            console.log(submitData)
        } catch (error) {
            console.log(error)
        }
    }
    return <>
        <Spin spinning={loading}>
            <DetailContent operation={[
                <Button>保存</Button>,
                <Button key="goback" onClick={() => history.goBack()}>返回</Button>
            ]}>
                <DetailTitle title="技术部时间节点配置" />
                <Form form={form} {...formItemLayout}>
                    <Row>
                        <Col span={16}>
                            <Form.Item name="aaaa" label="确认明细完成时间 接收任务后">
                                <Input style={{width:'100%'}}/>
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item name="reason" label="">
                                <Select style={{width:'100%'}}>A001</Select>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={16}>
                            <Form.Item name="aaaa" label="确认明细提交时间 确认明细完成后">
                                <Input style={{width:'100%'}}/>
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item name="reason" label="">
                                <Select style={{width:'100%'}}>A001</Select>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={16}>
                            <Form.Item name="aaaa" label="提料完成时间 接收任务后">
                                <Input style={{width:'100%'}}/>
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item name="reason" label="">
                                <Select style={{width:'100%'}}>A001</Select>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={16}>
                            <Form.Item name="aaaa" label="提料配段完成时间 提料完成后">
                                <Input style={{width:'100%'}}/>
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item name="reason" label="">
                                <Select style={{width:'100%'}}>A001</Select>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={16}>
                            <Form.Item name="aaaa" label="放样完成时间 接收任务后">
                                <Input style={{width:'100%'}}/>
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item name="reason" label="">
                                <Select style={{width:'100%'}}>A001</Select>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={16}>
                            <Form.Item name="aaaa" label="组焊清单完成时间  放样任务完成后">
                                <Input style={{width:'100%'}}/>
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item name="reason" label="">
                                <Select style={{width:'100%'}}>A001</Select>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={16}>
                            <Form.Item name="aaaa" label="放样配段完成时间 放样任务完成后">
                                <Input style={{width:'100%'}}/>
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item name="reason" label="">
                                <Select style={{width:'100%'}}>A001</Select>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={16}>
                            <Form.Item name="aaaa" label="小样图完成时间 放样任务完成后">
                                <Input style={{width:'100%'}}/>
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item name="reason" label="">
                                <Select style={{width:'100%'}}>A001</Select>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={16}>
                            <Form.Item name="aaaa" label="螺栓清单完成时间 杆塔配段完成后">
                                <Input style={{width:'100%'}}/>
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item name="reason" label="">
                                <Select style={{width:'100%'}}>A001</Select>
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </DetailContent>
        </Spin>
    </>
}