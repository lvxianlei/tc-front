import React, { useRef } from 'react'
import { Button, Spin, Space, Form, Select, DatePicker, Row, Col, Input, message} from 'antd';
import { useHistory, useParams } from 'react-router-dom';
import { DetailContent, CommonTable, DetailTitle, Attachment, BaseInfo, AttachmentRef } from '../../common';
import useRequest from '@ahooksjs/use-request';
import { baseInfoData } from './full.json';
import RequestUtil from '../../../utils/RequestUtil';
import TextArea from 'antd/lib/input/TextArea';
import moment from 'moment';


export default function Sure(): React.ReactNode {
    const history = useHistory()
    const params = useParams<{ id: string }>();
    const [form] = Form.useForm();
    const attachRef = useRef<AttachmentRef>()
    const { loading, data } = useRequest(() => new Promise(async (resole, reject) => {
        const data: any = await RequestUtil.get(`/tower-hr/positive/check/detail?positiveId=${params.id}`);
        data.newDepartmentName = data.departmentName+'/'+data.teamName;
        form.setFieldsValue({
            ...data,
            checkResult: 2,
            positiveDate: data.positiveDate?moment(data.positiveDate):''
        })
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
                            value.fileIds= attachRef.current?.getDataSource().map((item:any)=>{
                                return item.id
                            });
                            value.positiveDate= moment(value.positiveDate).format('YYYY-MM-DD HH:mm:ss');
                            value.submitType='save';
                            value.checkResult = value.checkResult===1?'提前转正':value.checkResult===2?'正常转正':'延期转正'
                            value.id = params.id;
                            value.employeeId = detailData.employeeId;
                            RequestUtil.post(`/tower-hr/positive/check`, value).then(()=>{
                                message.success('保存成功！')
                            }).then(()=>{
                                history.goBack()
                            })
                            
                        })
                        
                    }}>保存</Button>
                    <Button type="primary" onClick={() => {
                        form.validateFields().then(res=>{
                           
                            const value= form.getFieldsValue(true);
                            value.fileIds= attachRef.current?.getDataSource().map((item:any)=>{
                                return item.id
                            });
                            value.positiveDate= moment(value.positiveDate).format('YYYY-MM-DD HH:mm:ss');
                            value.submitType='submit';
                            value.id = params.id;
                            value.checkResult = value.checkResult===1?'提前转正':value.checkResult===2?'正常转正':'延期转正'
                            value.employeeId = detailData.employeeId;
                            RequestUtil.post(`/tower-hr/positive/check`, value).then(()=>{
                                message.success('提交成功！')
                            }).then(()=>{
                                history.goBack()
                            })
                            
                        })
                    }}>保存并提交审批</Button>
                    <Button key="goback" onClick={() => history.goBack()}>返回</Button>
                </Space>
            ]}>
            <DetailTitle title="员工基本信息"/>
            <BaseInfo columns={baseInfoData} dataSource={detailData || {}} col={2}/>
            <DetailTitle title="转正管理"/>
            <Form form={ form } { ...formItemLayout }>
                <Row>
                    <Col span={12}>
                        <Form.Item label='转正日期' rules={[{
                            required:true, 
                            message:'请选择转正日期'
                        }]} name="positiveDate">
                            <DatePicker format="YYYY-MM-DD" style={{ width: '100%' }} 
                                onChange={(e)=>{
                                    const date = moment(detailData.inductionDate).add(detailData.probationPeriod-1, 'months').format('YYYY-MM-DD')
                                    console.log(date)
                                    const newDate = e?.format('YYYY-MM-DD')
                                    var formatDate1 = new Date(date)
                                    var formatDate2 = new Date(`${newDate}`)
                                    if(formatDate1.getTime() > formatDate2.getTime()){
                                        form.setFieldsValue({
                                            checkResult: 1
                                        })
                                    }
                                    if(formatDate1.getTime() === formatDate2.getTime()){
                                        form.setFieldsValue({
                                            checkResult: 2
                                        })
                                    }
                                    if(formatDate1.getTime() < formatDate2.getTime()){
                                        form.setFieldsValue({
                                            checkResult: 3
                                        })
                                    }
                                }}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label='考核结果' rules={[{
                            required:true, 
                            message:'请选择考核结果'
                        }]} name="checkResult">
                            <Select placeholder="请选择" style={{ width: '100%' }} disabled>
                                <Select.Option value={1} key="1">提前转正</Select.Option>
                                <Select.Option value={2} key="2">正常转正</Select.Option>
                                <Select.Option value={3} key="3">延期转正</Select.Option>
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={24}>
                        <Form.Item label='转正评语' rules={[{
                            required:true, 
                            message:'请填写转正评语'
                        }]} name="positiveComments" labelCol= {{span:3}} wrapperCol={{ span: 20 }}>
                            <Input.TextArea maxLength={400} showCount/>
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
            <Attachment dataSource={detailData?.fileVOList} edit ref={attachRef} />
            </DetailContent>
        </Spin>
    </>
}