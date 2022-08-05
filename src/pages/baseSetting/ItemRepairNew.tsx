/**
 * @author zyc
 * @copyright © 2022 
 * @description RD-系统设置-返修件条目配置-新增
 */

import React, { useImperativeHandle, forwardRef } from "react";
import { Col, Form, Input, InputNumber, Row, Select } from 'antd';
import { DetailContent } from '../common';
import RequestUtil from '../../utils/RequestUtil';
import useRequest from '@ahooksjs/use-request';

interface modalProps {
    readonly record?: any;
    readonly type?: 'new' | 'edit';
}

export default forwardRef(function ItemRepairNew({ record, type }: modalProps, ref) {
    const { loading } = useRequest<any>(() => new Promise(async (resole, reject) => {
        try {
            form.setFieldsValue({ ...record })
            resole(true);
        } catch (error) {
            reject(error)
        }
    }), { manual: type === "new", refreshDeps: [record, type] })

    const { run: saveRun } = useRequest<{ [key: string]: any }>((data: any) => new Promise(async (resove, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil[type === 'new' ? 'post' : 'put'](`/tower-science/config/fixItem`, data)
            resove(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    const onSubmit = () => new Promise(async (resolve, reject) => {
        try {
            const value = await form.validateFields();
            await saveRun({
                ...value,
                typeId: record?.typeId,
                id: record?.id || ''
            })
            resolve(true);
        } catch (error) {
            reject(false)
        }
    })

    const resetFields = () => {
        form.resetFields()
    }

    useImperativeHandle(ref, () => ({ onSubmit, resetFields }), [ref, onSubmit, resetFields]);

    const [form] = Form.useForm();

    return <DetailContent key='ItemRepairNew'>
        <Form form={form} layout="horizontal" labelCol={{ span: 8 }}>
            <Row>
                <Col span={5}>
                    <Form.Item name={'fixType'} label="返修件条目" rules={[{ required: true, message: '请输入返修件条目' }]}>
                        <Input maxLength={200} />
                    </Form.Item>
                </Col>
                <Col span={5} offset={1}>
                    <Form.Item name={'measuringUnit'} label="单位" rules={[{ required: true, message: '请选择单位' }]}>
                        <Select style={{ width: '100%' }}>
                            <Select.Option key={1} value="件号数">件号数</Select.Option>
                            <Select.Option key={2} value="件数">件数</Select.Option>
                            <Select.Option key={3} value="重量（吨）">重量（吨）</Select.Option>
                        </Select>
                    </Form.Item>
                </Col>
                <Col span={5} offset={1}>
                    <Form.Item name={'amount'} label="金额" rules={[{ required: true, message: '请输入金额' }]}>
                        <InputNumber max={9999.99} min={0} style={{ width: '100%' }} />
                    </Form.Item>
                </Col>
                <Col span={5} offset={1}>
                    <Form.Item name={'maxAmount'} label="上限金额">
                        <InputNumber max={9999.99} min={0} style={{ width: '100%' }} />
                    </Form.Item>
                </Col>
            </Row>
        </Form>
    </DetailContent>
})

