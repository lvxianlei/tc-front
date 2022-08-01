/**
 * @author zyc
 * @copyright © 2022 
 * @description RD-系统配置-定额配置-新增提料定额配置
 */

import React, { useImperativeHandle, forwardRef } from "react";
import { Form, Input, InputNumber, Select } from 'antd';
import { DetailContent } from '../../common';
import RequestUtil from '../../../utils/RequestUtil';
import useRequest from '@ahooksjs/use-request';
import { productTypeOptions } from "../../../configuration/DictionaryOptions";

interface modalProps {
    readonly record?: any;
    readonly type?: 'new' | 'edit';
}

export default forwardRef(function MaterialQuotaNew({ record, type }: modalProps, ref) {
    const { loading } = useRequest<any>(() => new Promise(async (resole, reject) => {
        try {
            console.log(record)
            form.setFieldsValue({ ...record })
            resole(true);
        } catch (error) {
            reject(error)
        }
    }), { manual: type === "new", refreshDeps: [record, type] })

    const { run: saveRun } = useRequest<{ [key: string]: any }>((data: any) => new Promise(async (resove, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.post(`/tower-science/projectPrice/material`, data)
            resove(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    const onSubmit = () => new Promise(async (resolve, reject) => {
        try {
            const value = await form.validateFields()
            await saveRun({
                ...value,
                id: record?.id || ''
            })
            resolve(true);
        } catch (error) {
            reject(false)
        }
    })

    useImperativeHandle(ref, () => ({ onSubmit }), [ref, onSubmit]);

    const [form] = Form.useForm();

    return <DetailContent key='TowerDispatch'>
        <Form form={form} layout="horizontal" labelCol={{ span: 8 }}>
            <Form.Item name={'productType'} label="产品类型" rules={[{ required: true, message: '请选择产品类型' }]}>
                <Select style={{ width: '100%' }} >
                    {
                        productTypeOptions?.map((item: any, index: number) =>
                            <Select.Option value={item.id} key={index}>
                                {item.name}
                            </Select.Option>
                        )
                    }
                </Select>
            </Form.Item>
            <Form.Item name={'projectEntries'} label="定额条目" rules={[{ required: true, message: '请输入定额条目' }]}>
                <Input maxLength={100} />
            </Form.Item>
            <Form.Item name={'materialCategory'} label="提料" rules={[{ required: true, message: '请输入提料' }]}>
                <InputNumber min={0} max={99} style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item name={'proofread'} label="校核" rules={[{ required: true, message: '请输入校核' }]}>
                <InputNumber min={0} max={99} style={{ width: '100%' }} />
            </Form.Item>
        </Form>
    </DetailContent>
})

