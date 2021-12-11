import React, { useRef, useState } from 'react'
import { Button, Spin, Space, Form, Select, DatePicker, Row, Col, Input, message, InputNumber} from 'antd';
import { useHistory, useParams } from 'react-router-dom';
import { DetailContent, CommonTable, DetailTitle, Attachment, BaseInfo, AttachmentRef } from '../../common';
import useRequest from '@ahooksjs/use-request';
import RequestUtil from '../../../utils/RequestUtil';
import EmployeeUserSelectionComponent, { IUser } from '../EmployeeUserModal';
import EmployeeDeptSelectionComponent, { IDept } from '../EmployeeDeptModal';
import AuthUtil from '../../../utils/AuthUtil';
import moment from 'moment';

export default function RecruitEdit(): React.ReactNode {
    const history = useHistory()
    const params = useParams<{ id: string, status: string }>();
    const [form] = Form.useForm();
    const attachRef = useRef<AttachmentRef>();
    const [ selectedUserRows, setSelectedUserRows ] = useState<IUser[] | any>({});
    const [ selectedDeptRows, setSelectedDeptRows ] = useState<IDept[] | any>({});
    const [post, setPost] = useState([]);
    const { loading, data } = useRequest(() => new Promise(async (resole, reject) => {
        const data: any = params.id&&params.id !== '0' && await RequestUtil.get(`/tower-hr/employeeReinstatement/detail?id=${params.id}`);
        const post: any = await RequestUtil.get(`/tower-system/station?size=1000`);
        setPost(post?.records)
        form.setFieldsValue( params.id&&params.id!=='0'?{
            ...data,
            newDepartmentName: data?.departmentName+'/'+data?.teamName,
            inductionDate: data?.inductionDate?moment(data?.inductionDate):'',
            departureDate: data?.departureDate?moment(data?.departureDate):'',
            reinstatementDate: data?.reinstatementDate?moment(data?.reinstatementDate):'',
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
                    <Button type="primary" onClick={() => {
                        form.validateFields().then(res=>{
                            const value= form.getFieldsValue(true);
                            value.id =  params.id&&params.id!=='0'?params.id:undefined;
                            value.reinstatementDate = moment(value.reinstatementDate).format('YYYY-MM-DD HH:mm:ss');
                            value.inductionDate= value.inductionDate?moment(value.inductionDate).format('YYYY-MM-DD HH:mm:ss'):undefined;
                            value.departureDate= value.departureDate?moment(value.departureDate).format('YYYY-MM-DD HH:mm:ss'):undefined;
                            value.submitType = 'save';
                            RequestUtil.post(`/tower-hr/employeeReinstatement/save`,value).then(()=>{
                                message.success('保存成功！')
                            }).then(()=>{
                                history.push('/employeeRelation/reinstate')
                            })
                        })
                        
                    }}>保存</Button>
                    {params.status!=='3' && <Button type="primary" onClick={() =>{
                        form.validateFields().then(res=>{
                            const value= form.getFieldsValue(true);
                            value.id =  params.id&&params.id!=='0'?params.id:undefined;
                            value.reinstatementDate = moment(value.reinstatementDate).format('YYYY-MM-DD HH:mm:ss');
                            value.inductionDate= value.inductionDate?moment(value.inductionDate).format('YYYY-MM-DD HH:mm:ss'):undefined;
                            value.departureDate= value.departureDate?moment(value.departureDate).format('YYYY-MM-DD HH:mm:ss'):undefined;
                            value.submitType = 'submit';
                            RequestUtil.post(`/tower-hr/employeeReinstatement/save`,value).then(()=>{
                                message.success('提交成功！')
                            }).then(()=>{
                                history.push('/employeeRelation/reinstate')
                            })
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
                            <Input maxLength={ 50 } value={ detailData?.employeeName||'' } addonAfter={ <EmployeeUserSelectionComponent onSelect={ (selectedRows: IUser[] | any) => {
                                    setSelectedUserRows(selectedRows);
                                    form.resetFields();
                                    form.setFieldsValue({
                                        employeeName: selectedRows[0].employeeName,
                                        employeeId: selectedRows[0].id,
                                        inductionDate: selectedRows[0].inductionDate?moment(selectedRows[0].inductionDate):'',
                                        departureDate: selectedRows[0].departureDate?moment(selectedRows[0].departureDate):'',
                                        departureType: selectedRows[0].departureType,
                                        departureReason: selectedRows[0].departureReason,
                                    });
                            } } buttonType="link" buttonTitle="+选择员工" type={2} /> } disabled/>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label='入职日期' name='inductionDate'>
                            <DatePicker disabled format='YYYY-MM-DD' style={{width:'100%'}}/>
                        </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={12}>
                        <Form.Item label='离职日期' name='departureDate'>
                            <DatePicker disabled format='YYYY-MM-DD' style={{width:'100%'}}/>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label='离职类型' name='departureType'>
                            <Select placeholder="请选择" style={{ width: '100%' }} disabled>
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
                            <Input.TextArea maxLength={400} showCount disabled/>
                        </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={12}>
                        <Form.Item label='复职日期' rules={[{
                            required:true, 
                            message:'请选择复职日期'
                        }]} name='reinstatementDate'>
                            <DatePicker format="YYYY-MM-DD" style={{ width: '100%' }}
                                disabledDate={(current)=>{
                                    return current && current< form.getFieldsValue().departureDate
                                }}
                            />
                        </Form.Item>
                    </Col>
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
                    
                </Row>
                <Row>
                    <Col span={12}>
                        <Form.Item label='复职后部门/班组' rules={[{
                            required:true, 
                            message:'请选择复职后部门/班组'
                        }]} name='newDepartmentName'>
                            <Input maxLength={ 50 }  addonAfter={ <EmployeeDeptSelectionComponent onSelect={ (selectedRows: IDept[] | any) => {
                                    setSelectedDeptRows(selectedRows);
                                    const value = form.getFieldsValue(true);
                                    form.setFieldsValue({
                                        ...value,
                                        newDepartmentName: selectedRows[0].parentId!=='0'?selectedRows[0].parentName+'/'+selectedRows[0].name:selectedRows[0].name,
                                        departmentId: selectedRows[0].parentId,
                                        teamId: selectedRows[0].id,
                                        companyName: AuthUtil.getTenantName(),
                                    });
                            } } buttonType="link" buttonTitle="+选择部门" /> } disabled/>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label='复职后公司' name='companyName'>
                            <Input disabled/>
                        </Form.Item>
                    </Col>
                    
                </Row>
                <Row>
                    <Col span={12}>
                        <Form.Item label='复职后岗位'rules={[{
                            required:true, 
                            message:'请选择复职后岗位'
                        }]} name='postId'>
                            <Select style={{width:'100%'}}>
                                {post && post.map((item: any) => {
                                    return <Select.Option key={item.id} value={item.id}>{item.stationName}</Select.Option>
                                })}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label='试用期'rules={[{
                            required:true, 
                            message:'请选择试用期'
                        }]} name='probationPeriod'>
                            <Select placeholder="请选择" style={{ width: '100%' }} >
                                <Select.Option value={0} key="0">无试用期</Select.Option>
                                <Select.Option value={1} key="1">一个月</Select.Option>
                                <Select.Option value={2} key="2">二个月</Select.Option>
                                <Select.Option value={3} key="3">三个月</Select.Option>
                                <Select.Option value={4} key="4">四个月</Select.Option>
                                <Select.Option value={5} key="5">五个月</Select.Option>
                                <Select.Option value={6} key="6">六个月</Select.Option>
                            </Select>
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
                <Row>
                    <Col span={4}>
                        <Form.Item label='' name='departmentId'>
                            <Input  type="hidden"/>
                        </Form.Item>
                    </Col>
                    <Col span={4}>
                        <Form.Item label='' name='teamId'>
                            <Input  type="hidden"/>
                        </Form.Item>
                    </Col>
                    <Col span={4}>
                        <Form.Item label='' name='employeeId'>
                            <Input  type="hidden"/>
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
            </DetailContent>
        </Spin>
    </>
}