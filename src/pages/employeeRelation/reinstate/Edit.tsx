import React, { useRef, useState } from 'react'
import { Button, Spin, Space, Form, Select, DatePicker, Row, Col, Input} from 'antd';
import { useHistory, useParams } from 'react-router-dom';
import { DetailContent, CommonTable, DetailTitle, Attachment, BaseInfo, AttachmentRef } from '../../common';
import useRequest from '@ahooksjs/use-request';
import RequestUtil from '../../../utils/RequestUtil';
import TextArea from 'antd/lib/input/TextArea';
import WorkshopUserSelectionComponent, { IUser } from '../WorkshopUserModal';

export default function RecruitEdit(): React.ReactNode {
    const history = useHistory()
    const params = useParams<{ id: string, status: string }>();
    const [form] = Form.useForm();
    const attachRef = useRef<AttachmentRef>();
    const [ selectedRows, setSelectedRows ] = useState<IUser[] | any>({});
    const { loading, data } = useRequest(() => new Promise(async (resole, reject) => {
        // const data: any = params.id !== '0' && await RequestUtil.get(`/tower-hr/employeeReinstatement/detail?id=${params.id}`)
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
                    <Button type="primary" onClick={() => {
                        form.validateFields().then(res=>{
                            const value= form.getFieldsValue(true);
                            RequestUtil.post(`/tower-hr/employeeReinstatement/save`,value)
                        })
                        
                    }}>保存</Button>
                    {!params.status && <Button type="primary" onClick={() =>{
                        form.validateFields().then(res=>{
                            const value= form.getFieldsValue(true);
                            RequestUtil.post(`/tower-hr/employeeReinstatement/submit`,value)
                        })
                        
                    }}>保存并提交审批</Button>}
                    <Button key="goback" onClick={() => history.goBack()}>返回</Button>
                </Space>
            ]}>
            <DetailTitle title="员工复职信息"/>
            <Form form={ form } { ...formItemLayout }>
                <Row>
                    <Col span={12}>
                        <Form.Item label='员工姓名' rules={[{
                            required:true, 
                            message:'请选择员工姓名'
                        }]} name='employeeName'>
                            <Input maxLength={ 50 } value={ detailData?.employeeName||'' } addonAfter={ <WorkshopUserSelectionComponent onSelect={ (selectedRows: IUser[] | any) => {
                                    setSelectedRows(selectedRows);
                                    form.setFieldsValue({
                                        employeeName: selectedRows[0].employeeName,
                                        inductionDate: selectedRows[0].inductionDate,
                                        departureDate: selectedRows[0].departureDate,
                                        departureType: selectedRows[0].departureType,
                                        departureReason: selectedRows[0].departureReason,
                                    });
                            } } buttonType="link" buttonTitle="+选择员工" /> } disabled/>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label='入职日期' name='inductionDate'>
                            <Input/>
                        </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={12}>
                        <Form.Item label='离职日期' name='departureDate'>
                            <Input/>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label='离职类型' name='departureType'>
                            <Select placeholder="请选择" style={{ width: '100%' }} >
                                <Select.Option value={1} key="1">主动离职</Select.Option>
                                <Select.Option value={2} key="2">辞退</Select.Option>
                                <Select.Option value={3} key="3">退休</Select.Option>
                                <Select.Option value={4} key="4">死亡</Select.Option>
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={12}>
                        <Form.Item label='离职原因' name='departureReason'>
                            <Input.TextArea maxLength={400} showCount/>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label='复职日期' rules={[{
                            required:true, 
                            message:'请选择复职日期'
                        }]} name='reinstatementDate'>
                            <DatePicker format="YYYY-MM-DD" style={{ width: '100%' }} onChange={e=>{
                                console.log(e)
                                // let newTime =new Date(new Date(e).setHours(new Date(e).getMonth() + weldingCompletionTime));
                                // form.setFieldsValue()
                            }}/>
                        </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={12}>
                        <Form.Item label='复职性质' rules={[{
                            required:true, 
                            message:'请选择复职性质'
                        }]} name='reinstatementNature'>
                            <Select placeholder="请选择" style={{ width: '100%' }} >
                                <Select.Option value={1} key="1">一次复职</Select.Option>
                                <Select.Option value={2} key="2">二次复职</Select.Option>
                                <Select.Option value={3} key="3">三次复职</Select.Option>
                                <Select.Option value={4} key="4">四次复职</Select.Option>
                                <Select.Option value={5} key="5">五次复职</Select.Option>
                                <Select.Option value={6} key="6">六次及以上</Select.Option>
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label='复职后部门/班组' rules={[{
                            required:true, 
                            message:'请选择复职后部门/班组'
                        }]} name='departmentName'>
                            <Input/>
                        </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={12}>
                        <Form.Item label='复职后公司' name='companyName'>
                            <Input/>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label='复职后岗位'rules={[{
                            required:true, 
                            message:'请选择复职后岗位'
                        }]} name='postName'>
                            <Input/>
                        </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={12}>
                        <Form.Item label='试用期'rules={[{
                            required:true, 
                            message:'请选择试用期'
                        }]} name='probationPeriod'>
                            <Select placeholder="请选择" style={{ width: '100%' }} >
                                <Select.Option value={1} key="1">无试用期</Select.Option>
                                <Select.Option value={2} key="2">一个月</Select.Option>
                                <Select.Option value={3} key="3">二个月</Select.Option>
                                <Select.Option value={4} key="4">三个月</Select.Option>
                                <Select.Option value={5} key="5">四个月</Select.Option>
                                <Select.Option value={6} key="6">五个月</Select.Option>
                                <Select.Option value={7} key="7">六个月</Select.Option>
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
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