/**
 * @author zyc
 * @copyright © 2021 
 * @description 个人中心
*/

import React, { useState } from 'react';
import { Spin, Button, Descriptions, Modal, Form, Input } from 'antd';
import { useHistory } from 'react-router-dom';
import { DetailTitle, BaseInfo, DetailContent } from '../../common';
import RequestUtil from '../../../utils/RequestUtil';
import useRequest from '@ahooksjs/use-request';

interface IPersonal {
    readonly userAccount?: string;
    readonly phone?: string;
    readonly description?: string;
    readonly number?: string;
}

const workColums = [
    {
        "dataIndex": "name",
        "title": "姓名："
    },
    {
        "dataIndex": "phone",
        "title": "手机号："
    },
    {
        "dataIndex": "number",
        "title": "工号："
    },
    {
        "dataIndex": "categoryName",
        "title": "员工类型："
    },
    {
        "dataIndex": "deptName",
        "title": "部门："
    },
    {
        "dataIndex": "stationName",
        "title": "职位："
    },
    {
        "dataIndex": "email",
        "title": "邮箱："
    },
    {
        "dataIndex": "description",
        "title": "备注："
    }
]

export default function PersonalCenter(): React.ReactNode {
    const [ visible, setVisible ] = useState(false);
    const [ form ] = Form.useForm();
    const history = useHistory();
    const { loading, data } = useRequest<IPersonal>(() => new Promise(async (resole, reject) => {
        const data: IPersonal = await RequestUtil.get<IPersonal>(`/tower-system/personalCenter`)
        resole(data)
    }), {})
    const detailData: IPersonal = data || {};
    if (loading) {
        return <Spin spinning={loading}>
            <div style={{ width: '100%', height: '300px' }}></div>
        </Spin>
    }

    return <>
        <DetailContent>
            <DetailTitle title="账户信息" />
            <Descriptions title="" bordered size="small" colon={ false } column={ 2 }>
                <Descriptions.Item label="账号：">
                    { detailData.userAccount }
                </Descriptions.Item>
                <Descriptions.Item label="密码：">
                    ******
                    <Button type="link" onClick={ () => setVisible(true) }>修改密码</Button>
                </Descriptions.Item>
            </Descriptions>
            {  detailData.number ? <><DetailTitle title="工作信息" />
            <BaseInfo columns={workColums} dataSource={detailData} col={2} /></> : null}
        </DetailContent>
        <Modal visible={ visible } title="修改密码" onCancel={ () => { setVisible(false); form.resetFields(); }} onOk={ () => {
            if(form) {
                form.validateFields().then(res => {
                    const value = form.getFieldsValue(true);
                    RequestUtil.put(`/sinzetech-user/user/updatePassword?oldPassword=${ value.oldPassword }&password=${ value.password }`).then(res => {
                        setVisible(false);
                        form.resetFields();
                        history.go(0);
                    })
                })
            }
        } }>
            <Form form={ form }>
               <Form.Item label="旧密码" name="oldPassword" rules={[{
                    required: true,
                    message: '请输入旧密码'
                }]}>
                    <Input maxLength={ 50 }/>
               </Form.Item>
               <Form.Item label="新密码" name="password" rules={[{
                    required: true,
                    validator: (_, value) => {
                        if(value) {
                            if(value !== form?.getFieldValue('oldPassword')) {
                                return Promise.resolve();
                            } else {
                                return Promise.reject('新密码和当前密码不能相同');
                            }
                        } else {
                            return Promise.reject('请输入新密码')
                        }
                    }
                }]}>
                    <Input maxLength={ 50 }/>
               </Form.Item>
               <Form.Item label="重复密码" name="confirmPassword" rules={[{
                    required: true,
                    validator: (_, value) => {
                        if(value) {
                            if(value === form?.getFieldValue('password')) {
                                return Promise.resolve();
                            } else {
                                return Promise.reject('与登录密码不相同');
                            }
                        } else {
                            return Promise.reject('请再次输入登录密码')
                        }
                    }
                }]}>
                    <Input maxLength={ 50 }/>
               </Form.Item>
            </Form>
        </Modal>
    </>
}