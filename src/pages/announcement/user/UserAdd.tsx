import React, { useRef, useState } from 'react';
import { Spin, Button, Space, Form, Input } from 'antd';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import { DetailTitle, DetailContent, Attachment, AttachmentRef } from '../../common';
import RequestUtil from '../../../utils/RequestUtil';
import useRequest from '@ahooksjs/use-request';
import styles from '../AnnouncementMngt.module.less';
import { IAnnouncement, IStaffList } from '../AnnouncementMngt';
import SelectUserTransfer from '../SelectUserTransfer';
import { IStaff } from '../../dept/staff/StaffMngt';

export default function UserAdd(): React.ReactNode {
    const [form] = Form.useForm();
    const location = useLocation<{ type: string }>();
    const [staffList, setStaffList] = useState<IStaffList[]>([]);
    const [detailData, setDetailData] = useState<any>({});
    const history = useHistory();
    const params = useParams<{ id: string }>();
    const { loading } = useRequest<any>(() => new Promise(async (resole, reject) => {
        resole({});
    }), {})

    if (loading) {
        return <Spin spinning={loading}>
            <div style={{ width: '100%', height: '300px' }}></div>
        </Spin>
    }

    const save = async (state: number) => {
        if (form) {
            await form.validateFields();
            let value = form.getFieldsValue(true);
            RequestUtil.post<IAnnouncement>(`/tower-system/noticeGroup`, {
                id: detailData.id,
                ...value,
                noticeGroupEmployeeDTOList: staffList.map((res: IStaffList) => { return {employeeId: res?.id} }),
                // state: state
            }).then(res => {
                history.goBack();
            });
        }
    }

    return <>
        <DetailContent operation={[
            <Space direction="horizontal" size="small" className={styles.bottomBtn}>
                <Button key="saveC" type="primary" onClick={() => save(0)}>保存</Button>
                <Button key="cancel" type="ghost" onClick={() => history.goBack()}>取消</Button>
            </Space>
        ]}>
            <DetailTitle title="基本信息" key={1} />
            <Form form={form} labelCol={{ span: 2 }}>
                <Form.Item name="name" label="分组名称" initialValue={detailData.name} rules={[{
                    "required": true,
                    "message": "请输入分组名称"
                },
                {
                    pattern: /^[^\s]*$/,
                    message: '禁止输入空格',
                }]}>
                    <Input placeholder="请输入" />
                </Form.Item>
                <Form.Item name="type" label="分组分类" initialValue={detailData.type} rules={[{
                    "required": true,
                    "message": "请输入分组分类"
                },
                {
                    pattern: /^[^\s]*$/,
                    message: '禁止输入空格',
                }]}>
                    <Input placeholder="请输入"  />
                </Form.Item>
                <Form.Item name="userNames" label="员工" initialValue={detailData.userNames} rules={[{
                    "required": true,
                    "message": "请选择员工"
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
                <Form.Item name="description" label="备注" initialValue={detailData.content} >
                    <Input.TextArea  />
                </Form.Item>
            </Form>
        </DetailContent>
    </>
}