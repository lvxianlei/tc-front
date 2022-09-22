import React, { useRef, useState } from 'react';
import { Spin, Button, Space, Form, Input, message, Col, Row, Radio, InputNumber, Modal, Upload, Select } from 'antd';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import { DetailTitle, DetailContent, AttachmentRef, Attachment } from '../../common';
import RequestUtil from '../../../utils/RequestUtil';
import useRequest from '@ahooksjs/use-request';
import Plan from './Plan';
import AfterSalesUser from './AfterSalesUser';
import Tower from './Tower';
import AuthUtil from '../../../utils/AuthUtil';
import { RcFile } from 'antd/lib/upload';
import { UploadFile } from 'antd/lib/upload/interface';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { FileProps } from '../../common/Attachment';

export default function AnnouncementNew(): React.ReactNode {
    const [form] = Form.useForm();
    const [detailData, setDetailData] = useState<any>({});
    const [isProblem, setIsProblem] = useState<any>(2);
    const history = useHistory();
    const attachRef = useRef<AttachmentRef>()
    const [typeName, setTypeName] = useState<any[]>([])
    const [name, setName] = useState<any[]>([])
    const [pieceCode, setPieceCode] = useState<any[]>([]);
    const { loading } = useRequest<any>(() => new Promise(async (resole, reject) => {
            const typeList: any = await RequestUtil.get(`/tower-as/issue/list`);
            setTypeName(typeList)
            resole({});
    }), {})
    if (loading) {
        return <Spin spinning={loading}>
            <div style={{ width: '100%', height: '300px' }}></div>
        </Spin>
    }
    const save = async (state: number) => {
        if (form) {
            await form.validateFields()
            const value: any = form.getFieldsValue(true)
            RequestUtil.post<any>(`/tower-as/workOrder`, {
                ...value,
                afterSaleUserId: detailData?.afterSaleUserId,
                serviceManagerId: detailData?.serviceManagerId,
                // description:'1',
                // deliveryAddress:'北京',
                workIssueDTOS:isProblem===1?[{
                    description: value?.description?value?.description:'',
                    issueType: value?.issue?value?.issue.split(',')[0]:'',
                    typeId: value?.type?value?.type.split(',')[0]:'',
                    pieceCode: value?.pieceCode?value?.pieceCode:'',
                    pieceCodeNum: value?.pieceCodeNum?value?.pieceCodeNum:'',
                    productCategory: value?.productCategory?value?.productCategory:'',
                    productCategoryId: value?.productCategoryId?value?.productCategoryId:'',
                    productNumber: value?.productNumber?value?.productNumber:'',
                    fileIds: attachRef.current?.getDataSource().map(item => item.id)
                }]:[]
            }).then(res => {
                history.goBack();
            });
        }
    }

    return <>
        <DetailContent operation={[
            <Space direction="horizontal" size="small" >
                <Button key="saveC" type="primary" onClick={() => save(0)}>保存</Button>
                <Button key="cancel" type="ghost" onClick={() => history.goBack()}>取消</Button>
            </Space>
        ]}>
            <Form form={form} labelCol={{ span: 4 }} wrapperCol={{span:18}}>
                <Row>
                    <Col span={12}>
                        <DetailTitle title="基本信息" key={1} />
                        <Form.Item name="saleOrderNumber" label="工单编号" initialValue={detailData.saleOrderNumber}>
                            <Input placeholder="系统自动生产"  disabled/>
                        </Form.Item>
                        <Form.Item name="planNumber" label="计划号" initialValue={detailData.planNumber} rules={[{
                            "required": true,
                            "message": "请选择计划号"
                        }]}>
                            <Input addonBefore={
                                <Plan onSelect={(selectRows: any[]) => {
                                    console.log(selectRows)
                                    form.setFieldsValue({ 
                                        planNumber:selectRows[0]?.planNumber, 
                                        projectName:selectRows[0]?.projectName,
                                        serviceManager:selectRows[0]?.businessUserName,
                                        serviceManagerId:selectRows[0]?.businessUser,
                                    });
                                    setDetailData({ ...detailData, planNumber: selectRows[0]?.planNumber,serviceManagerId:selectRows[0]?.businessUser,serviceManager:selectRows[0]?.businessUserName,projectName:selectRows[0]?.projectName})
                                }} selectedKey={detailData?.staffList||[]} />
                            } disabled />
                        </Form.Item>
                        <Form.Item name="projectName" label="工程名称" initialValue={detailData.projectName} >
                            <Input  disabled placeholder='选择计划自动带出'/>
                        </Form.Item>
                        <Form.Item name="serviceManager" label="业务经理" initialValue={detailData.serviceManager} >
                            <Input  disabled placeholder='选择计划自动带出'/>
                        </Form.Item>
                        <Form.Item name="linkman" label="联系人" initialValue={detailData.linkman} rules={[{
                            "required": true,
                            "message": "请输入联系人"
                        },
                        {
                            pattern: /^[^\s]*$/,
                            message: '禁止输入空格',
                        }]}>
                            <Input  maxLength={20}/>
                        </Form.Item>
                        <Form.Item name="phone" label="联系方式" initialValue={detailData.phone} rules={[{
                            "required": true,
                            "message": "请输入联系方式"
                        },
                        {
                            pattern: /^[^\s]*$/,
                            message: '禁止输入空格',
                        }]}>
                            <Input  maxLength={20}/>
                        </Form.Item>
                        <Form.Item name="isProblem" label="问题信息" initialValue={isProblem} rules={[{
                            "required": true,
                            "message": "请选择问题信息"
                        }]}>
                            <Radio.Group onChange={(e:any)=>{
                                setIsProblem(e?.target?.value)
                            }}>
                                <Radio value={1}>添加问题</Radio>
                                <Radio value={2}>不添加问题</Radio>
                            </Radio.Group>
                        </Form.Item>
                        {
                            isProblem===1&&<>
                                <Form.Item name="type" label="问题阶段" rules={[
                                    {
                                        required:true,
                                        message:"请选择问题阶段"
                                    }
                                ]}>
                                    <Select style={{width:'100%'}} onChange={async (value:any)=>{
                                        const result: any = await RequestUtil.get(`/tower-as/issue/issue/${value.split(',')[0]}`);
                                        setName(result)
                                    }}>
                                        { typeName && typeName.map((item:any)=>{
                                                return <Select.Option key={item.id} value={item.id+','+item.typeName}>{item.typeName}</Select.Option>
                                            }) }
                                    </Select>
                                </Form.Item>
                                <Form.Item name="issue" label="问题分类" rules={[
                                    {
                                        required:true,
                                        message:"请选择问题分类"
                                    }
                                ]}>
                                    <Select style={{width:'100%'}}>
                                        { name && name.map((item:any)=>{
                                                return <Select.Option key={item.id} value={item.id+','+item.name}>{item.name}</Select.Option>
                                            }) }
                                    </Select>
                                </Form.Item>
                                <Form.Item name="productCategory" label="塔型" initialValue={detailData.productCategory} >
                                    <Input disabled placeholder='选择杆塔号自动带出'/>
                                </Form.Item>
                                <Form.Item name="productCategoryId" label="" style={{display:'none'}} >
                                    <Input type='hidden' />
                                </Form.Item>
                                <Form.Item name="productNumber" label="杆塔号" rules={[{
                                    "required": true,
                                    "message": "请选择杆塔号"
                                }]}>
                                    <Input addonBefore={
                                        <Tower onSelect={async (select: any) => {
                                            console.log(select)
                                            form.setFieldsValue({ 
                                                productNumber: select?.selectRows[0].productNumber,
                                                productCategory: select?.selectedRows[0].productCategoryName,
                                                productCategoryId: select?.selectedRows[0].productCategoryId,
                                            });
                                            const value:any[] = await RequestUtil.get(`/tower-science/productStructure/listByProductForSales?current=1&pageSize=10000&productId=${select?.selectRows[0].id}`)
                                            setPieceCode(value)
                                        }} selectedKey={[]} planNumber={form.getFieldsValue(true)?.planNumber}/>
                                    } disabled />
                                </Form.Item>
                                <Form.Item name="pieceCode" label="件号"  rules={[{
                                    "required": true,
                                    "message": "请选择件号"
                                }]}>
                                    <Select style={{width:'100%'}} mode='multiple' onChange={(value:any)=>{
                                        console.log(value)
                                        if(value.length>0){
                                            const num = value.map((item: string)=> item.split(',')[2]) 
                                            const numberAll = num.reduce((pre: any,cur:  any)=>{
                                                return parseFloat(pre!==null?pre:0 )+ parseFloat(cur!==null?cur:0 )
                                            },0)
                                            form.setFieldsValue({ 
                                                pieceCodeNum: numberAll
                                            });
                                        }
                                       
                                    }}>
                                        { pieceCode && pieceCode.map((item:any)=>{
                                                return <Select.Option key={item.id} value={item.id+','+item.code+','+item.basicsPartNum}>{item.code}</Select.Option>
                                            }) }
                                    </Select>
                                </Form.Item>
                                <Form.Item name="pieceCodeNum" label="件数" initialValue={detailData.pieceCodeNum} >
                                    <InputNumber min={0} />
                                </Form.Item>
                                <Form.Item name="description" label="问题描述" initialValue={detailData.description} >
                                    <Input.TextArea showCount maxLength={600} />
                                </Form.Item>
                                <Attachment 
                                    ref={attachRef} 
                                    dataSource={detailData.attachInfoVos} 
                                    edit 
                                    accept="image/png,image/jpeg" 
                                    multiple 
                                    maxCount={5}
                                    onDoneChange={(dataInfo: FileProps[]) => {
                                        setDetailData({attachInfoVos: [...dataInfo]})
                                    }}
                                />
                            </>
                        }
                    </Col>
                    <Col span={12}>
                        <DetailTitle title="售后人员" key={1} />
                        <Form.Item name="afterSaleUser" label="售后人员" initialValue={detailData.afterSaleUser}>
                            <Input addonBefore={
                                <AfterSalesUser onSelect={(selectRows: any[]) => {
                                    console.log(selectRows)
                                    form.setFieldsValue({ afterSaleUser: selectRows[0].name });
                                    setDetailData({ 
                                        ...detailData, 
                                        afterSaleUser: selectRows[0].name 
                                    })
                                }} selectedKey={detailData?.staffList||[]} />
                            } disabled />
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </DetailContent>
    </>
}