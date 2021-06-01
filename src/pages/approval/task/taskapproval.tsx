/**
 * @author Cory(coryisbest0728#gmail.com)
 * @copyright © 2021 Cory. All rights reserved
 */
import React, { useState } from 'react';
import { Form, Input, Button, Row, Col, DatePicker, Space, Select, Table } from 'antd';
import "./index.less"
import tasklist from './tasklist'
interface IProps {

}
interface IStart {

}
const { Option } = Select;
function handleChange(value: string) {
    console.log(`selected ${value}`);
}
const {dataSource, columns}= tasklist

const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 13 },
    colon: false

};
const tailLayout = {
    wrapperCol: { offset: 8, span: 16 },
};
function onChange(date: any, dateString: any) {
    console.log(date, dateString);
}
const taskapproval = (props: IProps) => {

    const onFinish = (values: any) => {
        console.log('Success:', values);
    };

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    }; return (
        <>
            <Form
                {...layout}
                name="basic"
                initialValues={{ remember: true }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
            >
                <div className="noname">
                    <p><b>基本信息</b> </p></div>
                <Row>
                    <Col xs={{ span: 5, offset: 1 }} lg={{ span: 6, offset: 2 }}>
                        <Form.Item
                            label="任务编号"
                            name="username"
                            rules={[{ required: true, message: 'Please input your username!' }]}
                        >
                            <Input />
                        </Form.Item>

                    </Col>
                    <Col xs={{ span: 5, offset: 1 }} lg={{ span: 6, offset: 2 }}>

                        <Form.Item
                            label="关联订单"
                            name="password"
                            rules={[{ required: true, message: 'Please input your password!' }]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col xs={{ span: 5, offset: 1 }} lg={{ span: 6, offset: 2 }}>
                        <Form.Item
                            label="合同编号"
                            name="password"
                            rules={[{ required: true, message: 'Please input your password!' }]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col xs={{ span: 5, offset: 1 }} lg={{ span: 6, offset: 2 }}>

                        <Form.Item
                            label="工程名称"
                            name="username"
                            rules={[{ required: false, message: 'Please input your username!' }]}
                        >
                            <Input />
                        </Form.Item>

                    </Col>
                    <Col xs={{ span: 5, offset: 1 }} lg={{ span: 6, offset: 2 }}>

                        <Form.Item
                            label="业主单位"
                            name="password"
                            rules={[{ required: false, message: 'Please input your password!' }]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col xs={{ span: 5, offset: 1 }} lg={{ span: 6, offset: 2 }}>
                        <Form.Item
                            label="合同签订单位"
                            name="password"
                            rules={[{ required: false, message: 'Please input your password!' }]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col xs={{ span: 5, offset: 1 }} lg={{ span: 6, offset: 2 }}>

                        <Form.Item
                            label="合同签订日期

                            "
                            name="username"
                            rules={[{ required: false, message: 'Please input your username!' }]}
                        >
                            <Space direction="vertical">
                                <DatePicker onChange={onChange} />
                            </Space>
                        </Form.Item>

                    </Col>
                    <Col xs={{ span: 5, offset: 1 }} lg={{ span: 6, offset: 2 }}>

                        <Form.Item
                            label="客户交货日期"
                            name="password"
                            rules={[{ required: false, message: 'Please input your password!' }]}
                        >
                            <Space direction="vertical">
                                <DatePicker onChange={onChange} />
                            </Space>
                        </Form.Item>
                    </Col>
                    <Col xs={{ span: 5, offset: 1 }} lg={{ span: 6, offset: 2 }}>
                        <Form.Item
                            label=" 计划交货日期"
                            name="password"
                            rules={[{ required: true, message: 'Please input your password!' }]}
                        >
                            <Space direction="vertical">
                                <DatePicker onChange={onChange} />
                            </Space>
                        </Form.Item>
                    </Col>
                </Row>



                <Form.Item
                    className="jhbz"
                    label="计划备注"
                    name="password"
                    rules={[{ required: false, message: 'Please input your password!' }]}
                >
                    <Input />
                </Form.Item>


                <div className="noname2">
                    <p><b>特殊要求</b> </p></div>
                <Row>
                    <Col xs={{ span: 5, offset: 1 }} lg={{ span: 6, offset: 2 }}>
                        <Form.Item
                            label="原材料标准"
                            name="username"
                            rules={[{ required: true, message: 'Please input your username!' }]}
                        >
                            <Select defaultValue="国网" style={{ width: 120 }} onChange={handleChange}>
                                <Option value="国网">国网</Option>
                                <Option value="lucy">Lucy</Option>
                                <Option value="disabled" disabled>Disabled</Option>
                                <Option value="Yiminghe">国网</Option>
                            </Select>
                        </Form.Item>

                    </Col>
                    <Col xs={{ span: 5, offset: 1 }} lg={{ span: 6, offset: 2 }}>

                        <Form.Item
                            label="原材料要求"
                            name="password"
                            rules={[{ required: false, message: 'Please input your password!' }]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col xs={{ span: 5, offset: 1 }} lg={{ span: 6, offset: 2 }}>
                        <Form.Item
                            label="焊接要求"
                            name="password"
                            rules={[{ required: false, message: 'Please input your password!' }]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col xs={{ span: 5, offset: 1 }} lg={{ span: 6, offset: 2 }}>

                        <Form.Item
                            label="包装要求"
                            name="username"
                            rules={[{ required: false, message: 'Please input your username!' }]}
                        >
                            <Input />
                        </Form.Item>

                    </Col>
                    <Col xs={{ span: 5, offset: 1 }} lg={{ span: 6, offset: 2 }}>

                        <Form.Item
                            label="镀锌要求"
                            name="password"
                            rules={[{ required: false, message: 'Please input your password!' }]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                </Row>


                <Form.Item
                    className="bz"
                    label="备注"
                    name="password"
                    rules={[{ required: false, message: 'Please input your password!' }]}
                >
                    <Input />
                </Form.Item>

                <div className="noname2">
                    <p><b>产品信息</b> </p></div>
                    <div className="table">
                    <Table dataSource={dataSource} columns={columns}  bordered  scroll={{ y: 300, x: '100vw' }} />;
                    </div>
             
                <Form.Item {...tailLayout}>
                    <Button type="primary" htmlType="submit">
                        提交
                    </Button>
                </Form.Item>
            </Form>

        </>

    )
}

export default taskapproval;
