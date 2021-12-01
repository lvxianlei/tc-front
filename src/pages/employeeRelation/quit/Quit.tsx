import React, { useRef } from 'react'
import { Button, Spin, Space, Form, Select, DatePicker, Row, Col, Input} from 'antd';
import { useHistory, useParams } from 'react-router-dom';
import { DetailContent, CommonTable, DetailTitle, Attachment, BaseInfo, AttachmentRef } from '../../common';
import useRequest from '@ahooksjs/use-request';
import RequestUtil from '../../../utils/RequestUtil';
import TextArea from 'antd/lib/input/TextArea';


export default function Sure(): React.ReactNode {
    const history = useHistory()
    const params = useParams<{ id: string }>();
    const [form] = Form.useForm();
    const attachRef = useRef<AttachmentRef>()
    const { loading, data } = useRequest(() => new Promise(async (resole, reject) => {
        // const data: any = params.id !== '0' && await RequestUtil.get(`/tower-hr/employeeDeparture/detail?id=${params.id}`)
        resole(data)
    }), {})
    const detailData: any = data;
    const formItemLayout = {
        labelCol: { span: 6 },
        wrapperCol: { span: 16 }
    };
    return <>
        <Spin spinning={loading}>
            <DetailContent operation={[
                <Space> 
                    <Button key="primary" onClick={() => {
                        form.validateFields().then(res=>{
                            const value= form.getFieldsValue(true);
                            value.inquiryQuotationAttachInfoDtos= attachRef.current?.getDataSource()
                            RequestUtil.post(`/tower-hr/employeeDeparture/save`,value)
                        })
                        
                    }}>保存</Button>
                    <Button key="primary" onClick={() => history.goBack()}>保存并提交审批</Button>
                    <Button key="goback" onClick={() => history.goBack()}>返回</Button>
                </Space>
            ]}>
            <DetailTitle title="员工离职管理"/>
            <Form form={ form } { ...formItemLayout }>
                <Row>
                    <Col span={12}>
                        <Form.Item label='员工姓名' rules={[{
                            required:true, 
                            message:'请选择员工姓名'
                        }]} initialValue={1} name='employeeName'>
                            <DatePicker format="YYYY-MM-DD" style={{ width: '100%' }} onChange={e=>{
                                console.log(e)
                                // let newTime =new Date(new Date(e).setHours(new Date(e).getMonth() + weldingCompletionTime));
                                // form.setFieldsValue()
                            }}/>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label='公司' name='companyName'>
                            <Input/>
                        </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={12}>
                        <Form.Item label='部门/班组' name='departmentName'>
                            <Input/>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label='岗位' name='postName'>
                            <Input/>
                        </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={12}>
                        <Form.Item label='入职日期' name='inductionDate'>
                            <Input/>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label='员工性质' name='employeeType'>
                            <Input/>
                        </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={12}>
                        <Form.Item label='离职日期' rules={[{
                            required:true, 
                            message:'请选择离职日期'
                        }]} name='departureDate'>
                            <DatePicker format="YYYY-MM-DD" style={{ width: '100%' }} onChange={e=>{
                                console.log(e)
                                // let newTime =new Date(new Date(e).setHours(new Date(e).getMonth() + weldingCompletionTime));
                                // form.setFieldsValue()
                            }}/>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label='离职类型' rules={[{
                            required:true, 
                            message:'请选择离职类型'
                        }]} name='departureType'>
                            <Select placeholder="请选择" style={{ width: '100%' }} >
                                <Select.Option value={0} key="0">主动离职</Select.Option>
                                <Select.Option value={1} key="1">辞退</Select.Option>
                                <Select.Option value={2} key="2">退休</Select.Option>
                                <Select.Option value={3} key="3">死亡</Select.Option>
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={24}>
                        <Form.Item label='离职原因' rules={[{
                            required:true, 
                            message:'请填写离职原因'
                        }]} name='departureReason'>
                            <Input.TextArea maxLength={200} showCount/>
                        </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={24}>
                        <Form.Item label='备注' name='remark'>
                            <Input.TextArea maxLength={400} showCount/>
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
            </DetailContent>
        </Spin>
    </>
}