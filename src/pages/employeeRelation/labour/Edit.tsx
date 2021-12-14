import React, { useRef, useState } from 'react'
import { Button, Spin, Space, Form, Select, DatePicker, Row, Col, Input, message, TreeSelect} from 'antd';
import { useHistory, useParams } from 'react-router-dom';
import { DetailContent, CommonTable, DetailTitle, Attachment, BaseInfo, AttachmentRef } from '../../common';
import useRequest from '@ahooksjs/use-request';
import RequestUtil from '../../../utils/RequestUtil';
import TextArea from 'antd/lib/input/TextArea';
import moment from 'moment';
import { TreeNode } from 'antd/lib/tree-select';
import { DataNode as SelectDataNode } from 'rc-tree-select/es/interface';

export default function Edit(): React.ReactNode {
    const history = useHistory()
    const params = useParams<{ id: string, status: string }>();
    const [form] = Form.useForm();
    const [company, setCompany] = useState([]);
    const attachRef = useRef<AttachmentRef>()
    const { loading, data } = useRequest(() => new Promise(async (resole, reject) => {
        const data: any = params.id !== '0' && await RequestUtil.get(`/tower-hr/labor/contract/detail`,{contractId: params.id})
        const result:any = await RequestUtil.get(`/tower-system/department/company`)
        form.setFieldsValue({
            ...data,
            contractEndDate: data.contractEndDate?moment(data.contractEndDate):'',
            contractStartDate: data.contractStartDate?moment(data.contractStartDate):'',
            newDepartmentName: data.departmentId!=='0'?data.departmentName+'/'+data.teamName:data.teamName
        })
        setCompany(result)
        resole(data)
    }), {})
    const detailData: any = data;
    const formItemLayout = {
        labelCol: { span: 6 },
        wrapperCol: { span: 16 }
    };
    const wrapRole2DataNode = (roles: (any & SelectDataNode)[] = []): SelectDataNode[] => {
        roles && roles.forEach((role: any & SelectDataNode): void => {
            role.value = role.id;
            role.title = role.name;
            if (role.children && role.children.length > 0) {
                wrapRole2DataNode(role.children);
            }
        });
        return roles;
    }

    const renderTreeNodes = (data:any) => data.map((item:any) => {
        if (item.children && item.children.length > 0) {
            item.disabled = true;
            return (<TreeNode key={ item.id } title={ item.name } value={ item.id }>
                { renderTreeNodes(item.children) }
            </TreeNode>);
        }
        return <TreeNode { ...item } key={ item.id } title={ item.name } value={ item.id } />;
    });
    const tableColumns = [
        { title: '合同编号', dataIndex: 'contractNumber', key: 'contractNumber' },
        { title: '合同公司', dataIndex: 'signedCompanyName', key: 'signedCompanyName' },
        { title: '合同类型', dataIndex: 'contractType', key: 'contractType', 
            render: (contractType: number): React.ReactNode => {
                switch (contractType) {
                    case 1:
                        return '固定期限劳动合同';
                    case 2:
                        return '无固定期限劳动合同';
                    case 3:
                        return '超龄返聘合同';
                    case 4:
                        return '实习合同';
                    case 5:
                        return '其他合同';
                }
            } 
        },
        { title: '合同开始时间', dataIndex: 'contractStartDate', key: 'contractStartDate',
            render:(contractStartDate: string)=>{
                return contractStartDate?moment(contractStartDate).format('YYYY-MM-DD'):'-'
            } 
        },
        { title: '合同结束时间', dataIndex: 'contractEndDate', key: 'contractEndDate',
            render:(contractEndDate: string)=>{
                return contractEndDate?moment(contractEndDate).format('YYYY-MM-DD'):'-'
            }
        },
        { title: '操作', dataIndex: 'operation', key: 'operation',render: (_: any, record: any, index: number): React.ReactNode => (
            <Button type='link' onClick={()=>{
                history.push(`/employeeRelation/labour/edit/${params.id}/${params.status}/${record.id}`)
            }}>详情</Button>) 
        }
    ]
    return <>
        <Spin spinning={loading}>
            <DetailContent operation={[
                <Space> 
                    <Button type="primary" onClick={() => {
                        console.log(attachRef.current?.getDataSource())
                        form.validateFields().then(res=>{
                           
                            const value= form.getFieldsValue(true);
                            if(moment(value.contractEndDate)<moment(value.contractStartDate)){
                                message.error('合同截止日期不可小于开始日期！')
                            }else{
                                value.fileIds= attachRef.current?.getDataSource().map((item:any)=>{
                                    return item.id
                                });
                                value.contractEndDate= moment(value.contractEndDate).format('YYYY-MM-DD HH:mm:ss');
                                value.contractStartDate= moment(value.contractStartDate).format('YYYY-MM-DD HH:mm:ss');
                                value.submitType='save';
                                value.employeeId = detailData.employeeId;
                                value.id = params.status !== 'edit'?undefined:params.id;
                                value.type = params.status === 'change'?1:params.status === 'renewal'?2:3
                                RequestUtil.post(`/tower-hr/labor/contract`, value).then(()=>{
                                    message.success('保存成功！')
                                }).then(()=>{
                                    history.goBack()
                                })
                            }
                            
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
                            <Input disabled/>
                        </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={12}>
                        <Form.Item label='公司' name='companyName'>
                            <Input disabled/>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label='部门/班组' name='newDepartmentName'>
                            <Input disabled/>
                        </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={12}>
                        <Form.Item label='岗位' name='postName'>
                            <Input disabled/>
                        </Form.Item>
                    </Col>
                    <Col span={12} >
                        <Form.Item label='身份证号' name='idNumber'>
                            <Input disabled/>
                        </Form.Item>
                    </Col>
                    
                </Row>
                <Row>
                    <Col span={12}>
                        <Form.Item label='合同签署公司' rules={[{
                            required:true, 
                            message:'请填写合同签署公司'
                        }]} name='signedCompany'>
                            <TreeSelect placeholder="请选择" style={{ width: "100%" }}>
                                { renderTreeNodes(wrapRole2DataNode(company)) }
                            </TreeSelect>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label='合同类型' rules={[{
                            required:true, 
                            message:'请选择合同类型'
                        }]} name='contractType'>
                            <Select placeholder="请选择" style={{ width: '100%' }} >
                                <Select.Option value={1} key="1">固定期限劳动合同</Select.Option>
                                <Select.Option value={2} key="2">无固定期限劳动合同</Select.Option>
                                <Select.Option value={3} key="3">超龄返聘合同</Select.Option>
                                <Select.Option value={4} key="4">实习合同</Select.Option>
                                <Select.Option value={5} key="5">其他合同</Select.Option>
                            </Select>
                        </Form.Item>
                    </Col>
                    
                </Row>
                <Row>
                    <Col span={12}>
                        <Form.Item label='合同开始日期' rules={[{
                            required:true, 
                            message:'请选择合同开始日期'
                        }]} name='contractStartDate'>
                            <DatePicker format="YYYY-MM-DD" style={{ width: '100%' }}/>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label='合同截止日期' rules={[{
                            required:true, 
                            message:'请选择合同截止日期'
                        }]} name='contractEndDate'>
                            <DatePicker format="YYYY-MM-DD" style={{ width: '100%' }} disabledDate={(current) =>{
                                return current && current < form.getFieldsValue().contractStartDate;
                            }}/>
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
            </Form>
            <Attachment dataSource={detailData?.fileVos} edit ref={attachRef} />
            {
                params.status !== 'edit' && <>
                    <DetailTitle title="劳动合同记录" />
                    <CommonTable columns={tableColumns} dataSource={detailData?.laborContractVOS} pagination={ false } />
                </>
            }
            </DetailContent>
        </Spin>
    </>
}