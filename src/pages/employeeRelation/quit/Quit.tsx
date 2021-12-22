import React, { useRef, useState } from 'react'
import { Button, Spin, Space, Form, Select, DatePicker, Row, Col, Input, message} from 'antd';
import { useHistory, useParams } from 'react-router-dom';
import { DetailContent, CommonTable, DetailTitle, Attachment, BaseInfo, AttachmentRef, FormItemType } from '../../common';
import useRequest from '@ahooksjs/use-request';
import RequestUtil from '../../../utils/RequestUtil';
import TextArea from 'antd/lib/input/TextArea';
import EmployeeUserSelectionComponent, { IUser } from '../EmployeeUserModal';
import moment from 'moment';


export default function Quit(): React.ReactNode {
    const history = useHistory()
    const params = useParams<{ id: string }>();
    const [form] = Form.useForm();
    const attachRef = useRef<AttachmentRef>();
    const [ selectedRows, setSelectedRows ] = useState<IUser[] | any>({});
    const [ post, setPost ] = useState([]);
    const { loading, data } = useRequest(() => new Promise(async (resole, reject) => {
        const post: any = await RequestUtil.get(`/tower-system/station?size=1000`);
        setPost(post?.records)
        const data: any = params.id !== '0' && await RequestUtil.get(`/tower-hr/employeeDeparture/detail?id=${params.id}`)
        form.setFieldsValue(params.id!=='0'?{
            ...data,
            inductionDate: data?.departureDate?moment(data?.inductionDate):'',
            departureDate: data?.departureDate?moment(data?.departureDate):'',
            newDepartmentName: data.departmentId!=='0'?data.departmentName+'/'+data.teamName:data.teamName,
        }:{})
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
                    <Button type="primary" onClick={async () => {
                        await form.validateFields();
                        const value= form.getFieldsValue(true);
                        const postValue = {
                            ...value,
                            id : params.id&&params.id!=='0'?params.id:undefined,
                            departureDate: value.departureDate?moment(value.departureDate).format('YYYY-MM-DD')+' 00:00:00':undefined,
                            submitType: 'save',
                        }
                        RequestUtil.post(`/tower-hr/employeeDeparture/save`,postValue).then(()=>{
                            message.success('保存成功！')
                            history.push(`/employeeRelation/quit`)
                        })
                    }}>保存</Button>
                    <Button type="primary" onClick={async () => {
                        await form.validateFields();
                        const value= form.getFieldsValue(true);
                        const postValue = {
                            ...value,
                            id : params.id&&params.id!=='0'?params.id:undefined,
                            departureDate: value.departureDate?moment(value.departureDate).format('YYYY-MM-DD')+' 00:00:00':undefined,
                            submitType: 'submit',
                        }
                        RequestUtil.post(`/tower-hr/employeeDeparture/save`,postValue).then(()=>{
                            message.success('提交成功！')
                            history.push(`/employeeRelation/quit`)
                        })
                        
                    }}>保存并提交审批</Button>
                    <Button key="goback" onClick={() => history.push(`/employeeRelation/quit`)}>返回</Button>
                </Space>
            ]}>
            <DetailTitle title="员工离职管理"/>
            <Form form={ form } { ...formItemLayout }>
                <Row>
                    <Col span={12}>
                        <Form.Item label='员工姓名' rules={[{
                            required:true, 
                            message:'请选择员工姓名'
                        }]}  name='employeeName'>
                            <Input maxLength={ 50 } value={ detailData?.employeeName||'' } addonAfter={ <EmployeeUserSelectionComponent onSelect={ (selectedRows: IUser[] | any) => {
                                    setSelectedRows(selectedRows);
                                    form.resetFields();
                                    form.setFieldsValue({
                                        employeeName: selectedRows[0].employeeName,
                                        companyName: selectedRows[0].companyName,
                                        departmentId: selectedRows[0].departmentId,
                                        teamId: selectedRows[0].teamId,
                                        departmentName: selectedRows[0].departmentName,
                                        teamName: selectedRows[0].teamName,
                                        newDepartmentName: selectedRows[0].Id!=='0'?selectedRows[0].departmentName+'/'+selectedRows[0].teamName:selectedRows[0].teamName,
                                        postId: selectedRows[0].postId,
                                        inductionDate: selectedRows[0].inductionDate?moment(selectedRows[0].inductionDate):'',
                                        employeeNature: selectedRows[0].employeeNature,
                                        employeeId: selectedRows[0].id,
                                    });
                            } } buttonType="link" buttonTitle="+选择员工" type={1}/> } disabled/>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label='公司' name='companyName'>
                            <Input disabled/>
                        </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={12}>
                        <Form.Item label='部门/班组' name='newDepartmentName'>
                            <Input disabled/>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label='岗位' name='postId'>
                            <Select style={{width:'100%'}} disabled>
                                {post && post.map((item: any) => {
                                    return <Select.Option key={item.id} value={item.id}>{item.stationName}</Select.Option>
                                })}
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={12}>
                        <Form.Item label='入职日期' name='inductionDate'>
                            <DatePicker  style={{ width: '100%' }} disabled/>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label='员工性质' name='employeeNature'>
                            <Select placeholder="请选择" style={{ width: '100%' }} disabled>
                                <Select.Option value={1} key="1">正式员工</Select.Option>
                                <Select.Option value={2} key="2">短期派遣员工</Select.Option>
                                <Select.Option value={3} key="3">超龄员工</Select.Option>
                                <Select.Option value={4} key="4">实习员工</Select.Option>
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={12}>
                        <Form.Item label='离职日期' rules={[{
                            required:true, 
                            message:'请选择离职日期'
                        }]} name='departureDate'>
                            <FormItemType data={{
                                disabledDate:(current:any)=>{
                                    return current && current< form.getFieldsValue().inductionDate
                                },
                                format:"YYYY-MM-DD"}} type="date" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label='离职类型' rules={[{
                            required:true, 
                            message:'请选择离职类型'
                        }]} name='departureType'>
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
                    <Col span={24}>
                        <Form.Item label='离职原因' rules={[{
                            required:true, 
                            message:'请填写离职原因'
                        }]} name='departureReason' labelCol= {{span:3}} wrapperCol={{ span: 20 }}>
                            <Input.TextArea maxLength={200} showCount/>
                        </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={24}>
                        <Form.Item label='备注' name='remark' labelCol= {{span:3}} wrapperCol={{ span: 20 }}>
                            <Input.TextArea maxLength={400} showCount/>
                        </Form.Item>
                    </Col>
                </Row>
                <Form.Item label='' name='employeeId'>
                    <Input type='hidden'/>
                </Form.Item>
            </Form>
            </DetailContent>
        </Spin>
    </>
}