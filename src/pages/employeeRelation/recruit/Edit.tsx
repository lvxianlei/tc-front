import React, { useRef, useState } from 'react'
import { Button, Spin, Space, Form, Select, DatePicker, Row, Col, Input, message} from 'antd';
import { useHistory, useParams } from 'react-router-dom';
import { DetailContent, CommonTable, DetailTitle, Attachment, BaseInfo, AttachmentRef } from '../../common';
import useRequest from '@ahooksjs/use-request';
import RequestUtil from '../../../utils/RequestUtil';
import TextArea from 'antd/lib/input/TextArea';
import { RuleObject } from 'antd/lib/form';
import { StoreValue } from 'antd/lib/form/interface';
import AuthUtil from '../../../utils/AuthUtil';
import EmployeeDeptSelectionComponent, { IDept } from '../EmployeeDeptModal';
import { bankTypeOptions, employeeTypeOptions } from '../../../configuration/DictionaryOptions';
import moment from 'moment';


export default function RecruitEdit(): React.ReactNode {
    const history = useHistory()
    const params = useParams<{ id: string, status: string }>();
    const [form] = Form.useForm();
    const attachRef = useRef<AttachmentRef>();
    const [post, setPost] = useState([]);
    const [ selectedDeptRows, setSelectedDeptRows ] = useState<IDept[] | any>({});
    const { loading, data } = useRequest(() => new Promise(async (resole, reject) => {
        const data: any = params.id && await RequestUtil.get(`/tower-hr/employee/information/detail`,{archivesId: params.id})
        const post: any = await RequestUtil.get(`/tower-system/station?size=1000`);
        setPost(post?.records)
        form.setFieldsValue(params.id?{
            ...data,
            workTime: data?.workTime?moment(data?.workTime):'',
            postType: data?.postType?data?.postType.split(','):[]
        }:{})
        resole(data)
    }), {})
    const detailData: any = data;
    const formItemLayout = {
        labelCol: { span: 6 },
        wrapperCol: { span: 16 }
    };
    const verifyID=(idcode: string)=>{
        // 加权因子
        const weight_factor = [7,9,10,5,8,4,2,1,6,3,7,9,10,5,8,4,2];
        // 校验码
        const check_code = ['1', '0', 'X' , '9', '8', '7', '6', '5', '4', '3', '2'];
        const code = idcode + "";
        const last = idcode[17];//最后一位
        const seventeen = code.substring(0,17);
        // ISO 7064:1983.MOD 11-2
        // 判断最后一位校验码是否正确
        const arr = seventeen.split("");
        let num = 0;
        arr.forEach((item: string, index: number) => {
            num = num + Number(arr[index]) * weight_factor[index];
        })
        // 获取余数
        const resisue = num % 11;
        const last_no = check_code[resisue];
        const idcard_patter = /^[1-9][0-9]{5}([1][9][0-9]{2}|[2][0][0|1][0-9])([0][1-9]|[1][0|1|2])([0][1-9]|[1|2][0-9]|[3][0|1])[0-9]{3}([0-9]|[X])$/;
        // 判断格式是否正确
        var format = idcard_patter.test(idcode);
        // 返回验证结果，校验码和格式同时正确才算是合法的身份证号码
        return last === last_no && format ? true : false;
    }


    const checkcustomerPhone = (value: StoreValue): Promise<void | any> =>{
        return new Promise(async (resolve, reject) => {  // 返回一个promise
            const regPhone: RegExp = /^1[3|4|5|6|7|8|9][0-9]\d{8}$/;
            const regTel: RegExp = /^\d{3}-\d{8}|\d{4}-\d{7}$/;
            if(regPhone.test(value) || regTel.test(value) ) {
                resolve(true)
            } else 
                resolve(false)
        }).catch(error => {
            Promise.reject(error)
        })
    }
    return <>
        <Spin spinning={loading}>
            <DetailContent operation={[
                <Space> 
                    <Button type="primary" onClick={() => {
                        form.validateFields().then(res=>{
                            const value= form.getFieldsValue(true);
                            value.fileDTOS= attachRef.current?.getDataSource();
                            value.id = params.id;
                            value.workTime = moment(value.workTime).format('YYYY-MM-DD HH:mm:ss');
                            value.postType = value.postType.length>0&&value.postType.join(',')
                            value.submitType = 'save';
                            RequestUtil.post(`/tower-hr/employee/information`, value).then(()=>{
                                message.success('保存成功！')
                            }).then(()=>{
                                history.push('/employeeRelation/recruit')
                            })
                        })
                        
                    }}>保存</Button>
                    {params.status!=='3' && <Button type="primary" onClick={() => {
                        form.validateFields().then(res=>{
                            const value= form.getFieldsValue(true);
                            value.fileDTOS= attachRef.current?.getDataSource();
                            value.id = params.id;
                            value.workTime = moment(value.workTime).format('YYYY-MM-DD HH:mm:ss');
                            value.postType = value.postType.join(',')
                            value.submitType = 'submit';
                            RequestUtil.post(`/tower-hr/employee/information`, value).then(()=>{
                                message.success('提交成功！')
                            }).then(()=>{
                                history.push('/employeeRelation/recruit')
                            })
                        })
                        
                    }}>保存并提交审批</Button>}
                    <Button key="goback" onClick={() => history.push('/employeeRelation/recruit')}>返回</Button>
                </Space>
            ]}>
            <DetailTitle title="员工入职信息"/>
            <Form form={ form } { ...formItemLayout }>
                <Row>
                    <Col span={12}>
                        <Form.Item label='应聘人姓名' name='employeeName' rules={[{
                            required:true, 
                            message:'请填写应聘人姓名',
                            
                        },{
                            pattern: /^[^\s]*$/,
                            message: '禁止输入空格',
                        }]}>
                            <Input/>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label='性别' name='gender' rules={[{
                            required:true, 
                            message:'请选择性别'
                        }]}>
                            <Select placeholder="请选择" style={{ width: '100%' }} >
                                <Select.Option value={'男'} key="0">男</Select.Option>
                                <Select.Option value={'女'} key="1">女</Select.Option>
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={12}>
                        <Form.Item label='民族' name='national' rules={[{
                            required:true, 
                            message:'请填写民族'
                        },{
                            pattern: /^[^\s]*$/,
                            message: '禁止输入空格',
                        }]}>
                            <Input/>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label='入职公司' name='companyName'>
                            <Input disabled/>
                        </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={12}>
                        <Form.Item label='入职部门/班组' rules={[{
                            required:true, 
                            message:'请选择入职部门/班组'
                        }]} name='newDepartmentName'>
                            <Input maxLength={ 50 } value={ detailData?.employeeName||'' } addonAfter={ <EmployeeDeptSelectionComponent onSelect={ (selectedRows: IDept[] | any) => {
                                    setSelectedDeptRows(selectedRows);
                                    form.setFieldsValue({
                                        employeeName: selectedRows[0].employeeName,
                                        newDepartmentName: selectedRows[0].parentName+'/'+selectedRows[0].name,
                                        departmentId: selectedRows[0].parentId,
                                        teamId: selectedRows[0].id,
                                        companyName: AuthUtil.getTenantName(),
                                    });
                            } } buttonType="link" buttonTitle="+选择部门" /> } disabled/>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label='入职岗位' rules={[{
                            required:true, 
                            message:'请选择入职岗位'
                        }]} name='postId'>
                            <Select style={{width:'100%'}}>
                                {post && post.map((item: any) => {
                                    return <Select.Option key={item.id} value={item.id}>{item.stationName}</Select.Option>
                                })}
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={12}>
                        <Form.Item label='籍贯' rules={[{
                            required:true, 
                            message:'请填写籍贯'
                        },{
                            pattern: /^[^\s]*$/,
                            message: '禁止输入空格',
                        }]} name='nativePlace'>
                            <Input/>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label='身份证号' rules={[{
                           required: true,
                           validator: (rule: RuleObject, value: string, callback: (error?: string) => void) => {
                               if(value && value !== '') {
                                   if(!verifyID(value)) {
                                       callback('请核对身份证号信息！')
                                   } else {
                                       callback()
                                   }
                               } else {
                                   callback('请输入身份证号')
                               }
                           }
                        }]} name='idNumber'>
                            <Input onChange={(e:any)=>{
                                let myDate = new Date();
                                let month = myDate.getMonth() + 1;
                                let day = myDate.getDate();
                                let age = e.target.value.substring(6, 10) && myDate.getFullYear() - e.target.value.substring(6, 10) - 1;
                                if (e.target.value.substring(12, 14)&& (e.target.value.substring(10, 12) < month || e.target.value.substring(10, 12) == month && e.target.value.substring(12, 14) <= day)) {
                                    age++;
                                }
                                form.setFieldsValue({
                                    age: age
                                })
                            }}/>
                        </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={12}>
                        <Form.Item label='员工分组' rules={[{
                            required:true, 
                            message:'请选择员工分组'
                        }]} name='postType'>
                            <Select style={{width:'100%'}} mode="multiple">
                                {employeeTypeOptions && employeeTypeOptions.map((item: any) => {
                                    return <Select.Option key={item.id} value={item.id}>{item.name}</Select.Option>
                                })}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label='年龄' name='age'>
                            <Input disabled/>
                        </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={12}>
                        <Form.Item label='联系电话' rules={[{
                            required: true,
                            validator: (rule: RuleObject, value: StoreValue, callback: (error?: string) => void) => {
                                if(value) {
                                    checkcustomerPhone(value).then(res => {
                                        if (res) {
                                            callback()
                                        } else {
                                            callback('请核对电话信息！')
                                        }
                                    })
                                } else {
                                    callback('请输入联系电话')
                                }
                                    
                            }
                        }]} name='phoneNumber'>
                            <Input/>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label='预计到岗时间' rules={[{
                            required:true, 
                            message:'请选择预计到岗时间'
                        }]} name='workTime'>
                            <DatePicker format="YYYY-MM-DD" style={{ width: '100%' }} />
                        </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={12}>
                        <Form.Item label='学历' rules={[{
                            required:true, 
                            message:'请选择学历'
                        }]} name='education'>
                            <Select placeholder="请选择" style={{ width: '100%' }} >
                                <Select.Option value={1} key="1">博士</Select.Option>
                                <Select.Option value={2} key="2">硕士</Select.Option>
                                <Select.Option value={3} key="3">本科</Select.Option>
                                <Select.Option value={4} key="4">大专</Select.Option>
                                <Select.Option value={5} key="5">高中</Select.Option>
                                <Select.Option value={6} key="6">中专</Select.Option>
                                <Select.Option value={7} key="7">中学</Select.Option>
                                <Select.Option value={8} key="8">小学</Select.Option>
                                <Select.Option value={9} key="9">其他</Select.Option>
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label='毕业院校' name='graduateSchool'>
                            <Input/>
                        </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={12}>
                        <Form.Item label='专业' name='professional'>
                            <Input/>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label='试用期' rules={[{
                            required:true, 
                            message:'请选择试用期'
                        }]} name='probationPeriod'>
                            <Select placeholder="请选择" style={{ width: '100%' }} >
                                <Select.Option value={1} key="1">无试用期</Select.Option>
                                <Select.Option value={2} key="2">1个月</Select.Option>
                                <Select.Option value={3} key="3">2个月</Select.Option>
                                <Select.Option value={4} key="4">3个月</Select.Option>
                                <Select.Option value={5} key="5">4个月</Select.Option>
                                <Select.Option value={6} key="6">5个月</Select.Option>
                                <Select.Option value={7} key="7">6个月</Select.Option>
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={12}>
                        <Form.Item label='银行卡号' rules={[{
                            required:true, 
                            message:'请填写银行卡号'
                        },{
                            pattern: /^[^\s]*$/,
                            message: '禁止输入空格',
                        }]} name='bankCardNumber'>
                            <Input/>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label='开户银行' rules={[{
                            required:true, 
                            message:'请选择开户银行'
                        }]} name='bankNameId'>
                           <Select style={{width:'100%'}}>
                                {bankTypeOptions && bankTypeOptions.map((item: any) => {
                                    return <Select.Option key={item.id} value={item.id}>{item.name}</Select.Option>
                                })}
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
                    <Col span={12}>
                        <Form.Item label='' name='departmentId'>
                            <Input  type="hidden"/>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label='' name='teamId'>
                            <Input  type="hidden"/>
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
            </DetailContent>
        </Spin>
    </>
}