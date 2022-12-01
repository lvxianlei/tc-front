import React, { useRef, useState } from 'react';
import { Spin, Button, Space, Form, Input, Col, Row } from 'antd';
import { useHistory, useParams } from 'react-router-dom';
import { DetailTitle, DetailContent, AttachmentRef } from '../../common';
import RequestUtil from '../../../utils/RequestUtil';
import useRequest from '@ahooksjs/use-request';
import Plan from './Plan';

export default function AnnouncementNew(): React.ReactNode {
    const [form] = Form.useForm();
    const [detailData, setDetailData] = useState<any>({});
    const [isProblem, setIsProblem] = useState<any>(2);
    const history = useHistory();
    const attachRef = useRef<AttachmentRef>()
    const [typeName, setTypeName] = useState<any[]>([])
    const params = useParams<{ id: string }>();
    const { loading } = useRequest<any>(() => new Promise(async (resole, reject) => {
        const typeList: any = await RequestUtil.get(`/tower-as/issue/list`);
        setTypeName(typeList)
        const data: any = await RequestUtil.get(`/tower-as/workOrder/${params.id}`);
        setDetailData(data)
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
            RequestUtil.put<any>(`/tower-as/workOrder`, {
                ...detailData,
                ...value,
                afterSaleUserId: detailData?.afterSaleUserId,
                serviceManagerId: detailData?.serviceManagerId,
                // description:'1',
                // deliveryAddress:'北京',
                workIssueDTOS: isProblem === 1 ? [{
                    description: value?.description ? value?.description : '',
                    issueType: value?.issue ? value?.issue.split(',')[0] : '',
                    typeId: value?.type ? value?.type.split(',')[0] : '',
                    pieceCode: value?.pieceCode ? value?.pieceCode : '',
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
                        <Form.Item name="workOrderNumber" label="工单编号" initialValue={detailData.workOrderNumber}>
                            <Input disabled />
                        </Form.Item>
                        <Form.Item name="planNumber" label="计划号" initialValue={detailData.planNumber} rules={[{
                            "required": true,
                            "message": "请选择计划号"
                        }]}>
                            <Input addonBefore={
                                <Plan onSelect={(selectRows: any[]) => {
                                    console.log(selectRows)
                                    form.setFieldsValue({
                                        planNumber: selectRows[0]?.planNumber,
                                        projectName: selectRows[0]?.projectName,
                                        serviceManager: selectRows[0]?.businessUserName,
                                        serviceManagerId: selectRows[0]?.businessUser,
                                    });
                                    setDetailData({ ...detailData, planNumber: selectRows[0]?.planNumber, serviceManagerId: selectRows[0]?.businessUser, serviceManager: selectRows[0]?.businessUserName, projectName: selectRows[0]?.projectName })
                                }} selectedKey={detailData?.planNumber || []} />
                            } disabled />
                        </Form.Item>
                        <Form.Item name="projectName" label="工程名称" initialValue={detailData.projectName} >
                            <Input disabled />
                        </Form.Item>
                        <Form.Item name="serviceManager" label="业务经理" initialValue={detailData.serviceManager} >
                            <Input disabled />
                        </Form.Item>
                        <Form.Item name="linkman" label="联系人" initialValue={detailData.linkman} rules={[{
                            "required": true,
                            "message": "请输入联系人"
                        },
                        {
                            pattern: /^[^\s]*$/,
                            message: '禁止输入空格',
                        }]}>
                            <Input maxLength={20} />
                        </Form.Item>
                        <Form.Item name="phone" label="联系方式" initialValue={detailData.phone} rules={[{
                            "required": true,
                            "message": "请输入联系方式"
                        },
                        {
                            pattern: /^[^\s]*$/,
                            message: '禁止输入空格',
                        }]}>
                            <Input maxLength={20} />
                        </Form.Item>
                    </Col>
                    {/* <Col span={12}>
                        <DetailTitle title="售后人员" key={1} />
                        <Form.Item name="afterSaleUser" label="售后人员" initialValue={detailData?.workOrderUserVO?.afterSaleUser}>
                            <Input addonBefore={
                                <AfterSalesUser onSelect={(selectRows: any[]) => {
                                    console.log(selectRows)
                                    form.setFieldsValue({ afterSaleUser: selectRows[0].name });
                                    setDetailData({ 
                                        ...detailData, 
                                        afterSaleUser: selectRows[0].name,
                                        // serviceManager: selectRows[0].name,
                                        // serviceManagerId:selectRows[0].userId,
                                        afterSaleUserId:selectRows[0].userId,
                                    })
                                }} selectedKey={detailData?.workOrderUserVO||[]} />
                            } disabled />
                        </Form.Item>
                    </Col> */}
                </Row>
            </Form>
        </DetailContent>
    </>
}