import React, { useRef, useState } from 'react';
import { Spin, Button, Space, Form, Input } from 'antd';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import { DetailTitle, DetailContent, Attachment, AttachmentRef } from '../common';
import RequestUtil from '../../utils/RequestUtil';
import useRequest from '@ahooksjs/use-request';
import styles from './AnnouncementMngt.module.less';
import { IAnnouncement, IStaffList } from './AnnouncementMngt';
import SelectUserTransfer from './SelectUserTransfer';
import { IStaff } from '../dept/staff/StaffMngt';
import BraftEditor from 'braft-editor'
import 'braft-editor/dist/index.css'
export default function AnnouncementNew(): React.ReactNode {
    const [form] = Form.useForm();
    const attachRef = useRef<AttachmentRef>()
    // const [attachInfo, setAttachInfo] = useState<FileProps[]>([]);
    const location = useLocation<{ type: string }>();
    const [staffList, setStaffList] = useState<IStaffList[]>([]);
    const [detailData, setDetailData] = useState<IAnnouncement>({});

    const history = useHistory();
    const params = useParams<{ id: string }>();
    const { loading } = useRequest<IAnnouncement>(() => new Promise(async (resole, reject) => {
        if (location.state.type === 'edit') {
            let data = await RequestUtil.get<IAnnouncement>(`/tower-system/notice/getNoticeById/${params.id}`);
            setDetailData({
                ...data, userNames: data.staffList?.map((res: IStaffList) => { return res.userName }).join(','), staffList: data.staffList?.map((res: IStaffList) => {
                    return {
                        name: res.userName,
                        id: res.userId
                    }
                }) || []
            });
            setStaffList(data.staffList?.map((res: IStaffList) => {
                return {
                    name: res.userName,
                    id: res.userId
                }
            }) || [])
            resole(data);
        } else {
            resole({});
        }
    }), {})

    if (loading) {
        return <Spin spinning={loading}>
            <div style={{ width: '100%', height: '300px' }}></div>
        </Spin>
    }

    const save = (state: number) => {
        if (form) {
            form.validateFields().then(res => {
                let value = form.getFieldsValue(true);
                if (location.state.type === 'new') {
                    RequestUtil.post<IAnnouncement>(`/tower-system/notice`, {
                        id: detailData.id,
                        ...value,
                        fileIds: attachRef.current?.getDataSource().map(item => item.id),
                        staffList: staffList.map((res: IStaffList) => { return res?.id }),
                        state: state
                    }).then(res => {
                        history.goBack();
                    });
                } else {
                    RequestUtil.put<IAnnouncement>(`/tower-system/notice`, {
                        id: detailData.id,
                        ...value,
                        fileIds: attachRef.current?.getDataSource().map(item => item.id),
                        staffList: staffList.map((res: IStaffList) => { return res?.id }),
                        state: state
                    }).then(res => {
                        history.goBack();
                    });
                }
            })
        }
    }

    return <>
        <DetailContent operation={[
            <Space direction="horizontal" size="small" className={styles.bottomBtn}>
                <Button key="save" type="primary" onClick={() => save(1)}>立即发布</Button>
                <Button key="saveC" type="primary" onClick={() => save(0)}>保存草稿</Button>
                <Button key="cancel" type="ghost" onClick={() => history.goBack()}>取消</Button>
            </Space>
        ]}>
            <BraftEditor
                value={""}
            />
            <DetailTitle title="基本信息" key={1} />
            <Form form={form} labelCol={{ span: 2 }}>
                <Form.Item name="title" label="标题" initialValue={detailData.title} rules={[{
                    "required": true,
                    "message": "请输入标题"
                },
                {
                    pattern: /^[^\s]*$/,
                    message: '禁止输入空格',
                }]}>
                    <Input placeholder="请输入" maxLength={50} />
                </Form.Item>
                <Form.Item name="content" label="内容" initialValue={detailData.content} rules={[{
                    "required": true,
                    "message": "请输入内容"
                },
                {
                    pattern: /^[^\s]*$/,
                    message: '禁止输入空格',
                }]}>
                    <Input placeholder="请输入" maxLength={50} />
                </Form.Item>
                <Form.Item name="userNames" label="接收人" initialValue={detailData.userNames} rules={[{
                    "required": true,
                    "message": "请选择接收人"
                }]}>
                    <Input addonBefore={<SelectUserTransfer save={(selectRows: IStaff[]) => {
                        const userNames = selectRows.map(res => { return res.name }).join(',');
                        form.setFieldsValue({ userNames: userNames, staffList: staffList });
                        setStaffList(selectRows.map(res => {
                            return {
                                id: res?.id,
                                name: res?.name
                            }
                        }));
                        setDetailData({ ...detailData, userNames: userNames, staffList: selectRows })
                    }} staffData={detailData?.staffList} />} disabled />
                </Form.Item>
            </Form>
            <Attachment ref={attachRef} dataSource={detailData.attachInfoVos} edit />
        </DetailContent>
    </>
}