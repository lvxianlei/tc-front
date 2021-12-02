import React, { useRef } from 'react'
import { Button, Spin, Space, Form, Select, DatePicker, Row, Col, message} from 'antd';
import { useHistory, useParams } from 'react-router-dom';
import { DetailContent, CommonTable, DetailTitle, Attachment, BaseInfo, AttachmentRef } from '../../common';
import useRequest from '@ahooksjs/use-request';
import { baseInfoData, quitInfoData } from './quit.json';
import RequestUtil from '../../../utils/RequestUtil';
import TextArea from 'antd/lib/input/TextArea';


export default function QuitProceduresOperation(): React.ReactNode {
    const history = useHistory()
    const params = useParams<{ id: string }>();
    const [form] = Form.useForm();
    const attachRef = useRef<AttachmentRef>()
    const { loading, data } = useRequest(() => new Promise(async (resole, reject) => {
        // const data: any = await RequestUtil.get(`/tower-hr/employeeDeparture/detail?id=${params.id}`)
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
                    <Button key="primary" onClick={() => {
                        form.validateFields().then(res=>{
                            const value= form.getFieldsValue(true);
                            value.fileVos= attachRef.current?.getDataSource();
                            RequestUtil.post(`/tower-hr/employeeDeparture/handleSubmit`, value).then(()=>{
                                message.success('保存成功')
                            })
                        })
                        
                    }}>保存</Button>
                    <Button key="primary" onClick={() => history.goBack()}>保存并办理完成</Button>
                    <Button key="goback" onClick={() => history.goBack()}>返回</Button>
                </Space>
            ]}>
            <DetailTitle title="员工离职信息"/>
            <BaseInfo columns={baseInfoData} dataSource={detailData || {}} col={2}/>
            <DetailTitle title="办理离职信息"/>
            <Form form={ form } { ...formItemLayout }>
                <Row>
                    <Col span={12}>
                        <Form.Item label='是否办理离职手续' rules={[{
                            required:true, 
                            message:'请选择是否办理离职手续'
                        }]} initialValue={1} name='isTransactProcedure'>
                            <Select placeholder="请选择" style={{ width: '100%' }} >
                                <Select.Option value={0} key="0">是</Select.Option>
                                <Select.Option value={1} key="1">否</Select.Option>
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label='是否领取解除劳动合同书' initialValue={1} name='isRemoveContract'>
                            <Select placeholder="请选择" style={{ width: '100%' }} >
                                <Select.Option value={0} key="0">是</Select.Option>
                                <Select.Option value={1} key="1">否</Select.Option>
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={12}>
                        <Form.Item label='办理日期' rules={[{
                            required:true, 
                            message:'请选择办理日期'
                        }]} name='transactDate'>
                            <DatePicker format="YYYY-MM-DD" style={{ width: '100%' }}/>
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
            <Attachment dataSource={detailData?.fileVos} edit/>
            </DetailContent>
        </Spin>
    </>
}