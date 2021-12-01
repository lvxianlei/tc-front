import React, { useRef } from 'react'
import { Button, Spin, Space, Form, Select, DatePicker, Row, Col, Input, message} from 'antd';
import { useHistory, useParams } from 'react-router-dom';
import { DetailContent, CommonTable, DetailTitle, Attachment, BaseInfo, AttachmentRef } from '../../common';
import useRequest from '@ahooksjs/use-request';
import RequestUtil from '../../../utils/RequestUtil';
import TextArea from 'antd/lib/input/TextArea';


export default function Edit(): React.ReactNode {
    const history = useHistory()
    const params = useParams<{ id: string, status: string }>();
    const [form] = Form.useForm();
    const attachRef = useRef<AttachmentRef>()
    const { loading, data } = useRequest(() => new Promise(async (resole, reject) => {
        const data: any = params.id && await RequestUtil.get(`/tower-hr/labor/contract/detail`,{contractId: params.id})
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
                            value.fileDTOS= attachRef.current?.getDataSource();
                            value.id = params.id;
                            RequestUtil.post(`/tower-hr/labor/contract`, value).then(()=>{
                                message.success('保存成功！')
                            }).then(()=>{
                                history.goBack()
                            })
                        })
                        
                    }}>保存</Button>
                    {params.status&& params.status!=='3' && <Button key="primary" onClick={() => {
                        form.validateFields().then(res=>{
                            const value= form.getFieldsValue(true);
                            value.fileDTOS= attachRef.current?.getDataSource();
                            value.id = params.id;
                            RequestUtil.post(`/tower-hr/labor/contract`, value).then(()=>{
                                message.success('保存成功！')
                            }).then(()=>{
                                history.goBack()
                            })
                        })
                        
                    }}>保存并提交审批</Button>}
                    <Button key="goback" onClick={() => history.goBack()}>返回</Button>
                </Space>
            ]}>
            <DetailTitle title="员工入职信息"/>
            <Form form={ form } { ...formItemLayout }>
                <Row>
                    <Col span={12}>
                        <Form.Item label='应聘人姓名' name='contractNumber' rules={[{
                            required:true, 
                            message:'请填写应聘人姓名'
                        }]}>
                            <Input/>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label='性别' name='employeeName' rules={[{
                            required:true, 
                            message:'请填写应聘人姓名'
                        }]}>
                            <Input/>
                        </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={12}>
                        <Form.Item label='民族' name='companyName' rules={[{
                            required:true, 
                            message:'请填写民族'
                        }]}>
                            <Input/>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label='入职公司' name='companyName'>
                            <Input/>
                        </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={12}>
                        <Form.Item label='入职部门/班组' name='departmentName' rules={[{
                            required:true, 
                            message:'请选择入职部门/班组'
                        }]}>
                            <Input/>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label='入职岗位' rules={[{
                            required:true, 
                            message:'请选择入职岗位'
                        }]} name='signedCompany'>
                            <Select placeholder="请选择" style={{ width: '100%' }} >
                                <Select.Option value={0} key="0">主任</Select.Option>
                                <Select.Option value={1} key="1">人资专员</Select.Option>
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={12}>
                        <Form.Item label='籍贯' rules={[{
                            required:true, 
                            message:'请填写籍贯'
                        }]} name='contractStartDate'>
                            <Input/>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label='身份证号' rules={[{
                            required:true, 
                            message:'请填写身份证号'
                        }]} name='contractEndDate'>
                            <Input/>
                        </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={12}>
                        <Form.Item label='员工分组' rules={[{
                            required:true, 
                            message:'请选择员工分组'
                        }]} name='contractStartDate'>
                            <Input/>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label='年龄' name='age'>
                            <Input/>
                        </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={12}>
                        <Form.Item label='联系电话' rules={[{
                            required:true, 
                            message:'请填写联系电话'
                        }]} name='contractStartDate'>
                            <Input/>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label='预计到岗时间' rules={[{
                            required:true, 
                            message:'请选择预计到岗时间'
                        }]} name='contractEndDate'>
                            <DatePicker format="YYYY-MM-DD" style={{ width: '100%' }} />
                        </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={12}>
                        <Form.Item label='学历' rules={[{
                            required:true, 
                            message:'请选择学历'
                        }]} name='contractStartDate'>
                            <Select placeholder="请选择" style={{ width: '100%' }} >
                                <Select.Option value={0} key="0">博士</Select.Option>
                                <Select.Option value={1} key="1">硕士</Select.Option>
                                <Select.Option value={2} key="2">本科</Select.Option>
                                <Select.Option value={3} key="3">大专</Select.Option>
                                <Select.Option value={4} key="4">高中</Select.Option>
                                <Select.Option value={5} key="5">中专</Select.Option>
                                <Select.Option value={6} key="6">中学</Select.Option>
                                <Select.Option value={7} key="7">小学</Select.Option>
                                <Select.Option value={8} key="8">其他</Select.Option>
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label='毕业院校' name='contractEndDate'>
                            <Input/>
                        </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={12}>
                        <Form.Item label='专业' name='contractStartDate'>
                            <Input/>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label='试用期' rules={[{
                            required:true, 
                            message:'请选择试用期'
                        }]} name='contractEndDate'>
                            <Select placeholder="请选择" style={{ width: '100%' }} >
                                <Select.Option value={0} key="0">无试用期</Select.Option>
                                <Select.Option value={1} key="1">1个月</Select.Option>
                                <Select.Option value={2} key="2">2个月</Select.Option>
                                <Select.Option value={3} key="3">3个月</Select.Option>
                                <Select.Option value={4} key="4">4个月</Select.Option>
                                <Select.Option value={5} key="5">5个月</Select.Option>
                                <Select.Option value={6} key="6">6个月</Select.Option>
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={12}>
                        <Form.Item label='银行卡号' rules={[{
                            required:true, 
                            message:'请填写银行卡号'
                        }]} name='contractStartDate'>
                            <Input/>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label='开户行' rules={[{
                            required:true, 
                            message:'请选择开户行'
                        }]} name='contractEndDate'>
                            <DatePicker format="YYYY-MM-DD" style={{ width: '100%' }} />
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