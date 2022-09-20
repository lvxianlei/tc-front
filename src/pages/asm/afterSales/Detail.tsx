import React, { useRef, useState } from 'react'
import { Spin, Form, Button, Modal, message, Row, Radio, Popconfirm, Steps, Space, Input, InputNumber, Select, DatePicker, Upload } from 'antd'
import { useHistory, useParams } from 'react-router-dom'
import { DetailTitle, BaseInfo, DetailContent, CommonTable, Attachment, Page } from '../../common'
import { baseInfoData, afterSaleInfo,  pageInfo, pageInfoCount } from './detail.json'
import RequestUtil from '../../../utils/RequestUtil'
import useRequest from '@ahooksjs/use-request'
import Dispatch from './Dispatch'
import Tower from './Tower'
import { AttachmentRef, FileProps } from '../../common/Attachment'
import HandSelect from './HandSelect'
import moment from 'moment'

const { Step } = Steps

export default function InformationDetail(): React.ReactNode {
    const history = useHistory()
    const params = useParams<{ id: string }>()
    const [form] = Form.useForm();
    const [formAssess] = Form.useForm();
    const [visible, setVisible] = useState<boolean>(false)
    const [assessVisible, setAssessVisible] = useState<boolean>(false)
    const [viewBidList, setViewBidList] = useState<"detail" | "count">("detail")
    const [isAdd, setIsAdd] = useState<boolean>(false)
    const [title, setTitle] = useState('添加');
    const [questionTitle, setQuestionTitle] = useState('添加');
    const [assessTitle, setAssessTitle] = useState('添加');
    const [formRef] = Form.useForm();
    const [formQuestion] = Form.useForm();
    const attachRef = useRef<AttachmentRef>()
    const attachCostRef = useRef<AttachmentRef>()
    const [detailData, setDetailData] = useState<any>({});
    const [detailCostData, setDetailCostData] = useState<any>({});
    const [detailAssessData, setDetailAssessData] = useState<any>({});
    const [assessDataSource, setAssessDataSource] = useState<any[]>([]);
    const [pieceCode, setPieceCode] = useState<any[]>([]);
    const formItemLayout = {
        labelCol: { span: 4 },
        wrapperCol: { span: 16 }
    };
    const [typeName, setTypeName] = useState<any[]>([])
    const [name, setName] = useState<any[]>([])
    const [costType,setCostType] = useState<any[]>([]);
    const { loading, data } = useRequest<any>(() => new Promise(async (resole, reject) => {
        try {
            // const data: any = await RequestUtil.get(`/tower-market/bidInfo/${params.id}`)
            const detailData: any = await RequestUtil.get(`/tower-as/workOrder/${params.id}`);
            setDetailData(detailData)
            const typeList: any = await RequestUtil.get(`/tower-as/issue/list`);
            setTypeName(typeList)
            const data: any = await RequestUtil.get(`/tower-as/cost`)
            setCostType(data)
            resole(data)
            
        } catch (error) {
            reject(error)
        }
    }), {})


    if (loading) {
        return <Spin spinning={loading}>
            <div style={{ width: '100%', height: '300px' }}></div>
        </Spin>
    }

    const tableColumns = [
        {
            key: 'recordType',
            title: '问题分类',
            dataIndex: 'recordType'
        },
        {
            key: 'stateFront',
            title: '塔型',
            dataIndex: 'stateFront'
        },
        {
            key: 'stateAfter',
            title: '杆塔号',
            dataIndex: 'stateAfter'
        },
        {
            key: 'createUserName',
            title: '件号',
            dataIndex: 'createUserName'
        },
        {
            key: 'createTime',
            title: '件数',
            dataIndex: 'createTime'
        },
        {
            key: 'createTime',
            title: '问题描述',
            dataIndex: 'createTime'
        }
    ]
    const columns = [
        {
            key: 'recordType',
            title: '责任部门',
            dataIndex: 'recordType'
        },
        {
            key: 'stateFront',
            title: '责任人',
            dataIndex: 'stateFront'
        },
        {
            key: 'stateAfter',
            title: '责任人岗位',
            dataIndex: 'stateAfter'
        },
        {
            key: 'createUserName',
            title: '考核方式',
            dataIndex: 'createUserName'
        },
        {
            key: 'money',
            title: '考核金额',
            dataIndex: 'money',
            render:  (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Form.Item name={ ["list", index, "money"] } key={ index } initialValue={ _ } rules={[{ 
                    "required": true,
                    "message": "请输入考核金额" 
                }]}>
                    <InputNumber precision={2} min={0}/>
                </Form.Item>
            )  
        },
        {
            key: 'description',
            title: '备注',
            dataIndex: 'description',
            render:  (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Form.Item name={ ["list", index, "description"] } key={ index } initialValue={ _ }>
                    <Input.TextArea />
                </Form.Item>
            )  
        },
        {
            key: 'operation',
            title: '操作',
            dataIndex: 'operation',
            width: 150,
            render: (_: undefined, record: Record<string, any>, index: number): React.ReactNode => (
                <Space direction="horizontal" size="small">
                    <Popconfirm
                        title="确认删除?"
                        onConfirm={ () => {
                            assessDataSource.splice(index,1)
                            setAssessDataSource(assessDataSource)
                        } }
                        okText="确认"
                        cancelText="取消"
                    >
                        <Button type="link">删除</Button>
                    </Popconfirm>
                </Space>
            )
        }
    ]

    return <>
         <Modal visible={assessVisible} title={assessTitle+"考核"} onOk={async ()=>{
            await formAssess.validateFields()
            const value = formAssess.getFieldsValue(true)
            console.log(value)
            if(assessTitle==='添加'){
                await RequestUtil.post(`/tower-aps/cyclePlan`,value).then(()=>{
                    message.success('新增成功！')
                }).then(()=>{
                    formQuestion.resetFields()
                    setAssessVisible(false)
                    setQuestionTitle('添加')
                    history.go(0)
                })
            }else{
                await RequestUtil.put(`/tower-aps/cyclePlan`,value).then(()=>{
                    message.success('编辑成功！')
                }).then(()=>{
                    formAssess.resetFields()
                    setAssessVisible(false)
                    setAssessTitle('添加')
                    history.go(0)
                })
            }
        }} onCancel={()=>{
            setAssessVisible(false);
            setAssessTitle('添加')
            formAssess.resetFields()
        }}>
            <Form form={formAssess} {...formItemLayout}>
                <DetailTitle title='基本信息'/>
                <CommonTable 
                    columns={tableColumns} 
                    dataSource={detailData} 
                    pagination={false} 
                />
                <DetailTitle title='根据上述条件匹配到下面责任人' operation={[<HandSelect
                    onSelect={(selectRows:any[])=>{
                        setAssessDataSource(selectRows)
                        formAssess.setFieldsValue({
                            list:selectRows
                        })
                    }}
                />
                ]}/> 
                <CommonTable 
                    columns={columns} 
                    dataSource={[...assessDataSource]} 
                    pagination={false} 
                /> 
            </Form>
        </Modal>
        <Modal visible={visible} title={questionTitle+"问题"} width={'40%'}onOk={async ()=>{
            await formQuestion.validateFields()
            const value = formQuestion.getFieldsValue(true)
            console.log(value)
            if(questionTitle==='添加'){
                await RequestUtil.post(`/tower-as/workIssue`,{
                    ...value,
                    description: value?.description?value?.description:'',
                    issueType: value?.issue?value?.issue.split(',')[0]:'',
                    typeId: value?.type?value?.type.split(',')[0]:'',
                    pieceCode: value?.pieceCode?value?.pieceCode:'',
                    pieceCodeNum: value?.pieceCodeNum?value?.pieceCodeNum:'',
                    productCategory: value?.productCategory?value?.productCategory:'',
                    productCategoryId: value?.productCategoryId?value?.productCategoryId:'',
                    productNumber: value?.productNumber?value?.productNumber:'',
                    fileIds: attachRef.current?.getDataSource().map(item => item.id)
                }).then(()=>{
                    message.success('添加成功！')
                }).then(()=>{
                    formQuestion.resetFields()
                    setVisible(false)
                    setQuestionTitle('添加')
                    history.go(0)
                })
            }else{
                await RequestUtil.put(`/tower-as/workIssue`,{
                    ...value,
                    description: value?.description?value?.description:'',
                    issueType: value?.issue?value?.issue.split(',')[0]:'',
                    typeId: value?.type?value?.type.split(',')[0]:'',
                    pieceCode: value?.pieceCode?value?.pieceCode:'',
                    pieceCodeNum: value?.pieceCodeNum?value?.pieceCodeNum:'',
                    productCategory: value?.productCategory?value?.productCategory:'',
                    productCategoryId: value?.productCategoryId?value?.productCategoryId:'',
                    productNumber: value?.productNumber?value?.productNumber:'',
                    fileIds: attachRef.current?.getDataSource().map(item => item.id)
                }).then(()=>{
                    message.success('编辑成功！')
                }).then(()=>{
                    formQuestion.resetFields()
                    setVisible(false)
                    setQuestionTitle('添加')
                    history.go(0)
                })
            }
        }} onCancel={()=>{
            setVisible(false);
            setQuestionTitle('添加')
            formQuestion.resetFields()
        }}>
            <Form form={formQuestion} {...formItemLayout}>
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
                    <Form.Item name="productCategory" label="塔型"  >
                        <Input disabled placeholder='选择杆塔号自动带出'/>
                    </Form.Item>
                    <Form.Item name="productCategoryId" label=""  style={{display:'none'}} >
                        <Input  type='hidden'/>
                    </Form.Item>
                    <Form.Item name="id" label=""  style={{display:'none'}} >
                        <Input  type='hidden'/>
                    </Form.Item>
                    <Form.Item name="productNumber" label="杆塔号" rules={[{
                        "required": true,
                        "message": "请选择杆塔号"
                    }]}>
                        <Input addonBefore={
                            <Tower onSelect={async (select: any) => {
                                console.log(select)
                                formQuestion.setFieldsValue({ 
                                    productNumber: select?.selectRows[0].productNumber,
                                    productCategory: select?.selectedRows[0].name,
                                    productCategoryId: select?.selectedRows[0].id,
                                });
                                const value:any[] = await RequestUtil.get(`/tower-science/productStructure/listByProduct?current=1&pageSize=10000&productId=${select?.selectRows[0].id}`)
                                setPieceCode(value)
                            }} selectedKey={[]} />
                        } disabled />
                    </Form.Item>
                    <Form.Item name="pieceCode" label="件号"  rules={[{
                        "required": true,
                        "message": "请选择件号"
                    }]}>
                        <Select style={{width:'100%'}} mode='multiple' onChange={(value:any)=>{
                            console.log(value)
                            formQuestion.setFieldsValue({ 
                                // pieceCodeNum: value.split[].map()
                            });
                        }}>
                            { pieceCode && pieceCode.map((item:any)=>{
                                    return <Select.Option key={item.id} value={item.id+','+item.code+','+item.structureCountNum}>{item.code}</Select.Option>
                                }) }
                        </Select>
                    </Form.Item>
                    <Form.Item name="pieceCodeNum" label="件数"  rules={[{
                        "required": true,
                        "message": "请输入件数"
                    }]}>
                        <InputNumber min={0} />
                    </Form.Item>
                    <Form.Item name="description" label="问题描述"  rules={[{
                        "required": true,
                        "message": "请输入问题描述"
                    }]}>
                        <Input.TextArea showCount maxLength={600} />
                    </Form.Item>
                    <Form.Item name="plan" label="解决方案" >
                        <Input.TextArea showCount maxLength={600}/>
                    </Form.Item>
                    <Attachment 
                        ref={attachRef} 
                        dataSource={detailData.attachInfoVos} 
                        edit 
                        accept="image/png,image/jpeg,mp4" 
                        multiple 
                        maxCount={5}
                        onDoneChange={(dataInfo: FileProps[]) => {
                            setDetailData({attachInfoVos: [...dataInfo]})
                        }}
                    />
                </Form>
        </Modal>
        <Modal visible={isAdd} title={title+"费用"} onOk={async ()=>{
            await formRef.validateFields()
            const value = formRef.getFieldsValue(true)
            console.log(value)
            if(value?.cost){
                value.type = value?.cost.split(',')[0]
                value.typeName = value?.cost.split(',')[1]
                delete value?.cost
            }
            if(value?.date){
                value.date = value?.date.format("YYYY-MM-DD")
            }
           
            if(title==='添加'){
                await RequestUtil.post(`/tower-as/workCost`,{
                    ...value,
                    fileIds: attachRef.current?.getDataSource().map(item => item.id),
                }).then(()=>{
                    message.success('新增成功！')
                }).then(()=>{
                    formRef.resetFields()
                    setIsAdd(false)
                    setTitle('添加')
                    history.go(0)
                })
            }else{
                await RequestUtil.put(`/tower-as/workCost`,{
                    ...value,
                    fileIds: attachRef.current?.getDataSource().map(item => item.id),
                }).then(()=>{
                    message.success('编辑成功！')
                }).then(()=>{
                    formRef.resetFields()
                    setIsAdd(false)
                    setTitle('添加')
                    history.go(0)
                })
            }
        }} onCancel={()=>{
            setIsAdd(false);
            setTitle('添加')
            form.resetFields()
        }}>
            <Form form={formRef} {...formItemLayout}>
                    <Form.Item name="workOrderNumber" label="工单编号">
                        <Input disabled />
                    </Form.Item>
                    <Form.Item name="money" label="金额" rules={[
                        {
                            required:true,
                            message:"请输入金额"
                        }
                    ]}>
                        <InputNumber precision={2} min={0} />
                    </Form.Item>
                    <Form.Item name="cost" label="费用分类" rules={[
                        {
                            required:true,
                            message:"请选择费用分类"
                        }
                    ]}>
                        <Select style={{width:'100%'}}>
                            { costType && costType.map((item:any)=>{
                                    return <Select.Option key={item.id} value={item.id+','+item.name}>{item.name}</Select.Option>
                                }) }
                        </Select>
                    </Form.Item>
                    <Form.Item name="date" label="发生日期" rules={[
                        {
                            required:true,
                            message:"请选择发生日期"
                        }
                    ]}>
                        <DatePicker format="YYYY-MM-DD" style={{ width: '100%' }} />
                    </Form.Item>
                    <Form.Item name="description" label="备注" >
                        <Input.TextArea showCount maxLength={600}/>
                    </Form.Item>
                    <Form.Item name="id" label="" style={{display:'none'}}>
                        <Input type='hidden'/>
                    </Form.Item>
                    <Form.Item name="workOrderId" label="" style={{display:'none'}}>
                        <Input type='hidden'/>
                    </Form.Item>
                    <Attachment 
                        ref={attachCostRef} 
                        dataSource={detailCostData.attachInfoVos} 
                        edit 
                        accept="image/png,image/jpeg" 
                        multiple 
                        maxCount={5}
                        onDoneChange={(dataInfo: FileProps[]) => {
                            setDetailCostData({attachInfoVos: [...dataInfo]})
                        }}
                    />
            </Form>
        </Modal>
        <DetailContent
            operation={[
                <Button key="setting" type="primary" style={{ marginRight: "16px" }} onClick={() => {
                   
                    RequestUtil.post(`/tower-as/workOrder/close`,{
                        id:params.id
                    }).then(()=>{
                        message.success('已关闭订单！')
                    }).then(()=>{
                        history.goBack()
                    })
                }}>关闭工单</Button>,
                <Button key="new" onClick={() => history.goBack()}>返回列表</Button>
            ]}>
            <Steps current={detailData?.status}  >
                <Step title="派工" />
                <Step title="到场"/>
                <Step title="处理" />
                <Step title="完成" />
                <Step title="关闭" />
            </Steps>
            <DetailTitle title="基本信息" />
            <BaseInfo
                columns={baseInfoData}
                dataSource={detailData || {}}
                col={4} />
            <DetailTitle title="售后人员" operation={[
                <Dispatch onSelect={async (selectRows: any[]) => {
                    console.log(selectRows)
                    // form.setFieldsValue({  });
                    
                    await RequestUtil.post(`/tower-as/workOrder/dispatch`,{
                        workOrderId:params?.id,
                        userId: selectRows[0]?.userId
                    })
                    message.success("派工成功！")
                    history.go(0)
                }} selectedKey={[]}/>]}/>
            <CommonTable haveIndex columns={[...afterSaleInfo as any,
                {
                    title: "操作",
                    dataIndex: "opration",
                    fixed: "right",
                    render: (_:any,record: any) => 
                        {
                            record?.status === 1||record?.isChanged!==1?<Popconfirm
                            title="确定取消?"
                            onConfirm={async () => {
                                await RequestUtil.delete(`/tower-aps/cyclePlan/${record?.id}`)
                                message.success("取消成功！")
                                history.go(0)
                            }}
                            okText="确认"
                            cancelText="取消"
                        >
                            <Button type="link">取消派工</Button>
                        </Popconfirm>:
                            <Button type="link" disabled>取消派工</Button>
                        }
                }]} dataSource={detailData?.workOrderUserVO&&[...detailData?.workOrderUserVO]||[]} pagination={false}/>
            <Row style={{marginTop:"10px"}}>
                <Radio.Group defaultValue={viewBidList} onChange={(event: any) => setViewBidList(event.target.value)}>
                    <Radio.Button value="detail" key="detail">问题信息</Radio.Button>
                    <Radio.Button value="count" key="count">费用信息</Radio.Button>
                </Radio.Group>
            </Row>
            {viewBidList === "detail" && <>
                
                {/* <CommonTable haveIndex  dataSource={data?.bidPackageInfoVOS} pagination={false}/> */}
                <Page
                    path="/tower-as/workIssue"
                    requestData={{workOrderId: params?.id}}
                    columns={[...pageInfo as any,
                        {
                            title: "操作",
                            dataIndex: "opration",
                            fixed: "right",
                            render: (_:any,record: any) => <Space>
                                <Button type="link" onClick={ () => {
                                    formQuestion.setFieldsValue({ record });
                                    setDetailAssessData([{...record}])
                                    setAssessTitle('添加');
                                    setAssessVisible(true); 
                                } }>添加考核</Button>
                                <Button type="link" onClick={ () => {
                                    formQuestion.setFieldsValue({ record });
                                    setQuestionTitle('编辑');
                                    setVisible(true); 
                                } }>编辑</Button>
                                <Popconfirm
                                    title="确认删除?"
                                    onConfirm={ async () => {
                                        await RequestUtil.delete(`/tower-as/workIssue?id=${ record.id }`).then(res => {
                                            message.success("删除成功！")
                                            history.go(0)
                                        });
                                    } }
                                    okText="确认"
                                    cancelText="取消"
                                >
                                    <Button type="link">删除</Button>
                                </Popconfirm>
                                </Space>
                        }
                        ]}
                    extraOperation={[
                        <Button
                            type="primary"
                            onClick={() =>{ 
                                setVisible(true)
                                setQuestionTitle('新增')
                            }}
                            // style={{marginBottom:"10px"}}
                        >添加问题</Button>
                    ]}
                    searchFormItems={[]}
                    onFilterSubmit={(values: any) => {
                        return values;
                    }}
                />
            </>}
            {viewBidList === "count" && <>
                    <Page
                        path="/tower-as/workCost"
                        exportPath="/tower-as/workCost"
                        requestData={{workOrderId: params?.id}}
                        extraOperation={<Button
                            type="primary"
                            onClick={() =>{ 
                                setIsAdd(true)
                                setTitle('添加')
                            }}
                        >添加费用</Button>}
                        columns={[
                            ...pageInfoCount as any,
                            {
                                title: "操作",
                                dataIndex: "opration",
                                fixed: "right",
                                render: (_:any,record: any) => <Space>
                                    <Button type="link" onClick={ async () => {
                                        setTitle('编辑');
                                        setIsAdd(true); 
                                        const value = await RequestUtil.get(`/tower-as/workCost/${record?.id}`)
                                        setDetailData(value)
                                        formRef.setFieldsValue({ 
                                            ...record,
                                            date: record?.date?moment(record?.date):'',
                                            cost: record?.type&&record?.typeName?record?.type+','+record?.typeName:'',
                                            workOrderNumber: record?.workOrderNumber
                                        });
                                    } }>编辑</Button>
                                    <Popconfirm
                                        title="删除后不可恢复，确认删除?"
                                        onConfirm={async () => {
                                            await RequestUtil.delete(`/tower-as/workCost?id=${record?.id}`)
                                            message.success("删除成功！")
                                            history.go(0)
                                        }}
                                        okText="确认"
                                        cancelText="取消"
                                    >
                                        <Button type="link" >删除</Button>
                                    </Popconfirm>
                                </Space>
                            }
                        ]}
                        searchFormItems={[]}
                        onFilterSubmit={(values: any) => {
                            return values;
                        }}
                    />
                </>
            }
        </DetailContent>
    </>
}
