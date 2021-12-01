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
        const data: any = params.id !== '0' && await RequestUtil.get(`/tower-hr/labor/contract/detail`,{contractId: params.id})
        resole(data)
    }), {})
    const detailData: any = data;
    const formItemLayout = {
        labelCol: { span: 6 },
        wrapperCol: { span: 16 }
    };
    const tableColumns = [
        { title: '合同编号', dataIndex: 'contractNumber', key: 'contractNumber' },
        { title: '合同公司', dataIndex: 'signedCompany', key: 'signedCompany' },
        { title: '合同类型', dataIndex: 'contractType', key: 'contractType' },
        { title: '合同开始时间', dataIndex: 'contractStartDate', key: 'contractStartDate' },
        { title: '合同结束时间', dataIndex: 'contractEndDate', key: 'contractEndDate'},
        { title: '操作', dataIndex: 'operation', key: 'operation',render: (_: any, record: any, index: number): React.ReactNode => (
            <Button type='link' onClick={()=>{
                history.push(`/employeeRelation/labour/view/${params.id}/${record.id}`)
            }}>详情</Button>) 
        }
    ]
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
                    <Button key="goback" onClick={() => history.goBack()}>返回</Button>
                </Space>
            ]}>
            <DetailTitle title="员工劳动合同"/>
            <Form form={ form } { ...formItemLayout }>
                <Row>
                    <Col span={12}>
                        <Form.Item label='劳动合同号' name='contractNumber'>
                            <Input/>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label='姓名' name='employeeName'>
                            <Input/>
                        </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={12}>
                        <Form.Item label='公司' name='companyName'>
                            <Input/>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label='部门/班组' name='departmentName'>
                            <Input/>
                        </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={12}>
                        <Form.Item label='岗位' name='postName'>
                            <Input/>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label='合同签署公司' rules={[{
                            required:true, 
                            message:'请填写合同签署公司'
                        }]} name='signedCompany'>
                            <Input/>
                        </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={12}>
                        <Form.Item label='合同开始日期' rules={[{
                            required:true, 
                            message:'请选择合同开始日期'
                        }]} name='contractStartDate'>
                            <DatePicker format="YYYY-MM-DD" style={{ width: '100%' }} onChange={e=>{
                                console.log(e)
                                // let newTime =new Date(new Date(e).setHours(new Date(e).getMonth() + weldingCompletionTime));
                                // form.setFieldsValue()
                            }}/>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label='合同截止日期' rules={[{
                            required:true, 
                            message:'请选择合同截止日期'
                        }]} name='contractEndDate'>
                            <DatePicker format="YYYY-MM-DD" style={{ width: '100%' }} onChange={e=>{
                                console.log(e)
                                // let newTime =new Date(new Date(e).setHours(new Date(e).getMonth() + weldingCompletionTime));
                                // form.setFieldsValue()
                            }}/>
                        </Form.Item>
                    </Col>
                </Row>
                <Row>
                    { params.status === 'edit' && <Col span={12} >
                        <Form.Item label='身份证号' name='idNumber'>
                            <Input/>
                        </Form.Item>
                    </Col>}
                    <Col span={12}>
                        <Form.Item label='合同类型' rules={[{
                            required:true, 
                            message:'请选择合同类型'
                        }]} name='contractType'>
                            <Select placeholder="请选择" style={{ width: '100%' }} >
                                <Select.Option value={0} key="0">固定期限劳动合同</Select.Option>
                                <Select.Option value={1} key="1">无固定期限劳动合同</Select.Option>
                                <Select.Option value={2} key="2">超龄返聘合同</Select.Option>
                                <Select.Option value={3} key="3">实习合同</Select.Option>
                                <Select.Option value={4} key="4">其他合同</Select.Option>
                            </Select>
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
            <Attachment dataSource={detailData?.fileVos} edit/>
            {
                params.status !== 'edit' && <>
                    <DetailTitle title="劳动合同记录" />
                    <CommonTable columns={tableColumns} dataSource={detailData?.statusRecordList} pagination={ false } />
                </>
            }
            </DetailContent>
        </Spin>
    </>
}