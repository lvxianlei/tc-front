/**
 * @author Cory(coryisbest0728#gmail.com)
 * @copyright © 2021 Cory. All rights reserved
 */
import React, { useState } from 'react'
import { Form, Input, Button, Row, Col, DatePicker, Space, Select, Table } from 'antd';
import "./index.less"
import informationlist from './informationlist'
interface IProps {

}
interface IStart {

}
const { Option } = Select;
function handleChange(value: string) {
    console.log(`selected ${value}`);
}
const { dataSource, columns } = informationlist

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
                            label="订单编号"
                            name="username"
                            rules={[{ required: true, message: 'Please input your username!' }]}
                        >
                            <Input />
                        </Form.Item>

                    </Col>
                    <Col xs={{ span: 5, offset: 1 }} lg={{ span: 6, offset: 2 }}>

                        <Form.Item
                            label="采购订单号"
                            name="password"
                            rules={[{ required: false, message: 'Please input your password!' }]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col xs={{ span: 5, offset: 1 }} lg={{ span: 6, offset: 2 }}>
                        <Form.Item
                            label="关联合同编号"
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
                            label="内部合同编号"
                            name="username"
                            rules={[{ required: false, message: 'Please input your username!' }]}
                        >
                            <Input />
                        </Form.Item>

                    </Col>
                    <Col xs={{ span: 5, offset: 1 }} lg={{ span: 6, offset: 2 }}>

                        <Form.Item
                            label="工程名字"
                            name="password"
                            rules={[{ required: false, message: 'Please input your password!' }]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col xs={{ span: 5, offset: 1 }} lg={{ span: 6, offset: 2 }}>

                        <Form.Item
                            label="业主单位"
                            name="username"
                            rules={[{ required: false, message: 'Please input your username!' }]}
                        >
                                <Input />
                        </Form.Item>

                    </Col>
                    </Row>
                    <Row>
                    <Col xs={{ span: 5, offset: 1 }} lg={{ span: 6, offset: 2 }}>

                        <Form.Item
                            label="合同签订单位"
                            name="password"
                            rules={[{ required: false, message: 'Please input your password!' }]}
                        >
                               <Input />
                        </Form.Item>
                    </Col>
                    <Col xs={{ span: 5, offset: 1 }} lg={{ span: 6, offset: 2 }}>
                        <Form.Item
                            label="合同签订日期"
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
                            label="合同要求交货日期"
                            name="password"
                            rules={[{ required: false, message: 'Please input your password!' }]}
                        >
                            <Space direction="vertical">
                                <DatePicker onChange={onChange} />
                            </Space>
                        </Form.Item>
                    </Col>
                    </Row>
                    <Row>
                    <Col xs={{ span: 5, offset: 1 }} lg={{ span: 6, offset: 2 }}>
                        <Form.Item
                            label="计价方式"
                            name="password"
                            rules={[{ required: false, message: 'Please input your password!' }]}
                        >
                                 <Input />
                        </Form.Item>
                    </Col>
                    <Col xs={{ span: 5, offset: 1 }} lg={{ span: 6, offset: 2 }}>
                        <Form.Item
                            label="币种"
                            name="password"
                            rules={[{ required: false, message: 'Please input your password!' }]}
                        >
                                 <Input />
                        </Form.Item>
                    </Col>
                    <Col xs={{ span: 5, offset: 1 }} lg={{ span: 6, offset: 2 }}>
                        <Form.Item
                            label="订单数量"
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
                            label="含税金额"
                            name="password"
                            rules={[{ required: true, message: 'Please input your password!' }]}
                        >
                                <Input />
                        </Form.Item>
                    </Col>
                    <Col xs={{ span: 5, offset: 1 }} lg={{ span: 6, offset: 2 }}>
                        <Form.Item
                            label="含税单价"
                            name="password"
                            rules={[{ required: false, message: 'Please input your password!' }]}
                        >
                              <Input />
                        </Form.Item>
                    </Col>
                    <Col xs={{ span: 5, offset: 1 }} lg={{ span: 6, offset: 2 }}>
                        <Form.Item
                            label="税率"
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
                            label="不含税金额"
                            name="password"
                            rules={[{ required: false, message: 'Please input your password!' }]}
                        >
                             <Input />
                        </Form.Item>
                    </Col>
                    <Col xs={{ span: 5, offset: 1 }} lg={{ span: 6, offset: 2 }}>
                        <Form.Item
                            label="不含税单价"
                            name="password"
                            rules={[{ required: false, message: 'Please input your password!' }]}
                        >
                               <Input />
                        </Form.Item>
                    </Col>
                    <Col xs={{ span: 5, offset: 1 }} lg={{ span: 6, offset: 2 }}>
                        <Form.Item
                            label="汇率"
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
                            label="外汇金额"
                            name="password"
                            rules={[{ required: false, message: 'Please input your password!' }]}
                        >
                              <Input />
                        </Form.Item>
                    </Col>
                    <Col xs={{ span: 5, offset: 1 }} lg={{ span: 6, offset: 2 }}>
                        <Form.Item
                            label="外汇单价"
                            name="password"
                            rules={[{ required: false, message: 'Please input your password!' }]}
                        >
                               <Input />
                        </Form.Item>
                    </Col>
                    <Col xs={{ span: 5, offset: 1 }} lg={{ span: 6, offset: 2 }}>
                        <Form.Item
                            label="保函类型"
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
                            label="保函金额"
                            name="password"
                            rules={[{ required: false, message: 'Please input your password!' }]}
                        >
                              <Input />
                        </Form.Item>
                    </Col>
                    <Col xs={{ span: 5, offset: 1 }} lg={{ span: 6, offset: 2 }}>
                        <Form.Item
                            label="港口费用"
                            name="password"
                            rules={[{ required: false, message: 'Please input your password!' }]}
                        >
                               <Input />
                        </Form.Item>
                    </Col>
                    <Col xs={{ span: 5, offset: 1 }} lg={{ span: 6, offset: 2 }}>
                        <Form.Item
                            label="海运及保险费"
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
                            label="佣金"
                            name="password"
                            rules={[{ required: false, message: 'Please input your password!' }]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col xs={{ span: 5, offset: 1 }} lg={{ span: 6, offset: 2 }}>
                        <Form.Item
                            label="出口信用保险"
                            name="password"
                            rules={[{ required: false, message: 'Please input your password!' }]}
                        >
                           <Input />
                        </Form.Item>
                    </Col>
                    <Col xs={{ span: 5, offset: 1 }} lg={{ span: 6, offset: 2 }}>
                        <Form.Item
                            label="订单交货日期"
                            name="password"
                            rules={[{ required: true, message: 'Please input your password!' }]}
                        >
                            <Space direction="vertical">
                                <DatePicker onChange={onChange} />
                            </Space>
                        </Form.Item>
                    </Col>
                    </Row>
                    <Row>
                    <Col xs={{ span: 5, offset: 1 }} lg={{ span: 6, offset: 2 }}>
                        <Form.Item

                            label="备注"
                            name="pass2"
                            rules={[{ required: false, message: 'Please input your password!' }]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                </Row>

                <div className="noname2">
                    <p><b>产品信息</b> </p></div>
                <div className="table">
                    <Table dataSource={dataSource} columns={columns as any} bordered scroll={{ y: 300, x: '100vw' }} />;
                     </div>

                <Form.Item {...tailLayout}>

                    <Row  >
                        <Col xs={{ span: 1, offset: 1 }} lg={{ span: 4, offset: 1 }}>
                            <Button type="primary" className="button" htmlType="submit" >通过</Button>
                        </Col>
                        <Col xs={{ span: 3, offset: 1 }} lg={{ span: 4, offset: 1 }}>
                            <Button type="primary" className="button" ghost>驳回</Button>
                        </Col>
                        <Col xs={{ span: 3, offset: 1 }} lg={{ span: 4, offset: 1 }}>
                            <Button type="primary" className="button" ghost>取消</Button>
                        </Col>
                    </Row>

                </Form.Item>

            </Form>

        </>

    )
}

export default taskapproval;
