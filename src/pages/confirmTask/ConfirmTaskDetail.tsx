import React, { useState } from 'react'
import { Button, Spin, Space, Modal, Form, message, Image } from 'antd';
import { useHistory, useParams } from 'react-router-dom';
import { BaseInfo, DetailContent, CommonTable, DetailTitle, Attachment } from '../common';
import { baseInfoData } from './confirmTaskData.json';
import useRequest from '@ahooksjs/use-request';
import RequestUtil from '../../utils/RequestUtil';
import TextArea from 'antd/lib/input/TextArea';

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
        dataIndex: 'currentStatus',
        key: 'currentStatus',
        render: (value: number, record: object): React.ReactNode => {
            const renderEnum: any = [
                {
                    value: 0,
                    label: "已拒绝"
                },
                {
                    value: 1,
                    label: "待确认"
                },
                {
                    value: 2,
                    label: "待指派"
                },
                {
                    value: 3,
                    label: "待完成"
                },
                {
                    value: 4,
                    label: "已完成"
                },
                {
                    value: 5,
                    label: "已提交"
                }
            ]
            return <>{value !== -1 ? renderEnum.find((item: any) => item.value === value).label : ''}</>
        }
    },
    {
        title: '备注',
        dataIndex: 'description',
        key: 'description'
    }
]

export default function ConfirmTaskDetail(): React.ReactNode {
    const history = useHistory();
    const [visible, setVisible] = useState<boolean>(false);
    const [form] = Form.useForm();
    const params = useParams<{ id: string, status: string }>();
    const [pictureVisible, setPictureVisible] = useState<boolean>(false);
    const [pictureUrl, setPictureUrl] = useState('');
    const { loading, data } = useRequest(() => new Promise(async (resole, reject) => {
        const data: any = await RequestUtil.get(`/tower-science/drawTask/getDrawTaskById?drawTaskId=${params.id}`)
        resole(data)
    }), {})
    const detailData: any = data;
    const handleModalOk = async () => {
        try {
            const refuseData = await form.validateFields();
            refuseData.drawTaskId = params.id;
            await RequestUtil.post('/tower-science/drawTask/refuseDrawTask', refuseData).then(() => {
                message.success('提交成功！')
                setVisible(false)
            }).then(() => {
                history.push(`/taskMngt/ConfirmTaskMngt`)
            })

        } catch (error) {
            console.log(error)
        }
    }
    const handleModalCancel = () => setVisible(false);
    const handlePictureModalCancel = () => { setPictureVisible(false) }
    return <>
        <Spin spinning={loading}>
            <DetailContent operation={[
                <Space>
                    {
                        params.status !== '1' ? null :
                            <Space>
                                <Button
                                    type="primary"
                                    onClick={async () => {
                                        await RequestUtil.post('/tower-science/drawTask/receiveDrawTask', { drawTaskId: params.id }).then(() => {
                                            message.success('接收成功！');
                                        }).then(() => {
                                            history.push(`/taskMngt/ConfirmTaskMngt`)
                                        });
                                    }}
                                >接收</Button>
                                {/* <Button 
                            key="edit" 
                            style={{ marginRight: '10px' }} 
                            type="primary" 
                            onClick={() => {
                                setVisible(true)
                            }}
                        >拒绝</Button> */}
                            </Space>
                    }
                    <Button key="goback" onClick={() => history.goBack()}>返回</Button>
                </Space>
            ]}>
                <Modal
                    title='拒绝'
                    visible={visible}
                    onCancel={handleModalCancel}
                    onOk={handleModalOk}
                    okText='提交'
                    cancelText='关闭'
                >
                    <Form form={form} >
                        <Form.Item name="reason" label="拒绝原因" rules={[{
                            required: true,
                            message: '请填写拒绝原因'
                        },
                        {
                            pattern: /^[^\s]*$/,
                            message: '禁止输入空格',
                        }]}>
                            <TextArea showCount maxLength={500} />
                        </Form.Item>
                    </Form>
                </Modal>
                <DetailTitle title="基本信息" />
                <BaseInfo columns={baseInfoData} dataSource={detailData || {}} col={2} />
                {/* <DetailTitle title="相关附件"/> */}
                {/* <CommonTable columns={[
                    {
                        title: '附件名称',
                        dataIndex: 'name',
                        key: 'name',
                    },
                    {
                        key: 'operation',
                        title: '操作',
                        dataIndex: 'operation',
                        render: (_: undefined, record: any): React.ReactNode => (
                            <Space direction="horizontal" size="small">
                                <Button type='link' onClick={()=>{window.open(record.filePath)}}>下载</Button>
                                {record.fileSuffix==='pdf'?<Button type='link' onClick={()=>{window.open(record.filePath)}}>预览</Button>:null}
                                {['jpg','jpeg', 'png', 'gif'].includes(record.fileSuffix)?<Button type='link' onClick={()=>{setPictureUrl(record.id?record.filePath:record.link);setPictureVisible(true);}}>预览</Button>:null}
                            </Space>
                        )
                    }
                ]} dataSource={detailData?.attachInfoList} pagination={ false } /> */}
                <Attachment dataSource={detailData?.fileVOList} />
                <DetailTitle title="操作信息" />
                <CommonTable columns={tableColumns} dataSource={detailData?.statusRecordList} pagination={false} />
            </DetailContent>
            <Modal visible={pictureVisible} onCancel={handlePictureModalCancel} footer={false}>
                <Image src={pictureUrl} preview={false} />
            </Modal>
        </Spin>
    </>
}