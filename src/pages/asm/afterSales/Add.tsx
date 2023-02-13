import React, { useRef, useState } from 'react';
import { Spin, Button, Space, Form, Input, Col, Row, Radio, InputNumber, Select } from 'antd';
import { useHistory, } from 'react-router-dom';
import { DetailTitle, DetailContent, AttachmentRef, Attachment } from '../../common';
import RequestUtil from '../../../utils/RequestUtil';
import useRequest from '@ahooksjs/use-request';
import Plan from './Plan';
import AfterSalesUser from './AfterSalesUser';
import Tower from './Tower';
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
        setTypeName(typeList.filter((item: any) => {
            return item?.status !== 2
        }))
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
                description: value?.descriptionWrap ? value?.descriptionWrap : '',
                workIssueDTOS: isProblem === 1 ? [{
                    description: value?.description ? value?.description : '',
                    issueTypeId: value?.type ? value?.type.split(',')[0] : '',
                    issueTypeName: value?.type ? value?.type.split(',')[1] : '',
                    issueId: value?.issue ? value?.issue.split(',')[0] : '',
                    issueName: value?.issue ? value?.issue.split(',')[1] : '',
                    pieceCode: value?.pieceCode ? value?.pieceCode.map((item: any) => {
                        return item.split(',')[1]
                    }).join(',') : '',
                    productId: value?.productId ? value?.productId : '',
                    pieceCodeNum: value?.pieceCodeNum ? value?.pieceCodeNum : '',
                    productCategory: value?.productCategory ? value?.productCategory : '',
                    productCategoryId: value?.productCategoryId ? value?.productCategoryId : '',
                    productNumber: value?.productNumber ? value?.productNumber : '',
                    fileIds: attachRef.current?.getDataSource().map(item => item.id)
                }] : []
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
            <Form form={form} labelCol={{ span: 4 }} wrapperCol={{ span: 18 }}>
                <Row>
                    <Col span={12}>
                        <DetailTitle title="基本信息" key={1} />
                        <Form.Item name="saleOrderNumber" label="工单编号" >
                            <Input placeholder="系统自动生产" disabled />
                        </Form.Item>
                        <Form.Item name="planNumber" label="计划号" rules={[{
                            "required": true,
                            "message": "请选择计划号"
                        }]} initialValue={detailData?.planNumber}>
                            <Input addonBefore={
                                <Plan onSelect={(selectRows: any[]) => {
                                    console.log(selectRows)
                                    form.setFieldsValue({
                                        projectName: selectRows[0]?.projectName,
                                        serviceManager: selectRows[0]?.businessUserName,
                                        serviceManagerId: selectRows[0]?.businessUser,
                                        planNumber: selectRows[0]?.planNumber,
                                    });
                                    setDetailData({ ...detailData, planNumber: selectRows[0]?.planNumber, serviceManagerId: selectRows[0]?.businessUser, serviceManager: selectRows[0]?.businessUserName, projectName: selectRows[0]?.projectName })
                                }} selectedKey={detailData?.planNumber || []} />
                            } disabled />
                        </Form.Item>
                        <Form.Item name="serviceManagerId" label="" style={{ display: 'none' }} >
                            <Input type='hidden' />
                        </Form.Item>
                        <Form.Item name="projectName" label="工程名称"  >
                            <Input disabled placeholder='选择计划自动带出' />
                        </Form.Item>
                        <Form.Item name="serviceManager" label="业务经理"  >
                            <Input disabled placeholder='选择计划自动带出' />
                        </Form.Item>
                        <Form.Item name="linkman" label="联系人" rules={[{
                            "required": true,
                            "message": "请输入联系人"
                        },
                        {
                            pattern: /^[^\s]*$/,
                            message: '禁止输入空格',
                        }]}>
                            <Input maxLength={20} />
                        </Form.Item>
                        <Form.Item name="phone" label="联系方式" rules={[{
                            "required": true,
                            "message": "请输入联系方式"
                        },
                        {
                            pattern: /^[^\s]*$/,
                            message: '禁止输入空格',
                        }]}>
                            <Input maxLength={20} />
                        </Form.Item>
                        <Form.Item name="descriptionWrap" label="备注" initialValue={detailData.description} >
                            <Input.TextArea maxLength={300} />
                        </Form.Item>
                        <Form.Item name="isProblem" label="问题信息" initialValue={isProblem} rules={[{
                            "required": true,
                            "message": "请选择问题信息"
                        }]}>
                            <Radio.Group onChange={(e: any) => {
                                setIsProblem(e?.target?.value)
                            }}>
                                <Radio value={1}>添加问题</Radio>
                                <Radio value={2}>不添加问题</Radio>
                            </Radio.Group>
                        </Form.Item>
                        {
                            isProblem === 1 && <>
                                <Form.Item name="type" label="问题阶段" rules={[
                                    {
                                        required: true,
                                        message: "请选择问题阶段"
                                    }
                                ]}>
                                    <Select style={{ width: '100%' }} onChange={async (value: any) => {
                                        const result: any = await RequestUtil.get(`/tower-as/issue/issue/${value.split(',')[0]}`);
                                        setName(result.filter((item: any) => {
                                            return item?.status !== 2
                                        }))
                                    }}>
                                        {typeName && typeName.map((item: any) => {
                                            return <Select.Option key={item.id} value={item.id + ',' + item.typeName}>{item.typeName}</Select.Option>
                                        })}
                                    </Select>
                                </Form.Item>
                                <Form.Item name="issue" label="问题分类" rules={[
                                    {
                                        required: true,
                                        message: "请选择问题分类"
                                    }
                                ]}>
                                    <Select style={{ width: '100%' }}>
                                        {name && name.map((item: any) => {
                                            return <Select.Option key={item.id} value={item.id + ',' + item.name}>{item.name}</Select.Option>
                                        })}
                                    </Select>
                                </Form.Item>
                                <Form.Item name="productCategory" label="塔型"  >
                                    <Input disabled placeholder='选择杆塔号自动带出' />
                                </Form.Item>
                                <Form.Item name="productCategoryId" label="" style={{ display: 'none' }} >
                                    <Input type='hidden' />
                                </Form.Item>
                                <Form.Item name="productId" label="" style={{ display: 'none' }} >
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
                                                productId: select?.selectRows[0].id,
                                                productNumber: select?.selectRows[0].productNumber,
                                                productCategory: select?.selectedRows[0].productCategoryName,
                                                productCategoryId: select?.selectedRows[0].productCategoryId,
                                            });
                                            const value: any[] = await RequestUtil.get(`/tower-science/productStructure/listByProductForSales?current=1&pageSize=10000&productId=${select?.selectRows[0].id}`)
                                            setPieceCode(value)
                                        }} selectedKey={[]} planNumber={form.getFieldsValue(true)?.planNumber} />
                                    } disabled />
                                </Form.Item>
                                <Form.Item name="pieceCode" label="件号">
                                    <Select style={{ width: '100%' }} mode='multiple' onChange={(value: any) => {
                                        if (value.length > 0) {
                                            const num = value.map((item: string) => item.split(',')[2])
                                            const numberAll = num.reduce((pre: any, cur: any) => {
                                                return parseFloat(pre !== null ? pre : 0) + parseFloat(cur !== null ? cur : 0)
                                            }, 0)
                                            form.setFieldsValue({
                                                pieceCodeNum: Number(numberAll)
                                            });
                                        }
                                    }}>
                                        {pieceCode && pieceCode.map((item: any) => {
                                            return <Select.Option key={item.id} value={item.id + ',' + item.code + ',' + item.basicsPartNum}>{item.code}</Select.Option>
                                        })}
                                    </Select>
                                </Form.Item>
                                <Form.Item name="pieceCodeNum" label="件数"  >
                                    <InputNumber min={0} />
                                </Form.Item>
                                <Form.Item name="description" label="问题描述" >
                                    <Input.TextArea showCount maxLength={600} />
                                </Form.Item>
                                <Attachment
                                    ref={attachRef}
                                    dataSource={detailData.attachInfoVos}
                                    edit
                                    multiple
                                    maxCount={5}
                                    onDoneChange={(dataInfo: FileProps[]) => {
                                        setDetailData({ ...detailData, attachInfoVos: [...dataInfo] })
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
                                        afterSaleUser: selectRows[0].name,
                                        afterSaleUserId: selectRows[0].userId
                                    })
                                }} selectedKey={detailData?.staffList || []} />
                            } disabled />
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </DetailContent>
    </>
}