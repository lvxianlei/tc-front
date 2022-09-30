import React, { useState } from 'react'
import { Button, Spin, Image, Descriptions, Form, message, Modal } from 'antd';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import { DetailContent, CommonTable, DetailTitle } from '../common';
import useRequest from '@ahooksjs/use-request';
import RequestUtil from '../../utils/RequestUtil';
import TextArea from 'antd/lib/input/TextArea';
import AuthUtil from '../../utils/AuthUtil';

const tableColumns = [
    { 
        title: '序号', 
        dataIndex: 'index', 
        key: 'index', 
        render: (_a: any, _b: any, index: number): React.ReactNode => (
            <span>{index + 1}</span>
        ) 
    },
    { 
        title: '操作部门', 
        dataIndex: 'createDeptName', 
        key: 'createDeptName', 
    },
    { 
        title: '操作人', 
        dataIndex: 'createUserName', 
        key: 'createUserName' 
    },
    { 
        title: '操作时间', 
        dataIndex: 'createTime', 
        key: 'createTime' 
    },
    { 
        title: '任务状态', 
        dataIndex: 'status', 
        key: 'status', 
        render: (value: number, record: object): React.ReactNode => {
            const renderEnum: any = [
                {
                    value: 0,
                    label: "已拒绝"
                },
                {
                    value: 1,
                    label: "待修改"
                },
                {
                    value: 2,
                    label: "已修改"
                },
                {
                    value: 3,
                    label: "已删除"
                },
            ]
        return <>
            {
                renderEnum.find((item: any) => item.value === value).label
            }
        </>
    }},
    { 
        title: '备注', 
        dataIndex: 'description', 
        key: 'description' 
    }
]

export default function SampleDrawDetail(): React.ReactNode {
    const history = useHistory();
    const [visible, setVisible] = useState<boolean>(false);
    const [form] = Form.useForm();
    const location = useLocation<{ state: {} }>();
    const params = useParams<{ id: string,status: string }>()
    const { loading, data } = useRequest(() => new Promise(async (resole, reject) => {
        const data: any = await RequestUtil.get(`/tower-science/issue/smallSample?id=${params.id}`)
        resole(data)
    }), {})
    const detailData: any = data;
    const handleModalOk = async () => {
        try {
            const refuseData = await form.validateFields();
            refuseData.id = params.id;
            await RequestUtil.post(`/tower-science/issue/refuse`,refuseData).then(()=>{
                message.success('提交成功！')
                setVisible(false)
            }).then(()=>{
                history.goBack()
            })
        } catch (error) {
            console.log(error)
        }
    }
    const handleModalCancel = () => setVisible(false);
    return <>
        <Spin spinning={loading}>
            <Modal 
                title='拒绝'
                visible={visible} 
                onCancel={handleModalCancel}
                onOk={handleModalOk}
                okText='提交'
                cancelText='关闭'
            >
                <Form form={form} >
                    <Form.Item name="description" label="拒绝原因" rules={[{
                        required:true, 
                        message:'请填写拒绝原因'
                    },
                    {
                        pattern: /^[^\s]*$/,
                        message: '禁止输入空格',
                    }]}>
                        <TextArea showCount maxLength={500}/>
                    </Form.Item>
                </Form>
            </Modal>
            <DetailContent operation={params.status==='1'&&AuthUtil.getUserInfo().user_id()===location.state?[
                <Button key="edit" style={{ marginRight: '10px' }} type="primary" onClick={async () => {
                    await RequestUtil.post(`/tower-science/issue/verify`,{id:params.id}).then(()=>{
                        message.success('修改成功！')
                    }).then(()=>{
                        history.goBack()
                    })
                }}>确认修改</Button>,
                <Button key="edit" style={{ marginRight: '10px' }} type="primary" onClick={() => {
                    setVisible(true);
                }}>拒绝修改</Button>,
                <Button key="edit" style={{ marginRight: '10px' }} type="primary" onClick={async () => {
                    await RequestUtil.delete(`/tower-science/issue?id=${params.id}`).then(()=>{
                        message.success('删除成功！')
                    }).then(()=>{
                        history.goBack()
                    })
                }}>删除</Button>,
                <Button key="goback" onClick={() => history.goBack()}>返回</Button>
            ]:[<Button key="goback" onClick={() => history.goBack()}>返回</Button>]}>
                <DetailTitle title="问题信息" />
                <Descriptions
                    bordered
                    column={2}
                >
                    <Descriptions.Item label="小样图名称">{detailData?.smallSample}</Descriptions.Item>
                    <Descriptions.Item label="备注">{detailData?.description}</Descriptions.Item>
                    <Descriptions.Item label="校核前图片">
                        <Image src={detailData?.currentFile.filePath} height={100}/>
                    </Descriptions.Item>
                    <Descriptions.Item label="校核后图片">
                        <Image src={detailData?.newFile.filePath} height={100}/>
                    </Descriptions.Item>
                </Descriptions>
                <DetailTitle title="操作信息" />
                <CommonTable columns={tableColumns} dataSource={detailData?.issueRecordList} pagination={false}/>
            </DetailContent>
        </Spin>
    </>
}