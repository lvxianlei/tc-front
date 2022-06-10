/**
 * @author zyc
 * @copyright © 2022 
 * @description RD-系统配置-定额配置-新增放样定额配置
 */

import React, { useImperativeHandle, forwardRef } from "react";
import { Form, Input, Select } from 'antd';
import { DetailContent } from '../../common';
import RequestUtil from '../../../utils/RequestUtil';
import useRequest from '@ahooksjs/use-request';
import moment from "moment";
import { productTypeOptions } from "../../../configuration/DictionaryOptions";

interface modalProps {
    readonly id?: string;
    readonly type?: 'new' | 'edit';
}

export default forwardRef(function LoftQuotaNew({ id, type }: modalProps, ref) {
    const { loading, data } = useRequest<any>(() => new Promise(async (resole, reject) => {
        try {
            const result = await RequestUtil.get<any>(`/tower-tdm/loftProcess/getSegAssignList/${id}`);
            form.setFieldsValue({
                data: [...result.map((res: any) => {
                    return {
                        ...res,
                        planCompletionDate: res?.planCompletionDate && moment(res?.planCompletionDate)
                    }
                })]
            })
            resole(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: type === "new", refreshDeps: [id, type] })

    const { run: saveRun } = useRequest<{ [key: string]: any }>((data: any) => new Promise(async (resove, reject) => {
        try {
            const result: { [key: string]: any } = await RequestUtil.post(``, data)
            resove(result)
        } catch (error) {
            reject(error)
        }
    }), { manual: true })

    const onSubmit = () => new Promise(async (resolve, reject) => {
        try {
            const value = await form.validateFields()
            await saveRun({
                ...value
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
            <Form.Item name={'name'} label="产品类型" rules={[{ required: true, message: '请选择产品类型' }]}>
                <Select style={{ width: '100%' }} >
                    <Select.Option key={0} value={""}>全部</Select.Option>
                    {
                        productTypeOptions?.map((item: any, index: number) =>
                            <Select.Option value={item.id} key={index}>
                                {item.name}
                            </Select.Option>
                        )
                    }
                </Select>
            </Form.Item>
            <Form.Item name={'name'} label="定额条目" rules={[{ required: true, message: '请输入定额条目' }]}>
                <Input maxLength={100} />
            </Form.Item>
            <Form.Item name={'name'} label="【0-330】电压等级定额" rules={[{ required: true, message: '请输入【0-330】电压等级定额' }]}>
                <Input maxLength={100} />
            </Form.Item>
            <Form.Item name={'name'} label="【500kV-750kV】定额" rules={[{ required: true, message: '请输入【500kV-750kV】定额' }]}>
                <Input maxLength={100} />
            </Form.Item>
            <Form.Item name={'name'} label="【800kV+】定额" rules={[{ required: true, message: '请输入【800kV+】定额' }]}>
                <Input maxLength={100} />
            </Form.Item>
            <Form.Item name={'name'} label="特殊定额" rules={[{ required: true, message: '请输入特殊定额' }]}>
                <Input maxLength={100} />
            </Form.Item>
        </Form>
    </DetailContent>
})

