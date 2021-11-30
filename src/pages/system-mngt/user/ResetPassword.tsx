import React, { useState } from 'react';
import { Modal, Button, Input, Form, message } from 'antd';


interface Assciated {
    item: object,
    hanleCallBack?: () => void;
}
export default function ResetPassword(props: Assciated): JSX.Element {
    const [ visible, setVisible ] = useState<boolean>(false);
    const [form] = Form.useForm();
    const handleClick = () => {
        console.log(props, '-----------------------------')
        setVisible(true);
    }
    const onFinish = async() => {
        const data = await form.validateFields();
        console.log(data, '------data')
        if (data.password !== data.username) {
            message.error("两次输入的密码必须一致！");
            return false;
        }
        setVisible(false);
        props.hanleCallBack && props.hanleCallBack();
    };
    return (
        <>
            <Button type="link" onClick={handleClick}>重置密码</Button>
            <Modal
                title={'重置密码'}
                visible={visible}
                width={600}
                onCancel={() => {
                    setVisible(false);
                    form.resetFields();
                }}
                  footer={[
                    <Button key="submit" type="primary" onClick={onFinish}>
                      确定
                    </Button>,
                    <Button key="back" onClick={() => {
                        form.resetFields();
                        setVisible(false);
                    }}>
                      取消
                    </Button>
                  ]}
            >
                <Form
                    form={form}
                    name="basic"
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 20 }}
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                    autoComplete="off"
                    >
                    <Form.Item
                        label="新密码"
                        name="username"
                        rules={[{ required: true, message: '请输入新密码' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="重复密码"
                        name="password"
                        rules={[{ required: true, message: '请再一次输入新密码' }]}
                    >
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    )
}
