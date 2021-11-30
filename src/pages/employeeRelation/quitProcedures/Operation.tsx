import React, { useRef } from 'react'
import { Button, Spin, Space, Form, Select, DatePicker} from 'antd';
import { useHistory, useParams } from 'react-router-dom';
import { DetailContent, CommonTable, DetailTitle, Attachment, BaseInfo, AttachmentRef } from '../../common';
import useRequest from '@ahooksjs/use-request';
import { baseInfoData, quitInfoData } from './quit.json';
import RequestUtil from '../../../utils/RequestUtil';
import TextArea from 'antd/lib/input/TextArea';


export default function ConfirmDetail(): React.ReactNode {
    const history = useHistory()
    const params = useParams<{ id: string }>();
    const [form] = Form.useForm();
    const attachRef = useRef<AttachmentRef>()
    const { loading, data } = useRequest(() => new Promise(async (resole, reject) => {
        // const data: any = await RequestUtil.get(`/tower-science/drawTask/getList?drawTaskId=${params.id}`)
        resole(data)
    }), {})
    const detailData: any = data;
    return <>
        <Spin spinning={loading}>
            <DetailContent operation={[
                <Space> 
                    <Button key="goback" onClick={() => history.goBack()}>保存</Button>
                    <Button key="goback" onClick={() => history.goBack()}>保存并办理完成</Button>
                    <Button key="goback" onClick={() => history.goBack()}>返回</Button>
                </Space>
            ]}>
            <DetailTitle title="员工离职信息"/>
            <BaseInfo columns={baseInfoData} dataSource={detailData || {}} col={2}/>
            <DetailTitle title="办理离职信息"/>
            <Form form={ form }>
                <Form.Item label='是否办理离职手续' rules={[{
                    required:true, 
                    message:'请选择是否办理离职手续'
                }]} initialValue={1}>
                    <Select placeholder="请选择" style={{ width: '100%' }} >
                        <Select.Option value={0} key="0">是</Select.Option>
                        <Select.Option value={1} key="1">否</Select.Option>
                    </Select>
                </Form.Item>
                <Form.Item label='是否领取解除劳动合同书' initialValue={1}>
                    <Select placeholder="请选择" style={{ width: '100%' }} >
                        <Select.Option value={0} key="0">是</Select.Option>
                        <Select.Option value={1} key="1">否</Select.Option>
                    </Select>
                </Form.Item>
                <Form.Item label='办理日期' rules={[{
                    required:true, 
                    message:'请选择办理日期'
                }]}>
                    <DatePicker format="YYYY-MM-DD" style={{ width: '100%' }}/>
                </Form.Item>
            </Form>
            <Attachment dataSource={detailData?.fileVOList} edit/>
            </DetailContent>
        </Spin>
    </>
}