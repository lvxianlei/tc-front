
import React, { useState } from 'react';
import { Button, Form, Input, message } from 'antd';
import { useHistory } from 'react-router-dom';
import RequestUtil from '../../utils/RequestUtil';
import { DetailContent } from '../common';

export default function ChangePassWord(): React.ReactNode {
    const [ form ] = Form.useForm();
    const history = useHistory();
    return <>
            <DetailContent operation={[
                <Button type="ghost" onClick={() => {
                    form.resetFields();
                    history.goBack();
                }}>取消</Button>,
                <Button type="primary" style={{marginLeft: 12}} onClick={() => {
                    if(form) {
                        form.validateFields().then(res => {
                            const value = form.getFieldsValue(true);
                            RequestUtil.put(`/sinzetech-user/user/updatePassword?oldPassword=${ value.oldPassword }&password=${ value.password }`).then(res => {
                                form.resetFields();
                                message.success("修改成功！")
                                history.go(-1);
                            })
                        })
                    }
                }}>保存</Button>
            ]}>
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
            </DetailContent>
            
    </>
}